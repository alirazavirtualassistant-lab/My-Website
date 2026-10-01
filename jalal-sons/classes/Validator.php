<?php
/**
 * Small fluent validator for form input. Collects the first error per field.
 *
 *   $v = new Validator($_POST);
 *   $v->required('name', 'Product name')->max('name', 150)->numeric('base_price');
 *   if ($v->fails()) { $errors = $v->errors(); }
 */
declare(strict_types=1);

final class Validator
{
    private array $errors = [];
    private array $labels = [];

    public function __construct(private array $data)
    {
    }

    /** Raw (trimmed) value of a field. */
    public function value(string $field): mixed
    {
        $v = $this->data[$field] ?? null;
        return is_string($v) ? trim($v) : $v;
    }

    private function label(string $field, ?string $label = null): string
    {
        if ($label !== null) {
            $this->labels[$field] = $label;
        }
        return $this->labels[$field] ?? ucfirst(str_replace('_', ' ', $field));
    }

    private function fail(string $field, string $message): void
    {
        if (!isset($this->errors[$field])) {
            $this->errors[$field] = $message;
        }
    }

    private function filled(string $field): bool
    {
        $v = $this->value($field);
        return !($v === null || $v === '' || $v === []);
    }

    public function required(string $field, ?string $label = null): self
    {
        if (!$this->filled($field)) {
            $this->fail($field, $this->label($field, $label) . ' is required.');
        }
        return $this;
    }

    public function max(string $field, int $max): self
    {
        if ($this->filled($field) && mb_strlen((string) $this->value($field)) > $max) {
            $this->fail($field, $this->label($field) . " may not be longer than $max characters.");
        }
        return $this;
    }

    public function min(string $field, int $min): self
    {
        if ($this->filled($field) && mb_strlen((string) $this->value($field)) < $min) {
            $this->fail($field, $this->label($field) . " must be at least $min characters.");
        }
        return $this;
    }

    public function numeric(string $field): self
    {
        if ($this->filled($field) && !is_numeric($this->value($field))) {
            $this->fail($field, $this->label($field) . ' must be a number.');
        }
        return $this;
    }

    public function integer(string $field): self
    {
        if ($this->filled($field) && filter_var($this->value($field), FILTER_VALIDATE_INT) === false) {
            $this->fail($field, $this->label($field) . ' must be a whole number.');
        }
        return $this;
    }

    public function between(string $field, float $min, float $max): self
    {
        if ($this->filled($field) && is_numeric($this->value($field))) {
            $n = (float) $this->value($field);
            if ($n < $min || $n > $max) {
                $this->fail($field, $this->label($field) . " must be between $min and $max.");
            }
        }
        return $this;
    }

    public function in(string $field, array $allowed): self
    {
        if ($this->filled($field) && !in_array((string) $this->value($field), array_map('strval', $allowed), true)) {
            $this->fail($field, $this->label($field) . ' has an invalid value.');
        }
        return $this;
    }

    public function email(string $field): self
    {
        if ($this->filled($field) && filter_var($this->value($field), FILTER_VALIDATE_EMAIL) === false) {
            $this->fail($field, 'Please enter a valid email address.');
        }
        return $this;
    }

    /** Pakistani mobile: 03XXXXXXXXX or +923XXXXXXXXX. */
    public function phone(string $field): self
    {
        if ($this->filled($field) && normalize_phone((string) $this->value($field)) === null) {
            $this->fail($field, 'Please enter a valid mobile number, e.g. 03XXXXXXXXX.');
        }
        return $this;
    }

    public function regex(string $field, string $pattern, ?string $message = null): self
    {
        if ($this->filled($field) && !preg_match($pattern, (string) $this->value($field))) {
            $this->fail($field, $message ?? $this->label($field) . ' has an invalid format.');
        }
        return $this;
    }

    public function same(string $field, string $other, ?string $message = null): self
    {
        if (($this->data[$field] ?? null) !== ($this->data[$other] ?? null)) {
            $this->fail($field, $message ?? $this->label($field) . ' does not match.');
        }
        return $this;
    }

    /** Custom rule: callback receives (value, all data) and returns true when valid. */
    public function custom(string $field, callable $rule, string $message): self
    {
        if (!$rule($this->value($field), $this->data)) {
            $this->fail($field, $message);
        }
        return $this;
    }

    /** Adds an error from outside (e.g. a database uniqueness check). */
    public function addError(string $field, string $message): self
    {
        $this->fail($field, $message);
        return $this;
    }

    public function passes(): bool
    {
        return $this->errors === [];
    }

    public function fails(): bool
    {
        return !$this->passes();
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function first(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
