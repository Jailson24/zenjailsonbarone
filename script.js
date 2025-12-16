/* ============================================================
   SCRIPT.JS — Código Otimizado para GitHub Pages
============================================================ */

/* ============================================================
   1) TEMA ESCURO/CLARO
============================================================ */
function initTheme() {
    const toggle = document.getElementById("themeToggle");

    if (!toggle) return;

    // Carrega o tema salvo ou usa o padrão 'dark'
    const saved = localStorage.getItem("theme");
    const currentTheme = saved || "dark";

    document.documentElement.setAttribute("data-theme", currentTheme);
    toggle.setAttribute("aria-pressed", currentTheme === "light");
    toggle.textContent = currentTheme === "light" ? "☀️" : "🌙";

    // Clique no botão
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
   2) SCROLL REVEAL — efeito suave e inteligente
============================================================ */
function initScrollReveal() {
    // Aplica o efeito reveal tanto em sections (.reveal) quanto nos depoimentos (.review)
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
        {
            threshold: 0.1, // Disparar quando 10% do elemento estiver visível
            rootMargin: "0px 0px -10% 0px"
        }
    );

    els.forEach((el) => observer.observe(el));
}

/* ============================================================
   3) CARROSSEL — responsivo e automático
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
        // Calculamos o deslocamento do slide alvo em relação ao início do track.
        const targetOffsetLeft = targetSlide.offsetLeft; 

        // Rola o container pai (carousel) até o slide desejado com scroll suave.
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
            // Garante que o índice não fique negativo ao decrementar
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

    // Inicialização e responsividade: Recalcula a posição ao redimensionar
    window.addEventListener("resize", update);
    setTimeout(update, 100); 
    startAutoPlay(); 
}

/* ============================================================
   4) HEADER INTELIGENTE
============================================================ */
function initSmartHeader() {
    const header = document.querySelector(".header");
    if (!header) return;

    function checkOverflow() {
        // Usa um ponto de interrupção fixo que demonstrou funcionar bem com o layout flex
        if (window.innerWidth < 650) { 
            header.classList.add("is-stack");
        } else {
            header.classList.remove("is-stack");
        }
    }

    window.addEventListener("resize", checkOverflow);
    setTimeout(checkOverflow, 100);
}


/* ============================================================
   5) FORMULÁRIOS — Envio para Apps Script (POST)
============================================================ */

async function sendFormData(data, formType, statusElement, form) {
    let scriptIdInput;
    if (formType === 'review') {
        scriptIdInput = document.getElementById("scriptIdReview");
    } else if (formType === 'register') {
        scriptIdInput = document.getElementById("scriptIdRegister");
    } else {
        scriptIdInput = document.getElementById("scriptId");
    }

    if (!scriptIdInput || !scriptIdInput.value.startsWith('https://script.google.com/')) {
        statusElement.style.color = 'red';
        statusElement.textContent = `❌ Erro: Configure a URL de implantação do Apps Script no input hidden do formulário.`;
        return;
    }
    
    statusElement.textContent = "Enviando...";
    statusElement.style.color = '#2a86ff'; // Usa a cor do accent

    const SCRIPT_URL = scriptIdInput.value;

    const formData = new URLSearchParams({
        formType: formType,
        ...data
    });

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        statusElement.style.color = 'green';
        if (formType === 'quote') {
            statusElement.textContent = "✅ Cotação enviada! Entraremos em contato o mais breve possível.";
        } else if (formType === 'review') {
            statusElement.textContent = "✅ Depoimento enviado para moderação! Obrigado por sua avaliação.";
        } else if (formType === 'register') {
            statusElement.textContent = "✅ Cadastro realizado com sucesso! Você receberá novidades em breve.";
            // Fecha o modal
            setTimeout(() => {
                document.getElementById('registerModal').classList.remove('is-open');
                document.body.style.overflow = '';
            }, 1500); 
        }
        form.reset();

    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        statusElement.style.color = 'red';
        statusElement.textContent = "❌ Erro ao enviar. Tente novamente ou verifique a conexão.";
    }
}

// Inicialização dos Formulários (Cotação, Review, Cadastro)
function initQuoteForm() {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("quoteFormStatus");
    if (!form || !status) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
            cName: document.getElementById("cName").value.trim(),
            cPhone: document.getElementById("cPhone").value.trim(),
            cMsg: document.getElementById("cMsg").value.trim()
        };
        sendFormData(data, 'quote', status, form);
    });
}

function initReviewForm() {
    const form = document.getElementById("addReviewForm");
    const status = document.getElementById("reviewFormStatus");
    if (!form || !status) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const rating = form.querySelector('input[name="rating"]:checked');
        
        const data = {
            rName: document.getElementById("rName").value.trim(),
            rEmailReview: document.getElementById("rEmailReview").value.trim(), 
            rRating: rating ? rating.value : '0', 
            rComment: document.getElementById("rComment").value.trim()
        };
        sendFormData(data, 'review', status, form);
    });
}

function initRegisterForm() {
    const form = document.getElementById("registerForm");
    const status = document.getElementById("registerFormStatus");
    if (!form || !status) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
            rFName: document.getElementById("rFName").value.trim(),
            rLName: document.getElementById("rLName").value.trim(),
            rDOB: document.getElementById("rDOB").value.trim(), 
            rPhone: document.getElementById("rPhone").value.trim(), 
            rEmail: document.getElementById("rEmail").value.trim()
        };
        sendFormData(data, 'register', status, form);
    });
}


/* ============================================================
   7) LÓGICA DO POP-UP MODAL E VÍDEO
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

function initVideoPlayer() {
    const yt = document.getElementById("ytLazy");
    if (!yt) return;
    
    // Função para carregar e iniciar o iframe
    const loadVideo = (autoplay = false) => {
        yt.innerHTML = `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=${autoplay ? 1 : 0}&controls=1&loop=1&playlist=dQw4w9WgXcQ"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowfullscreen loading="lazy"></iframe>`;
    };

    const thumb = yt.querySelector('.yt-thumb');
    const playIcon = yt.querySelector('.yt-play');

    const handlePlayClick = () => {
        if (thumb) thumb.style.display = 'none';
        if (playIcon) playIcon.style.display = 'none';
        loadVideo(true); 
        yt.removeEventListener('click', handlePlayClick);
    };

    // Inicializa o player para ser clicável
    yt.addEventListener('click', handlePlayClick);
}



/* ============================================================
   MODAL IMAGEM FULLSCREEN (CARROSSEL)
============================================================ */
function initImageModal() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("imageModalImg");
    const closeBtn = document.querySelector(".image-modal-close");

    if (!modal || !modalImg || !closeBtn) return;

    document.querySelectorAll(".carousel-track img").forEach(img => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => {
            modal.classList.add("open");
            modalImg.src = img.src;
            document.body.style.overflow = "hidden";
        });
    });

    const closeModal = () => {
        modal.classList.remove("open");
        modalImg.src = "";
        document.body.style.overflow = "";
    };

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
}


/* ============================================================
   EXECUÇÃO GERAL
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
    initCarousel();
    initImageModal();
    initSmartHeader();
    initQuoteForm(); 
    initReviewForm(); 
    initRegisterForm(); 
    initModal();
    initVideoPlayer();
});