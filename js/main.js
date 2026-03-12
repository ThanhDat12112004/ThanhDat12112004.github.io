// ===================================================
// MAIN.JS - Shared + Home page logic
// ===================================================

document.addEventListener('DOMContentLoaded', function () {
    // Init AOS
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });

    // Language switcher (shared)
    initLanguageSwitcher();

    // Home typewriter
    initHomeTypewriter();
});

// ===================================================
// LANGUAGE SWITCHER (shared across pages)
// ===================================================
function initLanguageSwitcher() {
    const buttons = document.querySelectorAll('.lang-btn');
    if (!buttons.length) return;
    const savedLang = localStorage.getItem('preferredLang') || 'vi';
    setLanguage(savedLang, false);

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang, true);
        });
    });
}

function setLanguage(lang, animate) {
    const buttons = document.querySelectorAll('.lang-btn');
    const elements = document.querySelectorAll('[data-vi], [data-en]');

    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    if (animate) {
        document.body.classList.add('lang-switching');
        setTimeout(() => {
            applyLanguage(elements, lang);
            document.body.classList.remove('lang-switching');
        }, 300);
    } else {
        applyLanguage(elements, lang);
    }

    document.documentElement.lang = lang;
    localStorage.setItem('preferredLang', lang);

    // Restart typewriters
    if (animate) {
        setTimeout(() => {
            if (typeof initHomeTypewriter === 'function') initHomeTypewriter();
        }, 350);
    }
}

function applyLanguage(elements, lang) {
    elements.forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text === null || text === undefined) return;
        if (el.children.length === 0) {
            el.textContent = text;
        } else {
            const textNodes = Array.from(el.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
            if (textNodes.length > 0) {
                textNodes[textNodes.length - 1].textContent = text;
            }
        }
    });
}

// ===================================================
// HOME TYPEWRITER
// ===================================================
let homeTypewriterTimeout = null;

function initHomeTypewriter() {
    const el = document.getElementById('homeTypewriter');
    if (!el) return;
    if (homeTypewriterTimeout) clearTimeout(homeTypewriterTimeout);
    el.textContent = '';

    const lang = localStorage.getItem('preferredLang') || 'vi';

    const textsVi = [
        'Lập Trình Viên Phần Mềm',
        'Sinh viên HUTECH',
        'Đam mê Blockchain & AI',
        'Tự học không ngừng nghỉ'
    ];
    const textsEn = [
        'Software Developer',
        'HUTECH Student',
        'Blockchain & AI Enthusiast',
        'Self-taught & Always Learning'
    ];

    const texts = lang === 'vi' ? textsVi : textsEn;
    let textIdx = 0, charIdx = 0, deleting = false;

    function type() {
        const cur = texts[textIdx];
        if (deleting) {
            el.textContent = cur.substring(0, charIdx - 1);
            charIdx--;
        } else {
            el.textContent = cur.substring(0, charIdx + 1);
            charIdx++;
        }
        let delay = deleting ? 30 : 80;
        if (!deleting && charIdx === cur.length) {
            delay = 2000;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            textIdx = (textIdx + 1) % texts.length;
            delay = 500;
        }
        homeTypewriterTimeout = setTimeout(type, delay);
    }
    type();
}
