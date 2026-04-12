(function(){
    var savedTheme = localStorage.getItem('theme');

    // If user has manually set a preference, always respect it
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        return;
    }

    // Auto day/night theme based on local time
    // Light: 6:00 AM - 5:59 PM (6-18), Dark: 6:00 PM - 5:59 AM
    var hour = new Date().getHours();
    var isNight = hour < 6 || hour >= 18;

    if (isNight) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();