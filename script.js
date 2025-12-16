/* ============================================================
   SCRIPT.JS — GitHub Pages SAFE (ATUALIZADO)
============================================================ */

/* =======================
   1) TEMA
======================= */
function initTheme() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    toggle.textContent = theme === "light" ? "☀️" : "🌙";

    toggle.onclick = () => {
        const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        toggle.textContent = newTheme === "light" ? "☀️" : "🌙";
    };
}

/* =======================
   2) SCROLL REVEAL
======================= */
function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach(el => obs.observe(el));
}

/* =======================
   3) CARROSSEL
======================= */
function initCarousel() {
    const track = document.querySelector(".carousel-track");
    const container = document.querySelector(".carousel");
    const prev = document.querySelector(".carousel-btn.prev");
    const next = document.querySelector(".carousel-btn.next");

    if (!track || !container) return;

    const slides = [...track.children];
    let index = 0;
    let auto;

    function update() {
        container.scrollTo({
            left: slides[index].offsetLeft,
            behavior: "smooth"
        });
    }

    function start() {
        auto = setInterval(() => {
            index = (index + 1) % slides.length;
            update();
        }, 4500);
    }

    function reset() {
        clearInterval(auto);
        start();
    }

    next?.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        update();
        reset();
    });

    prev?.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
        reset();
    });

    window.addEventListener("resize", update);
    setTimeout(update, 100);
    start();
}

/* =======================
   4) HEADER
======================= */
function initSmartHeader() {
    const header = document.querySelector(".header");
    if (!header) return;

    const resize = () => header.classList.toggle("is-stack", window.innerWidth < 650);
    window.addEventListener("resize", resize);
    resize();
}

/* =======================
   5) FORMULÁRIOS
======================= */
function initForms() {
    // Mantido como está — não interfere em imagens/vídeo
}

/* =======================
   6) MODAL IMAGEM FULLSCREEN
======================= */
function initImageModal() {
    const modal = document.getElementById("imageModal");
    const imgModal = document.getElementById("imageModalImg");
    const close = document.querySelector(".image-modal-close");
    const images = document.querySelectorAll(".carousel-track img");

    if (!modal || !imgModal || !close) return;

    images.forEach(img => {
        img.onclick = () => {
            imgModal.src = img.src;
            modal.classList.add("open");
            document.body.style.overflow = "hidden";
        };
    });

    const closeModal = () => {
        modal.classList.remove("open");
        imgModal.src = "";
        document.body.style.overflow = "";
    };

    close.onclick = closeModal;
    modal.onclick = e => e.target === modal && closeModal();
    document.addEventListener("keydown", e => e.key === "Escape" && closeModal());
}

/* =======================
   7) VÍDEO YOUTUBE
======================= */
function initVideoPlayer() {
    const yt = document.getElementById("ytLazy");
    if (!yt) return;

    yt.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/BWoW-6frVU4?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=BWoW-6frVU4"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
            loading="lazy">
        </iframe>
    `;
}

/* =======================
   INIT GERAL
======================= */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
    initCarousel();
    initSmartHeader();
    initForms();
    initImageModal();
    initVideoPlayer();
});
