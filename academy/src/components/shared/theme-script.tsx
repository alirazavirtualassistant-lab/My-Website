import * as React from "react";

/**
 * Applies the stored theme before first paint so there is no flash. Goes in the
 * root <head>. Mirrors applyTheme() in use-theme.ts (storage key "cyc-theme").
 */
const SCRIPT = `(function(){try{var t=localStorage.getItem("cyc-theme");var r=document.documentElement;if(t==="light"||t==="dark"){r.setAttribute("data-theme",t);r.style.colorScheme=t}else{r.removeAttribute("data-theme");r.style.colorScheme=""}}catch(e){}})();`;

function ThemeScript() {
  return <script id="cyc-theme-script" dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}

export { ThemeScript };
