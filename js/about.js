// ===================================================
// ABOUT PAGE - JavaScript
// ===================================================

document.addEventListener('DOMContentLoaded', function () {

    // ---------- Initialize AOS ----------
    AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-cubic'
    });

    // ---------- Language Switcher ----------
    initLanguageSwitcher();

    // ---------- Counter Animation ----------
    initCounterAnimation();

    // ---------- Typewriter Effect ----------
    initTypewriter();
});

// ===================================================
// LANGUAGE SWITCHER
// ===================================================
function initLanguageSwitcher() {
    const buttons = document.querySelectorAll('.lang-btn');
    // Load saved language or default to Vietnamese
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

    // Update active button
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    if (animate) {
        // Smooth transition
        document.body.classList.add('lang-switching');
        setTimeout(() => {
            applyLanguage(elements, lang);
            document.body.classList.remove('lang-switching');
        }, 300);
    } else {
        applyLanguage(elements, lang);
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Save preference
    localStorage.setItem('preferredLang', lang);

    // Restart typewriter with correct language
    if (animate) {
        setTimeout(() => {
            initTypewriter();
        }, 350);
    }
}

function applyLanguage(elements, lang) {
    elements.forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text !== null && text !== undefined) {
            // Check if it's an element with child nodes that aren't just text
            if (el.children.length === 0 || el.closest('.contact-chip')) {
                el.textContent = text;
            } else {
                // For elements that might have child elements, only replace text content
                // if it doesn't have important child elements
                const hasOnlyTextChildren = Array.from(el.childNodes).every(
                    node => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE
                );
                if (hasOnlyTextChildren) {
                    el.textContent = text;
                } else {
                    // Find the text node and update it
                    const textNodes = Array.from(el.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
                    if (textNodes.length > 0) {
                        textNodes[textNodes.length - 1].textContent = text;
                    } else {
                        el.innerHTML = text;
                    }
                }
            }
        }
    });
}

// ===================================================
// COUNTER ANIMATION
// ===================================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
    let current = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current + '+';
    }, 50);
}

// ===================================================
// TYPEWRITER EFFECT
// ===================================================
let typewriterTimeout = null;

function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    // Clear any existing typewriter
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
    }
    el.textContent = '';

    const lang = localStorage.getItem('preferredLang') || 'vi';

    const textsVi = [
        '<Lập Trình Viên Phần Mềm />',
        'Sinh viên HUTECH',
        'Đam mê Blockchain & AI',
        'Tự học không ngừng'
    ];

    const textsEn = [
        '<Software Developer />',
        'HUTECH Student',
        'Blockchain & AI Enthusiast',
        'Self-taught & Always Learning'
    ];

    const texts = lang === 'vi' ? textsVi : textsEn;
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            el.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 30 : 80;

        if (!isDeleting && charIndex === currentText.length) {
            delay = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = 500; // Pause before next word
        }

        typewriterTimeout = setTimeout(type, delay);
    }

    type();
}
