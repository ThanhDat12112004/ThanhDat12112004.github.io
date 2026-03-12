// ===================================================
// GALLERY.JS - Gallery page logic
// ===================================================

document.addEventListener('DOMContentLoaded', function () {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });

    initLanguageSwitcher();
    initFilter();
    initModal();
    initBackToTop();
    initGalleryCounters();
});

// ===================================================
// LANGUAGE SWITCHER
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
// FILTER
// ===================================================
function initFilter() {
    const buttons = document.querySelectorAll('.filter-buttons .filter-btn');
    const cards = document.querySelectorAll('.gallery-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-category');

            cards.forEach(card => {
                if (cat === 'all' || card.getAttribute('data-category') === cat) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ===================================================
// MODAL
// ===================================================
function initModal() {
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalCounter = document.getElementById('modalCounter');
    const closeBtn = document.getElementById('modalClose');
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');

    let currentIndex = 0;

    function getVisibleCards() {
        return Array.from(document.querySelectorAll('.gallery-card:not(.hidden)'));
    }

    function openModal(index) {
        const cards = getVisibleCards();
        if (index < 0 || index >= cards.length) return;
        currentIndex = index;
        const card = cards[currentIndex];
        const img = card.querySelector('img');
        const title = card.querySelector('h3');
        const desc = card.querySelector('.gallery-card-info p');

        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalTitle.textContent = title.textContent;
        modalDesc.textContent = desc.textContent;
        modalCounter.textContent = (currentIndex + 1) + ' / ' + cards.length;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Click on card or view button
    document.querySelectorAll('.gallery-card').forEach((card, i) => {
        card.addEventListener('click', () => {
            const visCards = getVisibleCards();
            const idx = visCards.indexOf(card);
            if (idx !== -1) openModal(idx);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cards = getVisibleCards();
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        openModal(currentIndex);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cards = getVisibleCards();
        currentIndex = (currentIndex + 1) % cards.length;
        openModal(currentIndex);
    });

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });
}

// ===================================================
// BACK TO TOP
// ===================================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===================================================
// GALLERY COUNTERS
// ===================================================
function initGalleryCounters() {
    const counters = document.querySelectorAll('.gallery-stats .stat-number');
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

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current + '+';
    }, 40);
}
