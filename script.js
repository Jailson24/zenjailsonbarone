/* ============================================================
   SCRIPT.JS — GitHub Pages SAFE (VÍDEO COM SOM E FULLSCREEN)
============================================================ */

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

function initCarousel() {
    const track = document.querySelector(".carousel-track");
    const container = document.querySelector(".carousel");
    if (!track || !container) return;
    const slides = [...track.children];
    let index = 0;
    function update() {
        container.scrollTo({ left: slides[index].offsetLeft, behavior: "smooth" });
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

let videoMuted = true;

function loadVideo(unmute = false) {
    const yt = document.getElementById("ytLazy");
    if (!yt) return;

    videoMuted = !unmute;
    const muteParam = videoMuted ? 1 : 0;
    const soundIcon = videoMuted ? '🔇' : '🔊';

    yt.innerHTML = ''; 

    const iframeHTML = `
        <iframe
            id="ytIframe"
            src="https://www.youtube.com/embed/BWoW-6frVU4?autoplay=1&mute=${muteParam}&controls=0&modestbranding=1&rel=0&loop=1&playlist=BWoW-6frVU4&enablejsapi=1"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowfullscreen
            loading="lazy">
        </iframe>
        <button id="videoSoundToggle" onclick="toggleVideoSound()" aria-label="Alternar som do vídeo">${soundIcon}</button>
        <button id="fullscreenToggle" onclick="toggleFullscreen()" aria-label="Tela cheia">⛶</button>
    `;

    yt.insertAdjacentHTML('beforeend', iframeHTML);
    
    const soundButton = document.getElementById("videoSoundToggle");
    const fsButton = document.getElementById("fullscreenToggle");
    if (soundButton) soundButton.style.display = 'flex';
    if (fsButton) fsButton.style.display = 'flex';
}

function toggleVideoSound() {
    loadVideo(videoMuted); 
}

function toggleFullscreen() {
    const elem = document.getElementById("ytLazy");

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
    initCarousel();
    initImageModal();
    loadVideo(false); 

    const openRegisterModal = document.getElementById('openRegisterModal');
    const registerModal = document.getElementById('registerModal');

    if (openRegisterModal && registerModal) {
        openRegisterModal.onclick = () => registerModal.classList.add('is-open');
        registerModal.onclick = e => {
            if (e.target === registerModal) registerModal.classList.remove('is-open');
        };
    }
});

window.toggleVideoSound = toggleVideoSound;
window.toggleFullscreen = toggleFullscreen;