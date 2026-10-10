import { describe, expect, it } from "vitest";
import { attachmentDisposition, certificateFilename } from "@/components/certificates/certificate-filename";

describe("certificateFilename", () => {
  it("uses the course slug", () => {
    expect(certificateFilename("baby-steps")).toBe("Certificate-baby-steps.pdf");
  });

  it("normalises a title or messy slug into a safe slug", () => {
    expect(certificateFilename("Baby Steps: Your Health Journey Toward Conception")).toBe("Certificate-baby-steps-your-health-journey-toward-conception.pdf");
    expect(certificateFilename("  Crème & Cravings / 2026 ")).toBe("Certificate-creme-and-cravings-2026.pdf");
    expect(certificateFilename("../../etc/passwd")).toBe("Certificate-etc-passwd.pdf");
  });

  it("falls back when nothing usable remains", () => {
    expect(certificateFilename("")).toBe("Certificate-course.pdf");
    expect(certificateFilename(null)).toBe("Certificate-course.pdf");
    expect(certificateFilename("***")).toBe("Certificate-course.pdf");
  });

  it("caps very long slugs", () => {
    const name = certificateFilename("x".repeat(200));
    expect(name.length).toBeLessThanOrEqual("Certificate-".length + 80 + ".pdf".length);
    expect(name.endsWith(".pdf")).toBe(true);
  });
});

describe("attachmentDisposition", () => {
  it("quotes the filename and strips header-breaking characters", () => {
    expect(attachmentDisposition("Certificate-baby-steps.pdf")).toBe('attachment; filename="Certificate-baby-steps.pdf"');
    expect(attachmentDisposition('bad"name\r\n.pdf')).toBe('attachment; filename="bad_name__.pdf"');
  });
});
