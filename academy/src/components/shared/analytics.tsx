"use client";

import * as React from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { site } from "@/lib/config/site";
import { useConsent } from "./cookie-consent";

/**
 * Loads Plausible or PostHog only when:
 *   - site.analytics.provider is set (NEXT_PUBLIC_ANALYTICS_PROVIDER),
 *   - the visitor accepted analytics cookies, and
 *   - we are not inside a lesson (/learn/*), which stays private.
 * Otherwise renders nothing. Mount once in the root layout.
 */
function Analytics() {
  const pathname = usePathname();
  const consent = useConsent();
  const provider = site.analytics.provider;
  if (provider === "none") return null;
  if (consent !== "all") return null;
  if (pathname === "/learn" || pathname.startsWith("/learn/")) return null;

  if (provider === "plausible") {
    const domain = site.analytics.plausibleDomain;
    if (!domain) return null;
    return <Script id="cyc-plausible" strategy="afterInteractive" src="https://plausible.io/js/script.js" data-domain={domain} />;
  }

  if (provider === "posthog") {
    const key = site.analytics.posthogKey;
    if (!key) return null;
    const host = site.analytics.posthogHost;
    const snippet = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties alias".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init(${JSON.stringify(key)},{api_host:${JSON.stringify(host)},persistence:"localStorage+cookie",capture_pageview:true,capture_pageleave:true});`;
    return <Script id="cyc-posthog" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: snippet }} />;
  }

  return null;
}

export { Analytics };
