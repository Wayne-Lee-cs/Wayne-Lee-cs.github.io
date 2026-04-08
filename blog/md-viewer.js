/**
 * Markdown/PDF Viewer
 * ===================
 * Purpose: Render markdown files and PDF documents in the browser
 * Usage: md-viewer.html?file=path/to/file.md
 * Dependencies: marked.js (loaded from cdn.jsdelivr.net)
 *
 * Security:
 * - Filename sanitization blocks path traversal (.., /, \) and length limits
 * - Markdown output sanitized: removes dangerous tags and event handlers
 * - External links get rel="noopener noreferrer" and target="_blank"
 */
(function() {
    var params = new URLSearchParams(window.location.search);
    var file = params.get('file');
    var container = document.getElementById('content');
    var MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
    var FETCH_TIMEOUT = 10000; // 10s timeout

    if (!file) {
        container.className = 'error';
        container.textContent = 'No file specified. Use ?file=your-file.md';
        return;
    }

    // Sanitize: allow subdirectory paths but block parent traversal
    // Allowed: hello-world.md, posts/hello.md, posts/2026/hello.md
    // Blocked: ../etc/passwd, /etc/passwd, null bytes, path traversal
    if (file.includes('..') || file.startsWith('/') || file.includes('\\') || file.includes('\0') || file.length > 200) {
        container.className = 'error';
        container.textContent = 'Invalid file path.';
        return;
    }
    // Ensure path doesn't escape blog directory (defense in depth)
    if (file.startsWith('.') || file.includes('..')) {
        container.className = 'error';
        container.textContent = 'Invalid file path.';
        return;
    }

    // Only allow .md and .pdf extensions
    var ext = file.split('.').pop().toLowerCase();
    if (ext !== 'md' && ext !== 'pdf') {
        container.className = 'error';
        container.textContent = 'Only .md and .pdf files are supported.';
        return;
    }

    document.title = file.replace(/\.(md|pdf)$/i, '') + ' \u00b7 Juyang Li';

    if (ext === 'pdf') {
        container.className = '';
        // Use DOM API to safely set attributes (prevents XSS from quote injection)
        var obj = document.createElement('object');
        obj.setAttribute('data', file);
        obj.setAttribute('type', 'application/pdf');
        obj.setAttribute('width', '100%');
        obj.style.cssText = 'height:85vh;border-radius:12px;border:1px solid #e8e4df;';
        var p = document.createElement('p');
        p.textContent = 'Your browser does not support PDF viewing. ';
        var a = document.createElement('a');
        a.href = file;
        a.textContent = 'Download PDF';
        p.appendChild(a);
        obj.appendChild(p);
        container.innerHTML = '';
        container.appendChild(obj);
        return;
    }

    // Fetch with timeout and size check
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function() {
        if (controller) controller.abort();
        container.className = 'error';
        container.textContent = 'Request timed out.';
    }, FETCH_TIMEOUT);

    var fetchOpts = controller ? { signal: controller.signal } : {};

    fetch(file, fetchOpts)
        .then(function(res) {
            clearTimeout(timer);
            if (!res.ok) throw new Error('File not found: ' + file);
            var size = res.headers.get('content-length');
            if (size && parseInt(size) > MAX_FILE_SIZE) {
                throw new Error('File too large (max 5MB).');
            }
            return res.text();
        })
        .then(function(md) {
            if (md.length > MAX_FILE_SIZE) {
                throw new Error('File too large (max 5MB).');
            }
            container.className = 'md-content';
            // Sanitize: strip dangerous tags/attributes from marked output
            var div = document.createElement('div');
            div.innerHTML = marked.parse(md);
            // Remove script, iframe, object, embed, form, style tags
            var dangerous = div.querySelectorAll('script,iframe,object,embed,form,style,link');
            for (var d = 0; d < dangerous.length; d++) dangerous[d].remove();
            // Remove event handler attributes from all elements
            var allEls = div.querySelectorAll('*');
            for (var e = 0; e < allEls.length; e++) {
                var attrs = allEls[e].attributes;
                for (var a = attrs.length - 1; a >= 0; a--) {
                    if (attrs[a].name.indexOf('on') === 0) allEls[e].removeAttribute(attrs[a].name);
                }
                // Remove javascript: hrefs
                if (allEls[e].hasAttribute('href') && allEls[e].getAttribute('href').trim().toLowerCase().indexOf('javascript:') === 0) {
                    allEls[e].removeAttribute('href');
                }
                if (allEls[e].hasAttribute('src') && allEls[e].getAttribute('src').trim().toLowerCase().indexOf('javascript:') === 0) {
                    allEls[e].removeAttribute('src');
                }
            }
            container.innerHTML = div.innerHTML;
            // Wrap tables for mobile horizontal scroll
            var tables = container.querySelectorAll('table');
            for (var t = 0; t < tables.length; t++) {
                var wrap = document.createElement('div');
                wrap.className = 'table-wrap';
                tables[t].parentNode.insertBefore(wrap, tables[t]);
                wrap.appendChild(tables[t]);
            }
            // Secure external links
            var links = container.querySelectorAll('a');
            for (var i = 0; i < links.length; i++) {
                if (links[i].hostname && links[i].hostname !== location.hostname) {
                    links[i].target = '_blank';
                    links[i].rel = 'noopener noreferrer';
                }
            }
        })
        .catch(function(err) {
            clearTimeout(timer);
            if (err.name === 'AbortError') return; // already handled by timer
            container.className = 'error';
            container.textContent = err.message;
        });
})();
