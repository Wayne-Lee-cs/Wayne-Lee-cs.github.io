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

    // Sanitize: only allow safe filenames
    if (file.includes('..') || file.includes('/') || file.includes('\\') || file.length > 200) {
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
        var safeFile = encodeURIComponent(file);
        container.innerHTML = '<object data="' + safeFile +
            '" type="application/pdf" width="100%" style="height:85vh;border-radius:12px;border:1px solid #e8e4df;">' +
            '<p>Your browser does not support PDF viewing. <a href="' +
            safeFile + '">Download PDF</a></p></object>';
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
