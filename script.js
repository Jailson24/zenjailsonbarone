/* SCRIPT.JS SIMPLIFICADO — NÃO BUSCA NADA NA PLANILHA
   Mantém: Envio de formulários, carrossel, fullscreen, tema, modal.
   Remove: Qualquer tentativa de carregar depoimentos da planilha.
*/

/* ============================================================
   1) TEMA ESCURO/CLARO
============================================================ */
function initTheme() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const saved = localStorage.getItem("theme");
    const currentTheme = saved || "dark";

    document.documentElement.setAttribute("data-theme", currentTheme);
    toggle.textContent = currentTheme === "light" ? "☀️" : "🌙";

    toggle.addEventListener("click", () => {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const newTheme = isLight ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        toggle.textContent = newTheme === "light" ? "☀️" : "🌙";
    });
}

/* ============================================================
   2) SCROLL REVEAL
============================================================ */
function initScrollReveal() {
    const els = document.querySelectorAll(".reveal, .review");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach((el) => observer.observe(el));
}

/* ============================================================
   3) CARROSSEL AUTOMÁTICO + CLIQUES
============================================================ */
function initCarousel() {
    const track = document.querySelector(".carousel-track");
    const carouselContainer = document.querySelector(".carousel");
    if (!track || !carouselContainer) return;

    const prev = document.querySelector(".carousel-btn.prev");
    const next = document.querySelector(".carousel-btn.next");
    const slides = Array.from(track.querySelectorAll("img"));
    const totalSlides = slides.length;

    let index = 0;
    let autoPlayInterval = null;
    let isUserInteracting = false;

    function update() {
        const target = slides[index];
        if (!target) return;
        carouselContainer.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    }

    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (!isUserInteracting) {
                index = (index + 1) % totalSlides;
                update();
            }
        }, 4500);
    }

    function resetInteraction() {
        isUserInteracting = true;
        clearInterval(autoPlayInterval);
        setTimeout(() => {
            isUserInteracting = false;
            startAutoPlay();
        }, 3000);
    }

    if (next) next.addEventListener("click", () => { index = (index + 1) % totalSlides; update(); resetInteraction(); });
    if (prev) prev.addEventListener("click", () => { index = (index - 1 + totalSlides) % totalSlides; update(); resetInteraction(); });

    window.addEventListener("resize", update);

    update();
    startAutoPlay();
}

/* ============================================================
   4) HEADER RESPONSIVO
============================================================ */
function initSmartHeader() {
    const header = document.querySelector(".header");
    if (!header) return;

    function checkOverflow() {
        if (window.innerWidth < 650) header.classList.add("is-stack");
        else header.classList.remove("is-stack");
    }

    window.addEventListener("resize", checkOverflow);
    checkOverflow();
}

/* ============================================================
   5) ENVIO DE FORMULÁRIOS — APENAS POST, SEM BUSCAR DADOS
============================================================ */
async function sendFormData(data, formType, statusElement, form) {
    let scriptIdInput = document.getElementById(
        formType === "review" ? "scriptIdReview" :
        formType === "register" ? "scriptIdRegister" : "scriptId"
    );

    if (!scriptIdInput) return;

    const SCRIPT_URL = scriptIdInput.value;

    statusElement.textContent = "Enviando...";
    statusElement.style.color = "#2a86ff";

    const formData = new URLSearchParams({ formType, ...data });

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });

        statusElement.style.color = "green";
        if (formType === "quote") statusElement.textContent = "✅ Cotação enviada!";
        if (formType === "review") statusElement.textContent = "✅ Depoimento enviado!";
        if (formType === "register") statusElement.textContent = "✅ Cadastro enviado!";

        form.reset();
    } catch (e) {
        statusElement.style.color = "red";
        statusElement.textContent = "❌ Erro ao enviar.";
    }
}

function initForms() {
    const contactForm = document.getElementById("contactForm");
    const reviewForm = document.getElementById("addReviewForm");
    const registerForm = document.getElementById("registerForm");

    if (contactForm)
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            sendFormData({
                cName: cName.value.trim(),
                cPhone: cPhone.value.trim(),
                cMsg: cMsg.value.trim(),
            }, "quote", quoteFormStatus, contactForm);
        });

    if (reviewForm)
        reviewForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const rating = reviewForm.querySelector("input[name='rating']:checked");
            sendFormData({
                rName: rName.value.trim(),
                rEmailReview: rEmailReview.value.trim(),
                rRating: rating ? rating.value : 0,
                rComment: rComment.value.trim(),
            }, "review", reviewFormStatus, reviewForm);
        });

    if (registerForm)
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            sendFormData({
                rFName: rFName.value.trim(),
                rLName: rLName.value.trim(),
                rDOB: rDOB.value.trim(),
                rPhone: rPhone.value.trim(),
                rEmail: rEmail.value.trim(),
            }, "register", registerFormStatus, registerForm);
        });
}

/* ============================================================
   6) MODAL
============================================================ */
function initModal() {
    const modal = document.getElementById("registerModal");
    const openBtn = document.getElementById("openRegisterModal");
    const closeBtn = modal ? modal.querySelector(".modal-close-btn") : null;

    if (!modal || !openBtn || !closeBtn) return;

    openBtn.addEventListener("click", () => {
        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";
    });

    const closeModal = () => {
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
}

/* ============================================================
   7) PLAYER DE VÍDEO LAZY
============================================================ */
function initVideoPlayer() {
    const yt = document.getElementById("ytLazy");
    if (!yt) return;

    yt.addEventListener("click", () => {
        yt.innerHTML = `<iframe src='https://www.youtube.com/embed/dQw4
