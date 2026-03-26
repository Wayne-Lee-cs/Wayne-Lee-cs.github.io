document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => menu.classList.toggle('open'));
        menu.querySelectorAll('.nav-link').forEach(link =>
            link.addEventListener('click', () => menu.classList.remove('open'))
        );
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    function updateActiveNav() {
        let current = '';
        sections.forEach(s => {
            if (scrollY >= s.offsetTop - 200) current = s.id;
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href').slice(1) === current);
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // Fade-in on scroll
    const observer = new IntersectionObserver(
        entries => entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        }),
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll(
        '.research-card, .team-card, .project-item, .contact-block, .section-title, .section-description'
    ).forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.style.borderBottomColor = scrollY > 10
            ? 'var(--color-border)'
            : 'transparent';
    }, { passive: true });
});
