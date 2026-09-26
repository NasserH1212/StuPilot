export const themeStorageKey = "stupilot-theme";

/**
 * Runs synchronously in <head>, before first paint, so the stored theme
 * preference (or the system default) applies without a flash of the wrong
 * theme. Kept as a plain string (not a component) because it must execute
 * before React hydrates.
 */
export function themeBootScript(): string {
  return `(function(){try{var k=${JSON.stringify(themeStorageKey)};var v=localStorage.getItem(k);if(v==="light"||v==="dark"){document.documentElement.setAttribute("data-theme",v);}}catch(e){}})();`;
}
