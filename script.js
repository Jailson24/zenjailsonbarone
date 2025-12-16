/* ============================================================
   SCRIPT.JS — Código Otimizado para GitHub Pages
============================================================ */

/* ============================================================
   1) TEMA ESCURO/CLARO
============================================================ */
function initTheme() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const saved = localStorage.getItem("theme");
    const currentTheme = saved || "dark";

    document.documentElement.setAttribute("data-theme", currentTheme);
    toggle.setAttribute("aria-pressed", currentTheme === "light");
    toggle.textContent = currentTheme === "light" ? "☀️" : "🌙";

    toggle.addEventListener("click", () => {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const newTheme = isLight ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        toggle.setAttribute("aria-pressed", newTheme === "light");
        toggle.textContent = newTheme === "light" ? "☀️" : "🌙";
    });
}

/* ============================================================
   2) SCROLL REVEAL
============================================================ */
function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    els.forEach((el) => observer.observe(el));
}

/* ============================================================
   3) CARROSSEL
============================================================ */
function initCarousel() {
    const track = document.querySelector(".carousel-track");
    const carouselContainer = document.querySelector(".carousel");

    if (!track || !carouselContainer) return;

    const prev = document.querySelector(".carousel-btn.prev");
    const next = document.querySelector(".carousel-btn.next");
    const slides = [...track.children];
    const totalSlides = slides.length;

    let index = 0;
    let autoPlayInterval;

    function update() {
        if (slides.length === 0) return;

        const targetSlide = slides[index];
        const targetOffsetLeft = targetSlide.offsetLeft;

        carouselContainer.scrollTo({
            left: targetOffsetLeft,
            behavior: 'smooth'
        });
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Navegação Manual
    if (next && prev) {
        next.addEventListener("click", () => {
            index = (index + 1) % totalSlides;
            update();
            resetAutoPlay();
        });

        prev.addEventListener("click", () => {
            index = (index - 1 + totalSlides) % totalSlides;
            update();
            resetAutoPlay();
        });
    }

    // Auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            index = (index + 1) % totalSlides;
            update();
        }, 4500);
    }

    window.addEventListener("resize", update);
    setTimeout(update, 100);
    startAutoPlay();
}

/* ============================================================
   4) HEADER RESPONSIVO
============================================================ */
function initSmartHeader() {
    const header = document.querySelector(".header");
    if (!header) return;

    function resize() {
        header.classList.toggle("is-stack", window.innerWidth < 650);
    }

    window.addEventListener("resize", resize);
    resize();
}

/* ============================================================
   5) FORMULÁRIOS
============================================================ */
async function sendFormData(data, type, status, form) {
    const id =
        type === "review" ? "scriptIdReview" :
        type === "register" ? "scriptIdRegister" :
        "scriptId";

    const url = document.getElementById(id)?.value;
    if (!url) return;

    status.textContent = "Enviando...";

    await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ formType: type, ...data })
    });

    status.textContent = "✅ Enviado com sucesso!";
    form.reset();
}

function initQuoteForm() {
    const f = contactForm;
    f?.addEventListener("submit", e => {
        e.preventDefault();
        sendFormData({
            cName: cName.value,
            cPhone: cPhone.value,
            cMsg: cMsg.value
        }, "quote", quoteFormStatus, f);
    });
}

function initReviewForm() {
    const f = addReviewForm;
    f?.addEventListener("submit", e => {
        e.preventDefault();
        sendFormData({
            rName: rName.value,
            rEmailReview: rEmailReview.value,
            rRating: f.rating.value,
            rComment: rComment.value
        }, "review", reviewFormStatus, f);
    });
}

function initRegisterForm() {
    const f = registerForm;
    f?.addEventListener("submit", e => {
        e.preventDefault();
        sendFormData({
            rFName: rFName.value,
            rLName: rLName.value,
            rDOB: rDOB.value,
            rPhone: rPhone.value,
            rEmail: rEmail.value
        }, "register", registerFormStatus, f);
    });
}

/* ============================================================
   6) MODAL
============================================================ */
function initModal() {
    const modal = document.getElementById('registerModal');
    const openBtn = document.getElementById('openRegisterModal');
    const closeBtn = modal ? modal.querySelector('.modal-close-btn') : null;

    if (!modal || !openBtn || !closeBtn) return;

    const openModal = () => {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
}

/* ============================================================
   7) VÍDEO — AUTOPLAY SILENCIOSO + BOTÃO ATIVAR SOM
============================================================ */
function initVideoPlayer() {
    const yt = document.getElementById("ytLazy");
    if (!yt) return;

    yt.style.position = "relative";

    yt.innerHTML = `
        <iframe
            id="ytPlayer"
            src="https://www.youtube.com/embed/BWoW-6frVU4?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=BWoW-6frVU4&enablejsapi=1"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
            loading="lazy"
            style="width:100%;height:100%;border:0;">
        </iframe>
    `;

    const soundBtn = document.createElement("div");
    soundBtn.textContent = "🔊 Ativar som";
    soundBtn.style.position = "absolute";
    soundBtn.style.bottom = "15px";
    soundBtn.style.right = "15px";
    soundBtn.style.background = "rgba(0,0,0,0.75)";
    soundBtn.style.color = "#fff";
    soundBtn.style.padding = "10px 14px";
    soundBtn.style.borderRadius = "10px";
    soundBtn.style.fontSize = "14px";
    soundBtn.style.cursor = "pointer";
    soundBtn.style.zIndex = "10";

    yt.appendChild(soundBtn);

    soundBtn.addEventListener("click", e => {
        e.stopPropagation();

        const iframe = document.getElementById("ytPlayer");
        if (!iframe) return;

        iframe.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "unMute", args: [] }),
            "*"
        );

        iframe.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "setVolume", args: [100] }),
            "*"
        );

        soundBtn.remove();
    });
}

/* ============================================================
   EXECUÇÃO GERAL
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
    initCarousel();
    initSmartHeader();
    initQuoteForm(); 
    initReviewForm(); 
    initRegisterForm(); 
    initModal();
    initVideoPlayer();
});
