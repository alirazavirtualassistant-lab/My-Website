/** The five legal pages edited in Settings. Keys match `site_settings.legal` and the public routes. */
export const LEGAL_PAGES = [
  { key: "terms", label: "Terms of Service", href: "/terms" },
  { key: "privacy", label: "Privacy Policy", href: "/privacy" },
  { key: "refund-policy", label: "Refund Policy", href: "/refund-policy" },
  { key: "medical-disclaimer", label: "Medical Disclaimer", href: "/medical-disclaimer" },
  { key: "cookie-policy", label: "Cookie Policy", href: "/cookies" },
] as const;

export type LegalPageKey = (typeof LEGAL_PAGES)[number]["key"];
