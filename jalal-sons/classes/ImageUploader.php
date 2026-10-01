<?php
/**
 * Validates, sanitises and stores product images.
 *
 * - Whitelists JPEG, PNG and WebP by extension AND real content (finfo +
 *   getimagesize), so a .php renamed to .jpg is rejected.
 * - Enforces per-file size and per-request count limits.
 * - Re-encodes every image with GD (strips any embedded payload/EXIF) to a
 *   1600 px main image and a 600 px thumbnail with random file names
 *   under /uploads/products/{product_id}/.
 */
declare(strict_types=1);

final class ImageUploader
{
    private const ALLOWED = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    private array $errors = [];

    public function __construct(private int $productId)
    {
    }

    public function errors(): array
    {
        return $this->errors;
    }

    /**
     * Processes a $_FILES entry that may hold several files (name="images[]").
     * Returns a list of ['image_path' => ..., 'thumb_path' => ...] for the
     * files that were accepted; problems are collected in errors().
     */
    public function handle(array $files): array
    {
        $saved = [];
        if (empty($files['name']) || !is_array($files['name'])) {
            return $saved;
        }
        $maxFiles = (int) config('uploads.max_files', 8);
        $maxSize = (int) config('uploads.max_size', 5 * 1024 * 1024);
        $count = 0;

        foreach ($files['name'] as $i => $name) {
            $name = (string) $name;
            if ($name === '' || (int) $files['error'][$i] === UPLOAD_ERR_NO_FILE) {
                continue;
            }
            if (++$count > $maxFiles) {
                $this->errors[] = "Only $maxFiles images can be uploaded at a time; \"$name\" was skipped.";
                continue;
            }
            $error = (int) $files['error'][$i];
            if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
                $this->errors[] = "\"$name\" is larger than " . $this->mb($maxSize) . " and was not uploaded.";
                continue;
            }
            if ($error !== UPLOAD_ERR_OK) {
                $this->errors[] = "\"$name\" could not be uploaded (error $error).";
                continue;
            }
            $tmp = (string) $files['tmp_name'][$i];
            if (!is_uploaded_file($tmp)) {
                $this->errors[] = "\"$name\" is not a valid upload.";
                continue;
            }
            if ((int) $files['size'][$i] > $maxSize || filesize($tmp) > $maxSize) {
                $this->errors[] = "\"$name\" is larger than " . $this->mb($maxSize) . ". Please use a smaller image.";
                continue;
            }

            $mime = $this->detectMime($tmp, $name);
            if ($mime === null) {
                $this->errors[] = "\"$name\" is not a JPEG, PNG or WebP image and was rejected.";
                continue;
            }

            try {
                $saved[] = $this->process($tmp, $mime, pathinfo($name, PATHINFO_FILENAME));
            } catch (Throwable $e) {
                log_message('error', 'Image processing failed: ' . $e->getMessage());
                $this->errors[] = "\"$name\" could not be processed. Please try another image.";
            }
        }
        return $saved;
    }

    /** Real MIME type via finfo + getimagesize, cross-checked with the extension. */
    private function detectMime(string $tmp, string $originalName): ?string
    {
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $extMap = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp'];
        if (!isset($extMap[$ext])) {
            return null;
        }
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = (string) $finfo->file($tmp);
        if (!isset(self::ALLOWED[$mime]) || $mime !== $extMap[$ext]) {
            return null;
        }
        $info = @getimagesize($tmp);
        if ($info === false || ($info['mime'] ?? '') !== $mime || $info[0] < 1 || $info[1] < 1) {
            return null;
        }
        return $mime;
    }

    /** Re-encodes to main + thumbnail and returns their web paths. */
    private function process(string $tmp, string $mime, string $baseName): array
    {
        $dirRel = 'uploads/products/' . $this->productId;
        $dirAbs = ROOT_PATH . '/' . $dirRel;
        if (!is_dir($dirAbs) && !mkdir($dirAbs, 0775, true) && !is_dir($dirAbs)) {
            throw new RuntimeException('Cannot create upload directory.');
        }

        $src = match ($mime) {
            'image/jpeg' => imagecreatefromjpeg($tmp),
            'image/png'  => imagecreatefrompng($tmp),
            'image/webp' => imagecreatefromwebp($tmp),
        };
        if (!$src) {
            throw new RuntimeException('GD could not read the image.');
        }
        // Respect camera orientation for JPEGs.
        if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
            $exif = @exif_read_data($tmp);
            $o = (int) ($exif['Orientation'] ?? 1);
            $angle = match ($o) { 3 => 180, 6 => -90, 8 => 90, default => 0 };
            if ($angle !== 0) {
                $rot = imagerotate($src, $angle, 0);
                if ($rot) {
                    imagedestroy($src);
                    $src = $rot;
                }
            }
        }

        $ext = self::ALLOWED[$mime];
        $token = bin2hex(random_bytes(8));
        $mainRel = "$dirRel/$token.$ext";
        $thumbRel = "$dirRel/{$token}_thumb.$ext";

        $this->saveResized($src, (int) config('uploads.main_width', 1600), $mime, ROOT_PATH . '/' . $mainRel);
        $this->saveResized($src, (int) config('uploads.thumb_width', 600), $mime, ROOT_PATH . '/' . $thumbRel);
        imagedestroy($src);

        return ['image_path' => $mainRel, 'thumb_path' => $thumbRel];
    }

    /** Scales down (never up) to a max width and writes the file. */
    private function saveResized(GdImage $src, int $maxWidth, string $mime, string $dest): void
    {
        $w = imagesx($src);
        $h = imagesy($src);
        $scale = $w > $maxWidth ? $maxWidth / $w : 1.0;
        $nw = max(1, (int) round($w * $scale));
        $nh = max(1, (int) round($h * $scale));

        $dst = imagecreatetruecolor($nw, $nh);
        if ($mime !== 'image/jpeg') {
            imagealphablending($dst, false);
            imagesavealpha($dst, true);
            $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
            imagefilledrectangle($dst, 0, 0, $nw, $nh, $transparent);
        }
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);

        $ok = match ($mime) {
            'image/jpeg' => imagejpeg($dst, $dest, 85),
            'image/png'  => imagepng($dst, $dest, 7),
            'image/webp' => imagewebp($dst, $dest, 85),
        };
        imagedestroy($dst);
        if (!$ok) {
            throw new RuntimeException('Could not write image file.');
        }
        @chmod($dest, 0644);
    }

    /** Deletes an image row's files from disk (uploads only, never assets). */
    public static function deleteFiles(array $image): void
    {
        foreach (['image_path', 'thumb_path'] as $key) {
            $rel = (string) ($image[$key] ?? '');
            if ($rel !== '' && str_starts_with($rel, 'uploads/products/')) {
                $abs = ROOT_PATH . '/' . $rel;
                if (is_file($abs)) {
                    @unlink($abs);
                }
            }
        }
    }

    private function mb(int $bytes): string
    {
        return rtrim(rtrim(number_format($bytes / 1048576, 1), '0'), '.') . ' MB';
    }
}
