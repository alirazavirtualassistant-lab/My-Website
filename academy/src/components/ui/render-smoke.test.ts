// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "./button";
import { Badge } from "./badge";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { Callout } from "./callout";
import { Countdown, getRemaining } from "./countdown";
import { CurrencyDisplay, DisplayCurrencyProvider, convertCents } from "./currency-display";
import { FormField } from "./form-field";
import { Input } from "./input";
import { ProgressRing } from "./progress-ring";
import { Progress } from "./progress";
import { Checkbox } from "./checkbox";
import { Switch } from "./switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";
import { Table, TableBody, TableCell, TableRow } from "./table";
import { EmptyState } from "./empty-state";
import { StatCard } from "./stat-card";
import { PageHeader } from "./page-header";
import { Illustration, ILLUSTRATION_NAMES } from "@/components/shared/illustration";
import { Logo } from "@/components/shared/logo";
import { Markdown } from "@/components/shared/markdown";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { DemoRibbon } from "@/components/shared/demo-ribbon";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LearnerShell } from "@/components/layout/learner-shell";
import { AdminShell } from "@/components/layout/admin-shell";

const render = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("server render smoke", () => {
  it("renders buttons, badges, alerts and callouts", () => {
    expect(render(h(Button, { variant: "gold", size: "lg" }, "Go"))).toContain('type="button"');
    expect(render(h(Button, { loading: true }, "Go"))).toContain("aria-busy");
    expect(render(h(Badge, { variant: "success" }, "ok"))).toContain("ok");
    expect(render(h(Alert, { variant: "destructive" }, h(AlertTitle, null, "T"), h(AlertDescription, null, "D")))).toContain('role="alert"');
    expect(render(h(Callout))).toContain("check with your doctor");
  });

  it("wires FormField aria attributes", () => {
    const html = render(h(FormField, { id: "email", label: "Email", hint: "h", error: "e", required: true, children: h(Input, { type: "email" }) }));
    expect(html).toContain('for="email"');
    expect(html).toContain('aria-describedby="email-error email-hint"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-required="true"');
  });

  it("renders progress, ring, radix form controls, tabs, accordion, table", () => {
    expect(render(h(ProgressRing, { value: 42 }))).toContain('aria-valuenow="42"');
    expect(render(h(Progress, { value: 50 }))).toContain('role="progressbar"');
    expect(render(h(Checkbox, { defaultChecked: true }))).toContain('role="checkbox"');
    expect(render(h(Switch, {}))).toContain('role="switch"');
    expect(
      render(h(Tabs, { defaultValue: "a", children: [h(TabsList, { key: "l" }, h(TabsTrigger, { value: "a" }, "A")), h(TabsContent, { key: "c", value: "a" }, "body")] })),
    ).toContain("body");
    expect(
      render(
        h(Accordion, { type: "single", collapsible: true, defaultValue: "x" }, h(AccordionItem, { value: "x" }, h(AccordionTrigger, null, "Q"), h(AccordionContent, null, "A"))),
      ),
    ).toContain("Q");
    expect(render(h(Table, null, h(TableBody, null, h(TableRow, null, h(TableCell, null, "c")))))).toContain("<table");
    expect(render(h(EmptyState, { title: "Empty" }))).toContain("Empty");
    expect(render(h(StatCard, { label: "XP", value: 10 }))).toContain("XP");
    expect(render(h(PageHeader, { eyebrow: "E", title: "T", description: "D" }))).toContain("<h1");
  });

  it("countdown renders placeholders on the server and computes remaining time", () => {
    const html = render(h(Countdown, { to: "2099-01-01T00:00:00Z", label: "Ends in" }));
    expect(html).toContain("--");
    const r = getRemaining("2020-01-02T00:00:00Z", Date.parse("2020-01-01T00:00:00Z"));
    expect(r).toMatchObject({ days: 1, hours: 0, minutes: 0, seconds: 0, done: false });
    expect(getRemaining("2020-01-01T00:00:00Z", Date.parse("2020-01-02T00:00:00Z")).done).toBe(true);
  });

  it("currency display converts and formats", () => {
    expect(render(h(CurrencyDisplay, { cents: 19700 }))).toContain("$197");
    expect(render(h(CurrencyDisplay, { cents: 0 }))).toContain("Free");
    expect(render(h(DisplayCurrencyProvider, { initial: "GBP" as const, children: h(CurrencyDisplay, { cents: 10000 }) }))).toContain("£79");
    expect(convertCents(10000, "USD", "EUR")).toBe(9200);
    expect(convertCents(9200, "EUR", "USD")).toBe(10000);
  });

  it("renders every illustration, the logo, markdown and disclaimer", () => {
    for (const name of ILLUSTRATION_NAMES) {
      const html = render(h(Illustration, { name }));
      expect(html).toContain(`data-name="${name}"`);
      expect(html).toContain('aria-hidden="true"');
    }
    expect(render(h(Illustration, { name: "cradle", title: "Cradle" }))).toContain('role="img"');
    expect(render(h(Logo, { height: 28 }))).toContain("Cradle Your Cravings");
    expect(render(h(Logo, { variant: "mark" }))).toContain("<svg");
    expect(render(h(Markdown, { content: "# Hi\n\n<b>x</b>" }))).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(render(h(MedicalDisclaimer, { showReviewTag: true }))).toContain("[LEGAL REVIEW NEEDED]");
    expect(render(h(MedicalDisclaimer))).not.toContain("[LEGAL REVIEW NEEDED]");
    expect(render(h(DemoRibbon, { demo: false }))).toBe("");
    expect(render(h(DemoRibbon, { demo: true }))).toContain("Demo mode");
  });

  it("theme toggle and cookie banner are hydration-safe on the server", () => {
    expect(render(h(ThemeToggle))).toContain('data-theme-preference="system"');
    expect(render(h(CookieConsent))).toBe("");
  });

  it("renders header, footer and shells", () => {
    const out = render(h(SiteHeader, { user: null, cartCount: 3 }));
    expect(out).toContain("Sign in");
    expect(out).toContain("Start your Baby Steps");
    expect(out).toContain("Cart, 3 items");
    const admin = render(h(SiteHeader, { user: { name: "Ada Lovelace", avatar_url: null, role: "admin" }, cartCount: 0 }));
    expect(admin).toContain("My Learning");
    expect(admin).toContain("AL");
    const footer = render(h(SiteFooter));
    expect(footer).toContain("Refund Policy");
    expect(footer).toContain(String(new Date().getFullYear()));
    expect(render(h(LearnerShell, { children: "content" }))).toContain('id="main"');
    const shell = render(h(AdminShell, { user: { name: "Assistant", avatar_url: null, role: "assistant" }, children: "x" }));
    expect(shell).toContain("Importer");
    expect(shell).not.toContain("/admin/settings");
  });
});
