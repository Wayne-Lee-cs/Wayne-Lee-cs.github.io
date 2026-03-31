document.addEventListener('DOMContentLoaded', function () {
    // ===== Mobile menu toggle =====
    var toggle = document.querySelector('.mobile-toggle');
    var menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        function closeMenu() {
            menu.classList.remove('open');
            document.body.style.overflow = '';
        }
        toggle.addEventListener('click', function() {
            menu.classList.toggle('open');
            document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
        });
        var links = menu.querySelectorAll('.nav-link');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', closeMenu);
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
            '.research-card, .team-card, .project-item, .contact-block, .section-title, .section-description, .timeline-item, .pub-item, .blog-card, .skills-wrap'
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

    // ===== Dark Mode Toggle =====
    var themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            if (typeof drawRadar === 'function') drawRadar();
        });
    }

    // ===== i18n Toggle =====
    var i18n = {
        zh: {
            'nav.home':'首页','nav.about':'关于','nav.timeline':'经历','nav.projects':'项目','nav.publications':'论文','nav.blog':'博客','nav.contact':'联系',
            'hero.desc':'我是浙江大学人工智能专业的本科生，专注于深度学习、计算机视觉和具身智能的前沿研究。','hero.projects':'查看项目','hero.contact':'联系我',
            'about.title':'探索人工智能的<br>前沿领域','about.desc':'我们的使命是推动人工智能技术的发展，并将其应用于解决实际问题。',
            'about.dl':'神经网络、卷积神经网络和循环神经网络的研究与应用，探索模型架构的创新边界。',
            'about.cv':'图像识别、目标检测和图像分割技术的创新，让机器真正理解视觉世界。',
            'about.ei':'融合感知、决策与控制的具身智能研究，让AI在物理世界中自主交互与学习。',
            'about.infra':'高性能计算集群、分布式训练框架与模型部署流水线的构建与优化，为大规模AI研发提供坚实的基础设施支撑。',
            'skills.label':'技能','skills.title':'技术栈',
            'timeline.label':'经历','timeline.title':'学术与项目经历',
            'tl.1.title':'浙江大学 · 人工智能专业','tl.1.desc':'本科在读，主修人工智能，研究方向探索中。',
            'team.title':'草台班子这块','team.desc':'理论与应用交叉领域的研究者和工程师团队。',
            'projects.title':'精选研究项目与应用','projects.desc':'从医疗影像到自动驾驶，项目覆盖AI应用的全谱系。',
            'pub.title':'学术论文','pub.desc':'精选论文与预印本。','pub.placeholder':'更多论文即将发布，敬请期待。',
            'blog.title':'笔记与博客','blog.desc':'记录AI研究中的思考、技术深潜和学习笔记。','blog.all':'全部',
            'contact.title':'欢迎合作与交流','contact.desc':'无论是合作、研究机会还是交流，都欢迎联系我。'
        },
        en: {
            'nav.home':'Home','nav.about':'About','nav.timeline':'Timeline','nav.projects':'Projects','nav.publications':'Publications','nav.blog':'Blog','nav.contact':'Contact',
            'hero.desc':'I\'m an undergraduate student at Zhejiang University, majoring in Artificial Intelligence. My work focuses on pushing the boundaries of deep learning, computer vision, and natural language processing.','hero.projects':'View Projects','hero.contact':'Get in Touch',
            'about.title':'Exploring the frontiers<br>of artificial intelligence','about.desc':'Our mission is to advance AI technology and apply it to solve real-world problems.',
            'about.dl':'Research and application of neural networks, CNNs, and RNNs, exploring the innovative boundaries of model architectures.',
            'about.cv':'Innovation in image recognition, object detection, and image segmentation, enabling machines to truly understand the visual world.',
            'about.ei':'Embodied intelligence research integrating perception, decision-making, and control for autonomous interaction in the physical world.',
            'about.infra':'Building and optimizing HPC clusters, distributed training frameworks, and model deployment pipelines for large-scale AI R&D.',
            'skills.label':'Skills','skills.title':'Tech Stack',
            'timeline.label':'Experience','timeline.title':'Academic & Project Experience',
            'tl.1.title':'Zhejiang University · AI Major','tl.1.desc':'Undergraduate student, majoring in Artificial Intelligence. Exploring research directions.',
            'team.title':'The Team','team.desc':'A team of dedicated researchers and engineers working at the intersection of theory and application.',
            'projects.title':'Selected Projects','projects.desc':'From medical imaging to autonomous driving, our projects span the full spectrum of AI applications.',
            'pub.title':'Publications','pub.desc':'Selected publications and preprints.','pub.placeholder':'More publications coming soon.',
            'blog.title':'Blog & Notes','blog.desc':'Recording thoughts on AI research, technical deep-dives, and learning notes along the way.','blog.all':'All',
            'contact.title':'Let\'s Connect','contact.desc':'Whether you\'re interested in collaboration, research opportunities, or just want to connect — I\'d love to hear from you.'
        }
    };
    var currentLang = localStorage.getItem('lang') || 'en';
    var langBtn = document.querySelector('.lang-toggle');
    var htmlKeys = {'about.title':1}; // keys that contain <br>
    function applyLang(lang) {
        var dict = i18n[lang] || i18n.zh;
        var els = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < els.length; i++) {
            var key = els[i].getAttribute('data-i18n');
            if (dict[key]) {
                if (htmlKeys[key]) els[i].innerHTML = dict[key];
                else els[i].textContent = dict[key];
            }
        }
        document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    }
    applyLang(currentLang);
    if (langBtn) {
        langBtn.addEventListener('click', function() {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            localStorage.setItem('lang', currentLang);
            applyLang(currentLang);
        });
    }

    // ===== Blog Tag Filter =====
    var filters = document.querySelectorAll('.blog-filter');
    var blogCards = document.querySelectorAll('.blog-card');
    for (var f = 0; f < filters.length; f++) {
        filters[f].addEventListener('click', function() {
            for (var x = 0; x < filters.length; x++) filters[x].classList.remove('active');
            this.classList.add('active');
            var tag = this.dataset.tag;
            for (var c = 0; c < blogCards.length; c++) {
                var tags = blogCards[c].dataset.tags || '';
                blogCards[c].style.display = (tag === 'all' || tags.indexOf(tag) !== -1) ? '' : 'none';
            }
        });
    }

    // ===== Back to Top =====
    var btt = document.querySelector('.back-to-top');

    // Merge back-to-top visibility into the existing scroll handler
    var origOnScroll = onScroll;
    onScroll = function() {
        origOnScroll();
        if (btt) btt.classList.toggle('visible', window.scrollY > 600);
    };
    if (btt) {
        btt.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== BibTeX Copy =====
    var bibBtns = document.querySelectorAll('.pub-bib-btn');
    for (var b = 0; b < bibBtns.length; b++) {
        bibBtns[b].addEventListener('click', function() {
            var bib = this.dataset.bib;
            var self = this;
            if (bib && navigator.clipboard) {
                navigator.clipboard.writeText(bib).then(function() {
                    var orig = self.textContent;
                    self.textContent = 'Copied!';
                    setTimeout(function() { self.textContent = orig; }, 1500);
                }).catch(function() {
                    // Fallback: select text from a temp textarea
                    var ta = document.createElement('textarea');
                    ta.value = bib; ta.style.position = 'fixed'; ta.style.opacity = '0';
                    document.body.appendChild(ta); ta.select();
                    try { document.execCommand('copy'); self.textContent = 'Copied!'; } catch(e) {}
                    document.body.removeChild(ta);
                    setTimeout(function() { self.textContent = 'BibTeX'; }, 1500);
                });
            }
        });
    }

    // ===== Typewriter Effect =====
    var tw = document.querySelector('.typewriter');
    if (tw) {
        var twLang = currentLang;
        var twLines = (tw.getAttribute('data-text-' + twLang) || tw.getAttribute('data-text-en')).split('|');
        var twLine = 0, twChar = 0, twText = '';
        function typeNext() {
            if (twLine >= twLines.length) { tw.classList.add('done'); return; }
            if (twChar <= twLines[twLine].length) {
                twText = twLines.slice(0, twLine).join('\n') + '\n' + twLines[twLine].substring(0, twChar);
                tw.innerHTML = twText.split('\n').join('<br>');
                twChar++;
                setTimeout(typeNext, 40 + Math.random() * 30);
            } else {
                twLine++; twChar = 0;
                setTimeout(typeNext, 300);
            }
        }
        setTimeout(typeNext, 500);
    }

    // ===== Skills Radar Chart =====
    var radarCanvas = document.getElementById('radar-canvas');
    if (radarCanvas) {
        var rCtx = radarCanvas.getContext('2d');
        var skills = [
            { name: 'Python', value: 0.85, color: '#c8956c' },
            { name: 'PyTorch', value: 0.65, color: '#d4a574' },
            { name: 'C/C++', value: 0.6, color: '#a07850' },
            { name: 'Linux', value: 0.7, color: '#b08860' },
            { name: 'Math', value: 0.75, color: '#c0a080' },
            { name: 'Git', value: 0.7, color: '#d0b090' }
        ];
        var legendEl = document.getElementById('skills-legend');
        if (legendEl) {
            for (var si = 0; si < skills.length; si++) {
                var item = document.createElement('div');
                item.className = 'skill-item';
                var dot = document.createElement('span');
                dot.className = 'skill-dot';
                dot.style.background = skills[si].color;
                var name = document.createTextNode(skills[si].name + ' ');
                var pct = document.createElement('span');
                pct.style.cssText = 'color:#666;margin-left:auto';
                pct.textContent = Math.round(skills[si].value * 100) + '%';
                item.appendChild(dot); item.appendChild(name); item.appendChild(pct);
                legendEl.appendChild(item);
            }
        }
        function drawRadar() {
            var w = radarCanvas.width, h = radarCanvas.height;
            var cx = w / 2, cy = h / 2, maxR = Math.min(w, h) * 0.38;
            var n = skills.length, step = (Math.PI * 2) / n;
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            var gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
            var axisColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
            var labelColor = isDark ? 'rgba(250,249,247,0.7)' : 'rgba(25,25,25,0.6)';
            rCtx.clearRect(0, 0, w, h);
            // Grid rings
            for (var ring = 1; ring <= 4; ring++) {
                var r = maxR * (ring / 4);
                rCtx.beginPath();
                for (var i = 0; i <= n; i++) {
                    var a = step * i - Math.PI / 2;
                    var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
                    if (i === 0) rCtx.moveTo(x, y); else rCtx.lineTo(x, y);
                }
                rCtx.strokeStyle = gridColor;
                rCtx.lineWidth = 1;
                rCtx.stroke();
            }
            // Axis lines
            for (var i = 0; i < n; i++) {
                var a = step * i - Math.PI / 2;
                rCtx.beginPath();
                rCtx.moveTo(cx, cy);
                rCtx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
                rCtx.strokeStyle = axisColor;
                rCtx.stroke();
            }
            // Data polygon
            rCtx.beginPath();
            for (var i = 0; i < n; i++) {
                var a = step * i - Math.PI / 2;
                var r = maxR * skills[i].value;
                var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
                if (i === 0) rCtx.moveTo(x, y); else rCtx.lineTo(x, y);
            }
            rCtx.closePath();
            rCtx.fillStyle = 'rgba(200,149,108,0.15)';
            rCtx.fill();
            rCtx.strokeStyle = 'rgba(200,149,108,0.6)';
            rCtx.lineWidth = 2;
            rCtx.stroke();
            // Data points + labels
            for (var i = 0; i < n; i++) {
                var a = step * i - Math.PI / 2;
                var r = maxR * skills[i].value;
                var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
                rCtx.beginPath();
                rCtx.arc(x, y, 4, 0, 6.28);
                rCtx.fillStyle = skills[i].color;
                rCtx.fill();
                // Label
                var lx = cx + Math.cos(a) * (maxR + 20), ly = cy + Math.sin(a) * (maxR + 20);
                rCtx.fillStyle = labelColor;
                rCtx.font = '12px Inter, sans-serif';
                rCtx.textAlign = 'center';
                rCtx.textBaseline = 'middle';
                rCtx.fillText(skills[i].name, lx, ly);
            }
        }
        drawRadar();
    }

    // ===== Konami Code Easter Egg =====
    var konamiSeq = [38,38,40,40,37,39,37,39,66,65]; // up up down down left right left right B A
    var konamiIdx = 0;
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === konamiSeq[konamiIdx]) {
            konamiIdx++;
            if (konamiIdx === konamiSeq.length) {
                konamiIdx = 0;
                showEasterEgg();
            }
        } else {
            konamiIdx = 0;
        }
    });
    function showEasterEgg() {
        var egg = document.createElement('div');
        egg.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);cursor:pointer;animation:fadeInUp 0.4s ease';
        var inner = document.createElement('div');
        inner.style.textAlign = 'center';
        inner.style.color = '#faf9f7';
        var emoji = document.createElement('div');
        emoji.style.cssText = 'font-size:80px;margin-bottom:20px';
        emoji.textContent = '🎮';
        var h = document.createElement('h2');
        h.style.cssText = 'font-family:Georgia,serif;font-size:32px;font-weight:400;margin-bottom:12px';
        h.textContent = 'You found the secret!';
        var p1 = document.createElement('p');
        p1.style.cssText = 'color:#9b9590;font-size:16px';
        p1.textContent = 'Konami Code activated. You\'re a true gamer.';
        var p2 = document.createElement('p');
        p2.style.cssText = 'color:#c8956c;font-size:14px;margin-top:24px';
        p2.textContent = 'Click anywhere to close';
        inner.appendChild(emoji); inner.appendChild(h); inner.appendChild(p1); inner.appendChild(p2);
        egg.appendChild(inner);
        egg.addEventListener('click', function() { egg.remove(); });
        document.body.appendChild(egg);
    }

    // ===== Terminal Mode (press ~ to toggle) =====
    var terminalEl = document.getElementById('terminal');
    var terminalInput = document.getElementById('terminal-input');
    var terminalOutput = document.getElementById('terminal-output');
    if (terminalEl && terminalInput && terminalOutput) {
        var termCmds = {
            help: 'Available commands:\n  about    - About me\n  skills   - My tech stack\n  projects - List projects\n  blog     - Go to blog\n  contact  - Contact info\n  theme    - Toggle dark mode\n  clear    - Clear terminal\n  exit     - Close terminal',
            about: 'Juyang Li\nUndergraduate @ Zhejiang University\nMajor: Artificial Intelligence\nInterests: Deep Learning, Computer Vision, Embodied AI',
            skills: 'Python ████████░░ 85%\nPyTorch █████░░░░░ 65%\nC/C++  ██████░░░░ 60%\nLinux  ███████░░░ 70%\nMath   ████████░░ 75%\nGit    ███████░░░ 70%',
            projects: '1. 智能医疗影像诊断\n2. 具身智能操控系统\n3. 自动驾驶感知系统\n4. 虚拟助手大模型\n5. 推荐系统引擎\n6. 异常检测平台',
            contact: 'Email: lijuyang@zju.edu.cn\nGitHub: github.com/Wayne-Lee-cs',
            clear: '__clear__',
            exit: '__exit__',
            blog: '__nav__#blog',
            theme: '__theme__'
        };
        function termAddLine(text, cls) {
            var lines = text.split('\n');
            for (var i = 0; i < lines.length; i++) {
                var div = document.createElement('div');
                div.className = 'terminal-line' + (cls ? ' ' + cls : '');
                div.textContent = lines[i];
                terminalOutput.appendChild(div);
            }
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
        function termExec(cmd) {
            cmd = cmd.trim().toLowerCase();
            termAddLine('$ ' + cmd, 't-cmd');
            if (!cmd) return;
            var result = termCmds[cmd];
            if (!result) { termAddLine('Command not found: ' + cmd + '. Type "help" for available commands.', 't-error'); return; }
            if (result === '__clear__') { terminalOutput.innerHTML = ''; return; }
            if (result === '__exit__') { terminalEl.hidden = true; document.body.style.overflow = ''; return; }
            if (result === '__theme__') {
                var cur = document.documentElement.getAttribute('data-theme');
                var next = cur === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
                termAddLine('Theme switched to ' + next, 't-result');
                return;
            }
            if (result.indexOf('__nav__') === 0) {
                terminalEl.hidden = true; document.body.style.overflow = '';
                window.location.hash = result.replace('__nav__', '');
                return;
            }
            termAddLine(result, 't-result');
        }
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { termExec(this.value); this.value = ''; }
            if (e.key === 'Escape') { terminalEl.hidden = true; document.body.style.overflow = ''; }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === '`' && !e.ctrlKey && !e.altKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                if (terminalEl.hidden) {
                    terminalEl.hidden = false;
                    document.body.style.overflow = 'hidden';
                    terminalInput.focus();
                } else {
                    terminalEl.hidden = true;
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // ===== Terminal Hint =====
    var hint = document.getElementById('terminal-hint');
    if (hint && !sessionStorage.getItem('terminal-hint-seen')) {
        setTimeout(function() { hint.classList.add('show'); }, 3000);
        setTimeout(function() {
            hint.classList.remove('show');
            hint.classList.add('hide');
            sessionStorage.setItem('terminal-hint-seen', '1');
        }, 8000);
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
        var _pr = { x: 0, y: 0, z: 0 }; // reused projection result

        function projectPt(x, y, z) {
            var x1 = x * cosY - z * sinY, z1 = x * sinY + z * cosY;
            _pr.x = x1; _pr.y = y * cosX - z1 * sinX; _pr.z = y * sinX + z1 * cosX;
            return _pr;
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

            // Draw connections —batch into single path per alpha range
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

            // Scan beam —only check front-facing points
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

            // Draw points —skip glow for back-facing, reduce gradient calls
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

        // Visibility API —pause animation when tab is hidden
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

