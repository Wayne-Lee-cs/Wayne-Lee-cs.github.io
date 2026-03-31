// Apply saved theme immediately to prevent flash of wrong theme
(function(){
    var t = localStorage.getItem('theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
    else if (window.matchMedia('(prefers-color-scheme:dark)').matches) document.documentElement.setAttribute('data-theme', 'dark');
})();
