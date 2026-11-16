// ===== 1. Mobile navigation toggle =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== 2. Smooth scroll for in-page anchors =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== 3. Back to top button =====
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 300);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== 4. Scroll reveal animation =====
const revealEls = document.querySelectorAll('section, article');
revealEls.forEach(el => el.classList.add('reveal'));

function revealIfVisible(el) {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
    if (isVisible) el.classList.add('visible');
}

// Scroll-based fallback so content still appears if IO is unavailable
function checkReveals() {
    revealEls.forEach(revealIfVisible);
}

window.addEventListener('scroll', checkReveals);
window.addEventListener('load', checkReveals);

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('visible'));
}

// Safety net: never leave content hidden behind the reveal animation
window.addEventListener('load', () => {
    setTimeout(() => revealEls.forEach(el => el.classList.add('visible')), 1500);
});

checkReveals();

// ===== 5. Active navigation highlight on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav-menu a');

function highlightNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const link = document.querySelector('#nav-menu a[href="#' + section.id + '"]');
        if (!link) return;

        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);
highlightNav();

// ===== 6. Light / dark theme toggle =====
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function applyThemeIcon() {
    const isLight = root.getAttribute('data-theme') === 'light';
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(isLight));
}

function safeGetTheme() {
    try {
        return localStorage.getItem('theme');
    } catch (e) {
        return null;
    }
}

function safeSaveTheme(theme) {
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        // localStorage unavailable (private mode etc.)
    }
}

const savedTheme = safeGetTheme();
if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
}
applyThemeIcon();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', nextTheme);
        safeSaveTheme(nextTheme);
        applyThemeIcon();
    });
}
