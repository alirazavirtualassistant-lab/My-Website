import { describe, expect, it } from "vitest";
import { CERTIFICATE_ORGANIZATION, certificateLinks, linkedInUrlFor, verifyUrlFor } from "@/components/certificates/certificate-links";

const cert = {
  id: "cert-1",
  course_title: "Baby Steps: Your Health Journey Toward Conception",
  issued_at: "2026-10-10T12:00:00.000Z",
  verify_code: "K7PQ2MXD4R",
};

describe("certificate links", () => {
  it("builds the verify url from the site base without double slashes", () => {
    expect(verifyUrlFor("K7PQ2MXD4R", "https://academy.example.com/")).toBe("https://academy.example.com/verify/K7PQ2MXD4R");
  });

  it("builds the LinkedIn add-to-profile link with the organisation name, issue month and verify code", () => {
    const url = new URL(linkedInUrlFor(cert, "https://academy.example.com"));
    expect(url.origin + url.pathname).toBe("https://www.linkedin.com/profile/add");
    expect(url.searchParams.get("startTask")).toBe("CERTIFICATION_NAME");
    expect(url.searchParams.get("name")).toBe(cert.course_title);
    expect(url.searchParams.get("organizationName")).toBe(CERTIFICATE_ORGANIZATION);
    expect(url.searchParams.get("issueYear")).toBe("2026");
    expect(url.searchParams.get("issueMonth")).toBe("10");
    expect(url.searchParams.get("certUrl")).toBe("https://academy.example.com/verify/K7PQ2MXD4R");
    expect(url.searchParams.get("certId")).toBe("K7PQ2MXD4R");
  });

  it("returns every path the UI needs", () => {
    const links = certificateLinks(cert, "https://academy.example.com");
    expect(links.pdfPath).toBe("/api/certificates/cert-1/pdf");
    expect(links.detailPath).toBe("/certificates/cert-1");
    expect(links.verifyPath).toBe("/verify/K7PQ2MXD4R");
    expect(links.verifyUrl).toBe("https://academy.example.com/verify/K7PQ2MXD4R");
    expect(links.linkedInUrl).toContain("linkedin.com/profile/add");
  });
});
