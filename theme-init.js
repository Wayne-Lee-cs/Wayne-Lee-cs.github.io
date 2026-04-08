/**
 * Theme Initialization Script
 * ===========================
 * Purpose: Apply saved theme BEFORE first paint to prevent flash of wrong theme
 * Runs: Synchronously in <head> before any body content
 * Storage: localStorage key 'theme' with values 'light' or 'dark'
 * Fallback: Respects system prefers-color-scheme: dark
 */
(function(){
    var t = localStorage.getItem('theme');
    if (t) {
        document.documentElement.setAttribute('data-theme', t);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();
