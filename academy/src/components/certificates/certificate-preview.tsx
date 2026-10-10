import * as React from "react";
import { site } from "@/lib/config/site";
import { cn, formatDate } from "@/lib/utils";

/**
 * Fixed document colours: a certificate is a printed artefact, so the preview
 * keeps the cream/rose/gold palette in both light and dark mode and matches
 * the PDF exactly.
 */
const PAPER = {
  cream: "#fbf6ef",
  cream2: "#f4ecdf",
  ink: "#2e2a27",
  muted: "#6f6660",
  rose: "#9a4f56",
  gold: "#d9b36c",
  sage: "#5f7a5b",
} as const;

export interface CertificatePreviewProps extends React.ComponentProps<"div"> {
  learnerName: string;
  courseTitle: string;
  issuedAt: string;
  certificateId: string;
  verifyCode: string;
  verifyUrl: string;
  /** PNG data URL from `qrcode`; omitted on compact previews. */
  qrDataUrl?: string | null;
  revoked?: boolean;
  /** Thumbnail for list cards: smaller type, no id/QR row. */
  compact?: boolean;
}

/** On-screen HTML rendition of the certificate design (A4 landscape proportions). */
function CertificatePreview({
  learnerName,
  courseTitle,
  issuedAt,
  certificateId,
  verifyCode,
  verifyUrl,
  qrDataUrl = null,
  revoked = false,
  compact = false,
  className,
  style,
  ...props
}: CertificatePreviewProps) {
  const verifyDisplay = verifyUrl.replace(/^https?:\/\//, "");
  return (
    <div
      data-slot="certificate-preview"
      role="img"
      aria-label={`Certificate of Completion: ${learnerName}, ${courseTitle}, completed ${formatDate(issuedAt)}${revoked ? ", revoked" : ""}`}
      className={cn("relative aspect-[1.414/1] w-full overflow-hidden rounded-lg shadow-card", className)}
      style={{ background: PAPER.cream, color: PAPER.ink, ...style }}
      {...props}
    >
      {/* double frame */}
      <div aria-hidden="true" className={cn("absolute inset-[3%] rounded-sm border", compact ? "border-[1px]" : "border-[1.5px]")} style={{ borderColor: PAPER.gold }} />
      <div aria-hidden="true" className="absolute inset-[4.2%] rounded-sm border" style={{ borderColor: `${PAPER.gold}80` }} />

      <div className={cn("absolute inset-[6%] flex flex-col items-center text-center", compact ? "justify-center" : "justify-between")}>
        <div className="flex w-full flex-col items-center">
          <p
            className={cn("font-sans font-bold uppercase", compact ? "text-[5px] tracking-[0.25em] sm:text-[7px]" : "text-[9px] tracking-[0.3em] sm:text-[11px] md:text-xs")}
            style={{ color: PAPER.rose }}
          >
            Cradle Your Cravings Academy
          </p>
          <span aria-hidden="true" className={cn("rounded-full", compact ? "mt-1.5 h-px w-10" : "mt-3 h-px w-24 sm:w-32")} style={{ background: `linear-gradient(90deg, transparent, ${PAPER.gold}, transparent)` }} />
          <h3
            className={cn("font-serif font-medium tracking-tight", compact ? "mt-2 text-[13px] sm:text-base" : "mt-4 text-[clamp(1.4rem,4.5vw,3rem)]")}
            style={{ color: PAPER.ink, lineHeight: 1.05 }}
          >
            Certificate of Completion
          </h3>
          <p className={cn("font-sans", compact ? "mt-1.5 text-[5px] sm:text-[7px]" : "mt-4 text-[10px] sm:text-xs md:text-sm")} style={{ color: PAPER.muted }}>
            This certifies that
          </p>
          <p
            className={cn("font-serif font-medium text-balance", compact ? "mt-0.5 text-[12px] sm:text-[15px]" : "mt-1 text-[clamp(1.25rem,4vw,2.6rem)]")}
            style={{ color: PAPER.ink, lineHeight: 1.1 }}
          >
            {learnerName}
          </p>
          <p className={cn("font-sans", compact ? "mt-1 text-[5px] sm:text-[7px]" : "mt-3 text-[10px] sm:text-xs md:text-sm")} style={{ color: PAPER.muted }}>
            has completed
          </p>
          <p
            className={cn("mx-auto max-w-[85%] font-serif font-medium text-balance", compact ? "mt-0.5 text-[8px] sm:text-[10px]" : "mt-1 text-[clamp(0.95rem,2.4vw,1.5rem)]")}
            style={{ color: PAPER.rose, lineHeight: 1.2 }}
          >
            {courseTitle}
          </p>
          <p className={cn("font-sans", compact ? "mt-1 text-[5px] sm:text-[6px]" : "mt-3 text-[10px] sm:text-xs")} style={{ color: PAPER.muted }}>
            Completed on <time dateTime={issuedAt}>{formatDate(issuedAt)}</time>
          </p>
        </div>

        {!compact ? (
          <div className="flex w-full items-end justify-between gap-4">
            <div className="min-w-0 text-left font-sans text-[7px] leading-relaxed sm:text-[9px] md:text-[10px]" style={{ color: PAPER.muted }}>
              <p>
                Certificate ID <span className="font-mono" style={{ color: PAPER.ink }}>{certificateId}</span>
              </p>
              <p>
                Verify code <span className="font-mono font-semibold tracking-wider" style={{ color: PAPER.ink }}>{verifyCode}</span>
              </p>
              <p className="truncate">{verifyDisplay}</p>
            </div>
            <div className="flex flex-col items-center">
              <span aria-hidden="true" className="h-px w-28 sm:w-40" style={{ background: PAPER.ink }} />
              <p className="mt-1 font-serif text-[10px] font-medium sm:text-sm md:text-base" style={{ color: PAPER.ink }}>
                {site.instructor.name}
              </p>
              <p className="font-sans text-[7px] font-bold tracking-[0.2em] uppercase sm:text-[9px]" style={{ color: PAPER.rose }}>
                Instructor
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL, not an optimisable asset
                <img src={qrDataUrl} alt="" aria-hidden="true" className="size-12 rounded-sm sm:size-16 md:size-20" style={{ background: PAPER.cream }} />
              ) : (
                <span aria-hidden="true" className="size-12 rounded-sm sm:size-16 md:size-20" style={{ background: PAPER.cream2 }} />
              )}
            </div>
          </div>
        ) : null}
      </div>

      {!compact ? (
        <p
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[4.8%] text-center font-sans text-[7px] tracking-[0.2em] uppercase sm:text-[8px]"
          style={{ color: PAPER.muted }}
        >
          Cradle Your Cravings Academy
        </p>
      ) : null}

      {revoked ? (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(251, 246, 239, 0.55)" }}>
          <span
            className={cn("rotate-[-14deg] rounded-md border-2 px-4 py-1 font-sans font-bold tracking-[0.3em] uppercase", compact ? "text-[8px]" : "text-sm sm:text-xl")}
            style={{ borderColor: "#a4423f", color: "#a4423f" }}
          >
            Revoked
          </span>
        </div>
      ) : null}
    </div>
  );
}

export { CertificatePreview, PAPER as CERTIFICATE_PAPER };
