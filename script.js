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

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.style.borderBottomColor = scrollY > 10 ? 'var(--color-border)' : 'transparent';
    }, { passive: true });

    // ===== Neural Network Canvas Animation =====
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let rw, rh;
        const dpr = Math.min(devicePixelRatio, 2);
        let mouseX = 0, mouseY = 0, targetRotY = 0, targetRotX = 0;
        let rotY = 0, rotX = 0.3;

        function resize() {
            const r = canvas.parentElement.getBoundingClientRect();
            rw = r.width; rh = r.height;
            canvas.width = rw * dpr; canvas.height = rh * dpr;
            canvas.style.width = rw + 'px'; canvas.style.height = rh + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);

        canvas.parentElement.addEventListener('mousemove', e => {
            const r = canvas.parentElement.getBoundingClientRect();
            mouseX = (e.clientX - r.left) / rw - 0.5;
            mouseY = (e.clientY - r.top) / rh - 0.5;
        });
        canvas.parentElement.addEventListener('mouseleave', () => { mouseX = 0; mouseY = 0; });

        // Generate sphere points
        const points = [];
        const latLines = 12, lonLines = 20, totalPts = 500;
        // Grid points
        for (let i = 0; i <= latLines; i++) {
            const phi = (Math.PI / latLines) * i;
            const ptsInRing = Math.max(4, Math.round(Math.sin(phi) * lonLines));
            for (let j = 0; j < ptsInRing; j++) {
                const theta = (2 * Math.PI / ptsInRing) * j;
                points.push({
                    phi, theta,
                    ox: Math.sin(phi) * Math.cos(theta),
                    oy: Math.cos(phi),
                    oz: Math.sin(phi) * Math.sin(theta),
                    size: 1.2 + Math.random() * 0.8,
                    pulse: Math.random() * Math.PI * 2
                });
            }
        }
        // Extra random surface points
        for (let i = points.length; i < totalPts; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            points.push({
                phi, theta,
                ox: Math.sin(phi) * Math.cos(theta),
                oy: Math.cos(phi),
                oz: Math.sin(phi) * Math.sin(theta),
                size: 0.6 + Math.random() * 0.6,
                pulse: Math.random() * Math.PI * 2
            });
        }

        // Scan beam data
        let scanAngle = 0;

        // Shooting particles (data streams)
        const streams = [];
        for (let i = 0; i < 15; i++) {
            streams.push({
                startPhi: Math.acos(2 * Math.random() - 1),
                startTheta: Math.random() * Math.PI * 2,
                endPhi: Math.acos(2 * Math.random() - 1),
                endTheta: Math.random() * Math.PI * 2,
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.006,
                width: 0.5 + Math.random() * 1
            });
        }

        let t = 0;
        function project(x, y, z) {
            // Rotate Y
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            let x1 = x * cosY - z * sinY, z1 = x * sinY + z * cosY;
            // Rotate X
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
            let y1 = y * cosX - z1 * sinX, z2 = y * sinX + z1 * cosX;
            return { x: x1, y: y1, z: z2 };
        }

        function draw() {
            t += 0.016;
            ctx.clearRect(0, 0, rw, rh);

            // Smooth rotation follow mouse
            targetRotY = mouseX * 1.2;
            targetRotX = 0.3 + mouseY * 0.8;
            rotY += (targetRotY - rotY) * 0.03 + 0.003; // auto-rotate + mouse
            rotX += (targetRotX - rotX) * 0.03;

            const cx = rw / 2, cy = rh / 2;
            const R = Math.min(rw, rh) * 0.36;
            scanAngle += 0.015;

            // === Background glow ===
            const bg = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.8);
            bg.addColorStop(0, 'rgba(200,149,108,0.05)');
            bg.addColorStop(0.5, 'rgba(140,100,70,0.02)');
            bg.addColorStop(1, 'transparent');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, rw, rh);

            // Project and sort all points by depth
            const projected = points.map((p, i) => {
                const pr = project(p.ox, p.oy, p.oz);
                return { ...p, px: cx + pr.x * R, py: cy + pr.y * R, z: pr.z, idx: i };
            }).sort((a, b) => a.z - b.z);

            // === Draw connections (wireframe) ===
            ctx.lineWidth = 0.5;
            for (let i = 0; i < projected.length; i++) {
                for (let j = i + 1; j < Math.min(i + 8, projected.length); j++) {
                    const a = projected[i], b = projected[j];
                    const dx = a.px - b.px, dy = a.py - b.py;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < R * 0.35) {
                        const depthAlpha = ((a.z + b.z) / 2 + 1) * 0.5;
                        const alpha = (1 - dist / (R * 0.35)) * 0.12 * depthAlpha;
                        ctx.beginPath();
                        ctx.moveTo(a.px, a.py);
                        ctx.lineTo(b.px, b.py);
                        ctx.strokeStyle = `rgba(200,170,140,${alpha})`;
                        ctx.stroke();
                    }
                }
            }

            // === Scan beam ===
            const scanX = Math.cos(scanAngle);
            const scanZ = Math.sin(scanAngle);
            projected.forEach(p => {
                const dot = p.ox * scanX + p.oz * scanZ;
                if (dot > 0.95) {
                    const glow = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, 12);
                    glow.addColorStop(0, `rgba(255,200,120,${0.3 * (p.z + 1) * 0.5})`);
                    glow.addColorStop(1, 'transparent');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(p.px, p.py, 12, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // === Data streams (arcs on surface) ===
            streams.forEach(s => {
                s.progress += s.speed;
                if (s.progress > 1) {
                    s.progress = 0;
                    s.startPhi = s.endPhi; s.startTheta = s.endTheta;
                    s.endPhi = Math.acos(2 * Math.random() - 1);
                    s.endTheta = Math.random() * Math.PI * 2;
                }
                const steps = 20;
                ctx.beginPath();
                for (let i = 0; i <= steps; i++) {
                    const frac = i / steps;
                    if (frac > s.progress) break;
                    const fade = Math.max(0, 1 - (s.progress - frac) * 5);
                    const phi = s.startPhi + (s.endPhi - s.startPhi) * frac;
                    const theta = s.startTheta + (s.endTheta - s.startTheta) * frac;
                    const sx = Math.sin(phi) * Math.cos(theta);
                    const sy = Math.cos(phi);
                    const sz = Math.sin(phi) * Math.sin(theta);
                    const pr = project(sx, sy, sz);
                    const px = cx + pr.x * R, py = cy + pr.y * R;
                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.strokeStyle = `rgba(255,180,100,0.25)`;
                ctx.lineWidth = s.width;
                ctx.stroke();

                // Head glow
                const headPhi = s.startPhi + (s.endPhi - s.startPhi) * s.progress;
                const headTheta = s.startTheta + (s.endTheta - s.startTheta) * s.progress;
                const hx = Math.sin(headPhi) * Math.cos(headTheta);
                const hy = Math.cos(headPhi);
                const hz = Math.sin(headPhi) * Math.sin(headTheta);
                const hp = project(hx, hy, hz);
                if (hp.z > -0.2) {
                    const hpx = cx + hp.x * R, hpy = cy + hp.y * R;
                    const hg = ctx.createRadialGradient(hpx, hpy, 0, hpx, hpy, 8);
                    hg.addColorStop(0, 'rgba(255,200,120,0.6)');
                    hg.addColorStop(1, 'transparent');
                    ctx.fillStyle = hg;
                    ctx.beginPath();
                    ctx.arc(hpx, hpy, 8, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // === Draw points ===
            projected.forEach(p => {
                const depth = (p.z + 1) * 0.5; // 0 = back, 1 = front
                const pulse = Math.sin(t * 2 + p.pulse) * 0.3 + 0.7;
                const alpha = depth * 0.7 * pulse;
                const sz = p.size * (0.5 + depth * 0.5);

                // Glow for front-facing points
                if (depth > 0.5) {
                    const g = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, sz * 5);
                    g.addColorStop(0, `rgba(200,160,120,${alpha * 0.15})`);
                    g.addColorStop(1, 'transparent');
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.arc(p.px, p.py, sz * 5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Core dot
                ctx.beginPath();
                ctx.arc(p.px, p.py, sz, 0, Math.PI * 2);
                const r = 180 + depth * 60, g2 = 140 + depth * 40, b = 100 + depth * 30;
                ctx.fillStyle = `rgba(${r|0},${g2|0},${b|0},${alpha})`;
                ctx.fill();
            });

            // === Outer ring ===
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(200,149,108,0.06)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // === Rotating arc accent ===
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.05, scanAngle, scanAngle + 0.8);
            ctx.strokeStyle = 'rgba(255,180,100,0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();

            requestAnimationFrame(draw);
        }
        draw();
    }
});
