/* ============================================================
   SCRIPT.JS — VERSÃO CORRIGIDA (ENVIO FUNCIONANDO)
============================================================ */

function initTheme() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    toggle.textContent = theme === "light" ? "☀️" : "🌙";

    toggle.onclick = () => {
        const newTheme =
            document.documentElement.getAttribute("data-theme") === "light"
                ? "dark"
                : "light";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        toggle.textContent = newTheme === "light" ? "☀️" : "🌙";
    };
}

function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("visible");
                    obs.unobserve(e.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    els.forEach((el) => obs.observe(el));
}

function initCarousel() {
    const track = document.querySelector(".carousel-track");
    const container = document.querySelector(".carousel");
    if (!track || !container) return;

    const slides = [...track.children];
    let index = 0;

    function update() {
        container.scrollTo({
            left: slides[index].offsetLeft,
            behavior: "smooth",
        });
    }

    setInterval(() => {
        index = (index + 1) % slides.length;
        update();
    }, 4500);

    window.addEventListener("resize", update);
}

function initImageModal() {
    const modal = document.getElementById("imageModal");
    const imgModal = document.getElementById("imageModalImg");
    const close = document.querySelector(".image-modal-close");
    const images = document.querySelectorAll(".carousel-track img");

    if (!modal || !imgModal || !close) return;

    images.forEach((img) => {
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
    modal.onclick = (e) => e.target === modal && closeModal();
    document.addEventListener(
        "keydown",
        (e) => e.key === "Escape" && closeModal()
    );
}

let videoMuted = true;

function loadVideo(unmute = false) {
    const yt = document.getElementById("ytLazy");
    if (!yt) return;

    videoMuted = !unmute;
    const muteParam = videoMuted ? 1 : 0;
    const soundIcon = videoMuted ? "🔇" : "🔊";

    yt.innerHTML = `
        <iframe
            id="ytIframe"
            src="https://www.youtube.com/embed/0WPXa_NGiwk?autoplay=1&mute=${muteParam}&controls=0&modestbranding=1&rel=0&loop=1&playlist=0WPXa_NGiwk&enablejsapi=1"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowfullscreen
            loading="lazy">
        </iframe>
        <button id="videoSoundToggle" onclick="toggleVideoSound()" aria-label="Alternar som">${soundIcon}</button>
        <button id="fullscreenToggle" onclick="toggleFullscreen()" aria-label="Tela cheia">⛶</button>
    `;

    document.getElementById("videoSoundToggle").style.display = "flex";
    document.getElementById("fullscreenToggle").style.display = "flex";
}

function toggleVideoSound() {
    loadVideo(videoMuted);
}

function toggleFullscreen() {
    const elem = document.getElementById("ytLazy");

    if (!document.fullscreenElement) {
        elem.requestFullscreen?.();
    } else {
        document.exitFullscreen?.();
    }
}

/* ============================================================
   ENVIO PARA GOOGLE APPS SCRIPT (CORRIGIDO)
============================================================ */

function postToGoogle(url, data) {
    return fetch(url, {
        method: "POST",
        body: new URLSearchParams(data)
    });
}

document.addEventListener("DOMContentLoaded", () => {

    initTheme();
    initScrollReveal();
    initCarousel();
    initImageModal();
    loadVideo(false);

    /* =========================
       DEPOIMENTO
    ========================= */
    const reviewForm = document.getElementById("addReviewForm");

    if (reviewForm) {
        reviewForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const scriptURL = document.getElementById("scriptIdReview").value;

            const data = {
                formType: "review",
                rName: document.getElementById("rName").value,
                rEmailReview: document.getElementById("rEmailReview").value,
                rRating: document.querySelector('input[name="rating"]:checked')?.value || "",
                rComment: document.getElementById("rComment").value
            };

            try {
                await postToGoogle(scriptURL, data);
                alert("Depoimento enviado com sucesso! Aguarde aprovação.");
                reviewForm.reset();
            } catch (error) {
                alert("Erro ao enviar depoimento.");
                console.error(error);
            }
        });
    }

    /* =========================
       COTAÇÃO
    ========================= */
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const scriptURL = document.getElementById("scriptId").value;

            const data = {
                formType: "quote",
                cName: document.getElementById("cName").value,
                cPhone: document.getElementById("cPhone").value,
                cMsg: document.getElementById("cMsg").value
            };

            try {
                await postToGoogle(scriptURL, data);
                alert("Solicitação enviada com sucesso! Entraremos em contato.");
                contactForm.reset();
            } catch (error) {
                alert("Erro ao enviar solicitação.");
                console.error(error);
            }
        });
    }

});

window.toggleVideoSound = toggleVideoSound;
window.toggleFullscreen = toggleFullscreen;