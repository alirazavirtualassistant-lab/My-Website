/**
 * Invisible field bots tend to fill. Hidden from assistive tech and the tab
 * order; the server treats a non-empty value as spam and quietly "succeeds".
 */
function Honeypot({ name = "website" }: { name?: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
      <label htmlFor={`hp-${name}`}>Leave this field empty</label>
      <input id={`hp-${name}`} type="text" name={name} tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}

export { Honeypot };
