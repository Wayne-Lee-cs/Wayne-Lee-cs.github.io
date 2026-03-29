document.addEventListener('DOMContentLoaded', function () {
    // ===== Mobile menu toggle =====
    var toggle = document.querySelector('.mobile-toggle');
    var menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', function() { menu.classList.toggle('open'); });
        var links = menu.querySelectorAll('.nav-link');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function() { menu.classList.remove('open'); });
        }
    }

    // ===== Throttled scroll handler (single handler, 16ms throttle) =====
    var sections = document.querySelectorAll('section');
    var navLinks = document.querySelectorAll('.nav-link');
    var navbar = document.querySelector('.navbar');
    var scrollTicking = false;

    function onScroll() {
        scrollTicking = false;
        var sy = window.scrollY;

        // Active nav
        var current = '';
        for (var i = 0; i < sections.length; i++) {
            if (sy >= sections[i].offsetTop - 200) current = sections[i].id;
        }
        for (var j = 0; j < navLinks.length; j++) {
            var href = navLinks[j].getAttribute('href');
            navLinks[j].classList.toggle('active', href && href.slice(1) === current);
        }

        // Navbar border
        navbar.style.borderBottomColor = sy > 10 ? 'var(--color-border)' : 'transparent';
    }

    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    // ===== IntersectionObserver for fade-in =====
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add('visible');
                    observer.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        var fadeEls = document.querySelectorAll(
            '.research-card, .team-card, .project-item, .contact-block, .section-title, .section-description'
        );
        for (var k = 0; k < fadeEls.length; k++) {
            fadeEls[k].classList.add('fade-in');
            observer.observe(fadeEls[k]);
        }
    }

    // ===== Email obfuscation =====
    var emailLinks = document.querySelectorAll('.email-link');
    for (var m = 0; m < emailLinks.length; m++) {
        emailLinks[m].addEventListener('click', function(e) {
            e.preventDefault();
            var user = this.dataset.user;
            var domain = this.dataset.domain;
            if (!user || !domain) return;
            var email = user + '@' + domain;
            this.href = 'mailto:' + email;
            this.textContent = email;
            this.removeAttribute('data-user');
            this.removeAttribute('data-domain');
            window.location.href = 'mailto:' + email;
        });
    }

    // ===== Optimized Canvas Animation =====
    var canvas = document.getElementById('neural-canvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var rw, rh, animId = null, isVisible = true;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var mouseX = 0, mouseY = 0;
        var rotY = 0, rotX = 0.3;

        // Debounced resize
        var resizeTimer;
        function resize() {
            var r = canvas.parentElement.getBoundingClientRect();
            rw = r.width; rh = r.height;
            canvas.width = rw * dpr; canvas.height = rh * dpr;
            canvas.style.width = rw + 'px'; canvas.style.height = rh + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        });

        // Mouse tracking
        canvas.parentElement.addEventListener('mousemove', function(e) {
            var r = canvas.parentElement.getBoundingClientRect();
            mouseX = (e.clientX - r.left) / rw - 0.5;
            mouseY = (e.clientY - r.top) / rh - 0.5;
        }, { passive: true });
        canvas.parentElement.addEventListener('mouseleave', function() { mouseX = 0; mouseY = 0; });

        // Reduced point count for performance (250 instead of 500)
        var points = [];
        var latLines = 10, lonLines = 16, totalPts = 250;
        for (var i = 0; i <= latLines; i++) {
            var phi = (Math.PI / latLines) * i;
            var ptsInRing = Math.max(3, Math.round(Math.sin(phi) * lonLines));
            for (var j = 0; j < ptsInRing; j++) {
                var theta = (2 * Math.PI / ptsInRing) * j;
                points.push({
                    ox: Math.sin(phi) * Math.cos(theta),
                    oy: Math.cos(phi),
                    oz: Math.sin(phi) * Math.sin(theta),
                    size: 1 + Math.random() * 0.8,
                    pulse: Math.random() * 6.28
                });
            }
        }
        for (var n = points.length; n < totalPts; n++) {
            var rPhi = Math.acos(2 * Math.random() - 1);
            var rTheta = Math.random() * 6.28;
            points.push({
                ox: Math.sin(rPhi) * Math.cos(rTheta),
                oy: Math.cos(rPhi),
                oz: Math.sin(rPhi) * Math.sin(rTheta),
                size: 0.5 + Math.random() * 0.5,
                pulse: Math.random() * 6.28
            });
        }

        // Pre-allocate projected array (avoid GC pressure from .map every frame)
        var projected = new Array(points.length);
        for (var p = 0; p < points.length; p++) {
            projected[p] = { px: 0, py: 0, z: 0, size: 0, pulse: 0, ox: 0, oz: 0 };
        }

        // Reduced streams
        var streams = [];
        for (var s = 0; s < 8; s++) {
            streams.push({
                startPhi: Math.acos(2 * Math.random() - 1),
                startTheta: Math.random() * 6.28,
                endPhi: Math.acos(2 * Math.random() - 1),
                endTheta: Math.random() * 6.28,
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.005,
                width: 0.5 + Math.random() * 0.8
            });
        }

        var scanAngle = 0, t = 0;
        var cosY, sinY, cosX, sinX; // cached per frame

        function projectPt(x, y, z) {
            var x1 = x * cosY - z * sinY, z1 = x * sinY + z * cosY;
            return { x: x1, y: y * cosX - z1 * sinX, z: y * sinX + z1 * cosX };
        }

        function draw() {
            if (!isVisible) { animId = null; return; }
            t += 0.016;
            ctx.clearRect(0, 0, rw, rh);

            // Smooth rotation
            var targetRotY = mouseX * 1.2;
            var targetRotX = 0.3 + mouseY * 0.8;
            rotY += (targetRotY - rotY) * 0.03 + 0.003;
            rotX += (targetRotX - rotX) * 0.03;

            // Cache trig values for this frame
            cosY = Math.cos(rotY); sinY = Math.sin(rotY);
            cosX = Math.cos(rotX); sinX = Math.sin(rotX);

            var cx = rw / 2, cy = rh / 2;
            var R = Math.min(rw, rh) * 0.36;
            scanAngle += 0.015;

            // Background glow (single gradient, reuse)
            var bg = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.8);
            bg.addColorStop(0, 'rgba(200,149,108,0.05)');
            bg.addColorStop(0.5, 'rgba(140,100,70,0.02)');
            bg.addColorStop(1, 'transparent');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, rw, rh);

            // Project points (reuse objects, no allocation)
            for (var i = 0; i < points.length; i++) {
                var pt = points[i];
                var pr = projectPt(pt.ox, pt.oy, pt.oz);
                var proj = projected[i];
                proj.px = cx + pr.x * R;
                proj.py = cy + pr.y * R;
                proj.z = pr.z;
                proj.size = pt.size;
                proj.pulse = pt.pulse;
                proj.ox = pt.ox;
                proj.oz = pt.oz;
            }

            // Sort by depth (in-place)
            projected.sort(function(a, b) { return a.z - b.z; });

            // Draw connections 鈥?batch into single path per alpha range
            ctx.lineWidth = 0.5;
            var threshold = R * 0.3;
            for (var i = 0; i < projected.length; i++) {
                for (var j = i + 1; j < Math.min(i + 6, projected.length); j++) {
                    var a = projected[i], b = projected[j];
                    var dx = a.px - b.px, dy = a.py - b.py;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < threshold) {
                        var alpha = (1 - dist / threshold) * 0.1 * ((a.z + b.z) / 2 + 1) * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(a.px, a.py);
                        ctx.lineTo(b.px, b.py);
                        ctx.strokeStyle = 'rgba(200,170,140,' + alpha + ')';
                        ctx.stroke();
                    }
                }
            }

            // Scan beam 鈥?only check front-facing points
            var scanX = Math.cos(scanAngle), scanZ = Math.sin(scanAngle);
            for (var i = 0; i < projected.length; i++) {
                var p = projected[i];
                if (p.z < 0) continue; // skip back-facing
                var dot = p.ox * scanX + p.oz * scanZ;
                if (dot > 0.95) {
                    var glow = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, 10);
                    glow.addColorStop(0, 'rgba(255,200,120,' + (0.25 * (p.z + 1) * 0.5) + ')');
                    glow.addColorStop(1, 'transparent');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(p.px, p.py, 10, 0, 6.28);
                    ctx.fill();
                }
            }

            // Data streams
            for (var si = 0; si < streams.length; si++) {
                var st = streams[si];
                st.progress += st.speed;
                if (st.progress > 1) {
                    st.progress = 0;
                    st.startPhi = st.endPhi; st.startTheta = st.endTheta;
                    st.endPhi = Math.acos(2 * Math.random() - 1);
                    st.endTheta = Math.random() * 6.28;
                }
                ctx.beginPath();
                for (var step = 0; step <= 15; step++) {
                    var frac = step / 15;
                    if (frac > st.progress) break;
                    var sPhi = st.startPhi + (st.endPhi - st.startPhi) * frac;
                    var sTheta = st.startTheta + (st.endTheta - st.startTheta) * frac;
                    var spr = projectPt(Math.sin(sPhi) * Math.cos(sTheta), Math.cos(sPhi), Math.sin(sPhi) * Math.sin(sTheta));
                    var spx = cx + spr.x * R, spy = cy + spr.y * R;
                    if (step === 0) ctx.moveTo(spx, spy); else ctx.lineTo(spx, spy);
                }
                ctx.strokeStyle = 'rgba(255,180,100,0.2)';
                ctx.lineWidth = st.width;
                ctx.stroke();
            }

            // Draw points 鈥?skip glow for back-facing, reduce gradient calls
            for (var i = 0; i < projected.length; i++) {
                var p = projected[i];
                var depth = (p.z + 1) * 0.5;
                var pulse = Math.sin(t * 2 + p.pulse) * 0.3 + 0.7;
                var alpha = depth * 0.65 * pulse;
                var sz = p.size * (0.5 + depth * 0.5);

                ctx.beginPath();
                ctx.arc(p.px, p.py, sz, 0, 6.28);
                var r = 180 + depth * 60 | 0, g = 140 + depth * 40 | 0, b = 100 + depth * 30 | 0;
                ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
                ctx.fill();
            }

            // Outer ring + arc
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.05, 0, 6.28);
            ctx.strokeStyle = 'rgba(200,149,108,0.06)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.05, scanAngle, scanAngle + 0.8);
            ctx.strokeStyle = 'rgba(255,180,100,0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();

            animId = requestAnimationFrame(draw);
        }

        // Visibility API 鈥?pause animation when tab is hidden
        document.addEventListener('visibilitychange', function() {
            isVisible = !document.hidden;
            if (isVisible && !animId) {
                animId = requestAnimationFrame(draw);
            }
        });

        // Only start animation when hero is in viewport
        if ('IntersectionObserver' in window) {
            var heroObs = new IntersectionObserver(function(entries) {
                isVisible = entries[0].isIntersecting && !document.hidden;
                if (isVisible && !animId) {
                    animId = requestAnimationFrame(draw);
                }
            }, { threshold: 0 });
            heroObs.observe(canvas.parentElement);
        } else {
            animId = requestAnimationFrame(draw);
        }
    }
});
