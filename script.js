/* ============================================================
   SCRIPT.JS — GitHub Pages SAFE (VÍDEO COM SOM)
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

// O vídeo deve iniciar mudo.
let videoMuted = true;

/**
 * Carrega o iframe do YouTube.
 * @param {boolean} unmute - Se deve ser carregado com som (false = mudo, true = som ligado).
 */
function loadVideo(unmute = false) {
    const yt = document.getElementById("ytLazy");
    if (!yt) return;

    // 1. Atualiza o estado global com base no que foi solicitado
    videoMuted = !unmute;
    
    // 2. Define os parâmetros do iframe e o ícone do botão
    const muteParam = videoMuted ? 1 : 0;
    
    // O ícone reflete o estado ATUAL do vídeo:
    // Se o vídeo está MUDO (true), o ícone mostra MUDO (🔇).
    // Se o vídeo está LIGADO (false), o ícone mostra SOM ALTO (🔊).
    const soundIcon = videoMuted ? '🔇' : '🔊';

    // 3. Limpa o container
    yt.innerHTML = ''; 

    // 4. Cria o iframe e o botão de som
    const iframeHTML = `
        <iframe
            src="https://www.youtube.com/embed/BWoW-6frVU4?autoplay=1&mute=${muteParam}&controls=0&modestbranding=1&rel=0&loop=1&playlist=BWoW-6frVU4&enablejsapi=1"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
            loading="lazy">
        </iframe>
        <button id="videoSoundToggle" onclick="toggleVideoSound()" aria-label="Alternar som do vídeo">${soundIcon}</button>
    `;

    // 5. Insere o novo conteúdo
    yt.insertAdjacentHTML('beforeend', iframeHTML);
    
    // 6. Exibe o botão de som
    const soundButton = document.getElementById("videoSoundToggle");
    if (soundButton) soundButton.style.display = 'flex';
}

function toggleVideoSound() {
    // O clique deve INVERTER o estado atual (videoMuted).
    // Se estava mudo, queremos unmute = true. Se estava com som, queremos unmute = false.
    loadVideo(videoMuted); 
}


document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
    initCarousel();
    initImageModal();
    
    // 1. CHAMA loadVideo NO INÍCIO para garantir Autoplay Mudo (videoMuted = true)
    // Passamos 'false' para unmute, forçando o estado inicial de Mudo (mute=1) no iframe.
    loadVideo(false); 

    // Funções modais e de formulário
    const openRegisterModal = document.getElementById('openRegisterModal');
    const registerModal = document.getElementById('registerModal');
    const closeModalBtn = registerModal ? registerModal.querySelector('.modal-close-btn') : null;

    if (openRegisterModal && registerModal) {
        openRegisterModal.onclick = () => registerModal.classList.add('is-open');
        
        if (closeModalBtn) {
            closeModalBtn.onclick = () => registerModal.classList.remove('is-open');
        }

        registerModal.onclick = e => {
            if (e.target === registerModal) {
                registerModal.classList.remove('is-open');
            }
        };
    }
});

// A função toggleVideoSound deve ser globalmente acessível
window.toggleVideoSound = toggleVideoSound;