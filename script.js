// script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            header.classList.toggle('nav-active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('nav-active');
        });
    });

    // --- Sticky Header Background on Scroll ---
    const updateHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateHeader);
    updateHeader();

    // --- Staggered Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay based on element index within its parent
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
                const index = siblings.indexOf(entry.target);
                const delay = index * 100;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Animated Counters ---
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1800;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '+');
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => {
        el.dataset.suffix = '+';
        counterObserver.observe(el);
    });

    // --- Parallax on hero shapes ---
    const shape1 = document.querySelector('.shape-1');
    const shape2 = document.querySelector('.shape-2');

    if (shape1 && shape2) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            shape1.style.transform = `translateY(${scrollY * 0.15}px)`;
            shape2.style.transform = `translateY(${scrollY * -0.1}px)`;
        });
    }

    // --- Cursor glow on cards ---
    const cards = document.querySelectorAll('.service-card, .cm-card, .portfolio-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- Smooth active nav link highlight on scroll ---
    const sections = document.querySelectorAll('section[id], div.stats-strip');
    const navItems = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.getAttribute('id') || '';
            }
        });
        navItems.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-link');
            }
        });
    };

    window.addEventListener('scroll', highlightNav);

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all open items
            faqItems.forEach(i => i.classList.remove('open'));
            // If it wasn't open, open it
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });


    // --- Hero Mockup: Google + Instagram cycle ---
    const searchText   = document.getElementById('hm-search-text');
    const hmCursor     = document.getElementById('hm-cursor');
    const searchbar    = document.getElementById('hm-searchbar');
    const igBar        = document.getElementById('hm-ig-bar');
    const sceneGoogle  = document.getElementById('hm-scene-google');
    const sceneIg      = document.getElementById('hm-scene-ig');
    const firstResult  = document.querySelector('.hm-first');
    const ghosts       = document.querySelectorAll('.hm-result-ghost');
    const likeCount    = document.querySelector('.hm-ig-likecount');
    const queries      = ['restaurante en málaga', 'fontanero urgente málaga', 'clínica dental málaga'];
    let qIndex = 0;

    function typeText(el, text, speed, cb) {
        if (!el) { if (cb) cb(); return; }
        el.textContent = '';
        let i = 0;
        const iv = setInterval(() => {
            el.textContent += text[i++];
            if (i >= text.length) { clearInterval(iv); if (cb) cb(); }
        }, speed);
    }

    function animateLikes(el, target, duration) {
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            el.textContent = Math.floor(p * target);
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    function showScene(show, hide) {
        if (hide) hide.classList.remove('active');
        if (show) show.classList.add('active');
    }

    function runGoogle() {
        if (searchbar) searchbar.style.display = 'flex';
        if (igBar) igBar.style.display = 'none';
        showScene(sceneGoogle, sceneIg);
        if (hmCursor) hmCursor.style.display = 'inline';

        // Type query
        typeText(searchText, queries[qIndex], 55, () => {
            setTimeout(() => {
                ghosts.forEach((g, i) => setTimeout(() => g.classList.add('visible'), i * 150));
                setTimeout(() => firstResult && firstResult.classList.add('visible'), 500);

                // After 3.2s, transition to Instagram
                setTimeout(() => {
                    if (firstResult) firstResult.classList.remove('visible');
                    ghosts.forEach(g => g.classList.remove('visible'));
                    setTimeout(runInstagram, 400);
                }, 3200);
            }, 300);
        });
    }

    function runInstagram() {
        if (searchText) searchText.textContent = '';
        if (searchbar) searchbar.style.display = 'none';
        if (igBar) igBar.style.display = 'flex';
        showScene(sceneIg, sceneGoogle);

        const follCount = document.querySelector('.hm-ig-follcount');
        if (likeCount) { likeCount.textContent = '0'; animateLikes(likeCount, 1284, 1800); }
        if (follCount) { follCount.textContent = '0'; animateLikes(follCount, 2340, 2000); }

        // After 3.5s, go back to Google with next query
        setTimeout(() => {
            qIndex = (qIndex + 1) % queries.length;
            runGoogle();
        }, 3500);
    }

    setTimeout(runGoogle, 800);

});

