# Juyang Li · Personal Website

A modern academic personal website built with pure HTML/CSS/JS, hosted on GitHub Pages.

**Live:** [https://wayne-lee-cs.github.io](https://wayne-lee-cs.github.io)

## Features

### Core Sections
- **Hero** — Animated 3D wireframe globe (Canvas), typewriter title effect
- **About** — Research direction cards (Deep Learning, CV, Embodied AI, AI Infra)
- **Skills** — Interactive radar chart showing tech stack proficiency
- **Timeline** — Academic and project experience with timeline UI
- **Team** — Member cards with photos and external links
- **Projects** — List of research projects with hover animations
- **Publications** — Paper list with BibTeX one-click copy
- **Blog** — Supports Markdown rendering, PDF embedding, and HTML posts with tag filtering
- **Contact** — Email obfuscation (anti-scraping), social links

### Interactive Features
- **Dark Mode** — Toggle via sun/moon icon in navbar, auto-detects system preference, persists in localStorage
- **Language Switch** — Chinese/English toggle (中/EN button), persists in localStorage
- **Terminal Mode** — Press `` ` `` to open a simulated terminal. Commands: `help`, `about`, `skills`, `projects`, `blog`, `contact`, `theme`, `clear`, `exit`
- **Konami Code** — Press ↑↑↓↓←→←→BA for a hidden easter egg
- **Back to Top** — Floating button appears after scrolling 600px
- **Visitor Counter** — Badge in footer showing visit count

### Performance
- Canvas animation pauses when tab is hidden or scrolled out of viewport
- Single throttled scroll handler (rAF-based) for all scroll effects
- Pre-allocated arrays to minimize GC pressure in animation loop
- Debounced resize handler
- Lazy-loaded images
- `contain: strict` on canvas container
- `prefers-reduced-motion` support

### Security
- Content Security Policy (CSP) on all pages
- X-Frame-Options, X-Content-Type-Options headers
- Email address obfuscated (JS-assembled on click)
- Markdown sanitizer strips dangerous tags/attributes/protocols
- File size limit (5MB) and timeout (10s) on blog content fetch
- External links use `rel="noopener noreferrer"`
- robots.txt blocks internal files from crawlers

## Project Structure

```
├── index.html              # Main page
├── styles.css              # All styles
├── script.js               # All interactions + canvas animation
├── theme-init.js           # Theme detection (loaded before paint)
├── 404.html                # Custom 404 page
├── manifest.json           # PWA manifest
├── robots.txt              # Crawler rules
├── sitemap.xml             # SEO sitemap
├── _config.yml             # Jekyll config (disables theme)
├── .nojekyll               # Bypass Jekyll processing
├── personal.md             # Maintenance guide (not published)
├── website_head_page.jpg   # Favicon + profile photo
├── zc_graph.jpg            # Team member photo
├── blog/
│   ├── md-viewer.html      # Markdown/PDF viewer page
│   ├── md-viewer.js        # Viewer logic (fetch + marked.js + sanitizer)
│   ├── theme-init.js       # Theme init for blog pages
│   ├── hello-world.md      # Sample markdown post
│   ├── sample-post.html    # Sample HTML post
│   └── _template.html      # Template for new HTML posts
```

## Adding Content

### New Blog Post (Markdown)
1. Create `blog/my-post.md`
2. Add card in `index.html` inside `<div class="blog-grid">`:
```html
<a href="blog/md-viewer.html?file=my-post.md" class="blog-card" data-tags="markdown">
    <div class="blog-date">2026-04-01</div>
    <h3>Title</h3>
    <p>Description</p>
    <span class="blog-tag">Markdown</span>
</a>
```

### New Blog Post (PDF)
1. Place `blog/my-paper.pdf`
2. Add card with `href="blog/md-viewer.html?file=my-paper.pdf"`

### New Publication
Add inside `<div class="pub-list">` in `index.html`:
```html
<div class="pub-item">
    <div class="pub-year">2026</div>
    <div class="pub-content">
        <h3>Paper Title</h3>
        <p class="pub-authors"><strong>J. Li</strong>, Co-author, et al.</p>
        <p class="pub-venue">Conference Name, 2026</p>
        <div class="pub-links">
            <a href="blog/md-viewer.html?file=paper.pdf" class="pub-link">PDF</a>
            <button class="pub-link pub-bib-btn" data-bib="@article{...}">BibTeX</button>
        </div>
    </div>
</div>
```

### New Timeline Entry
Add inside `<div class="timeline">` in `index.html`:
```html
<div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-date">2025.06 - 2025.09</div>
    <div class="timeline-content">
        <h3>Title</h3>
        <p>Description</p>
    </div>
</div>
```

### Update Skills Radar
Edit the `skills` array in `script.js`:
```js
var skills = [
    { name: 'Python', value: 0.85, color: '#c8956c' },
    // Add or modify entries, value is 0-1
];
```

### Add Translations
Add key-value pairs to the `i18n.zh` and `i18n.en` objects in `script.js`.

## Local Development

```bash
python -m http.server 8000
# Open http://localhost:8000
```

## Deploy

```bash
git add -A
git commit -m "description"
git push origin main
# GitHub Pages auto-deploys in 1-2 minutes
```

## Tech Stack

- Pure HTML5 / CSS3 / Vanilla JS (no frameworks)
- Canvas 2D API for animations
- marked.js (CDN) for Markdown rendering
- GitHub Pages for hosting
- visitor-badge.laobi.icu for visit counter

## License

MIT
