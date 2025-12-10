/* ============================================================
   SCRIPT.JS — Código atualizado e otimizado
   - Implementação real de Back-end com Apps Script (GET/POST)
============================================================ */

/* ============================================================
   1) TEMA ESCURO/CLARO
============================================================ */
function initTheme() {
    const toggle = document.getElementById("themeToggle");

    if (!toggle) return;

    // Carrega o tema salvo
    const saved = localStorage.getItem("theme");
    const currentTheme = saved || document.documentElement.getAttribute("data-theme") || "dark";

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
            threshold: 0.15,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    els.forEach((el) => observer.observe(el));
}

/* ============================================================
   3) CARROSSEL — profissional, suave, responsivo
============================================================ */
function initCarousel() {
    const track = document.querySelector(".carousel-track");
    if (!track) return;

    const prev = document.querySelector(".carousel-btn.prev");
    const next = document.querySelector(".carousel-btn.next");
    const slides = [...track.children];

    let index = 0;

    function update() {
        const container = track.parentElement;
        const slideWidth = slides[0].offsetWidth;
        const gap = 20; 

        const scrollAmount = (slideWidth + gap) * index;
        
        container.scroll({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    next.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        update();
    });

    prev.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
    });

    // Auto-play (opcional)
    setInterval(() => {
        index = (index + 1) % slides.length;
        update();
    }, 4500);

    window.addEventListener("resize", update);
    setTimeout(update, 100); 
}

/* ============================================================
   4) HEADER INTELIGENTE — evita quebra do botão WhatsApp
============================================================ */
function initSmartHeader() {
    const header = document.querySelector(".header");
    const actions = document.querySelector(".header-actions");
    const brand = document.querySelector(".brand");

    if (!header || !actions || !brand) return;

    function checkOverflow() {
        const W = header.clientWidth;
        const brandW = brand.clientWidth;
        const actionsW = actions.clientWidth;

        if (brandW + actionsW > W * 0.85) { 
            header.classList.add("is-stack");
        } else {
            header.classList.remove("is-stack");
        }
    }

    window.addEventListener("resize", checkOverflow);
    setTimeout(checkOverflow, 100);
}


/* ============================================================
   FUNÇÕES DE RENDERIZAÇÃO E CARREGAMENTO DE DEPOIMENTOS
============================================================ */

function renderStars(rating) {
    // Retorna 5 estrelas sólidas. O CSS do .stars usa o atributo data-rating para colorir de ouro
    return '★'.repeat(5); 
}

function renderReview(review) {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    const starsHtml = renderStars(review.rating); 

    const reviewHtml = `
        <div class="review visible">
            <p>"${review.comment}"</p>
            <div class="stars" data-rating="${review.rating}">${starsHtml}</div>
            <span class="author">— ${review.name}</span>
        </div>
    `;

    // Adiciona o depoimento no início do contêiner (mais novos primeiro)
    container.insertAdjacentHTML('afterbegin', reviewHtml);
    
    // Aciona a animação de reveal
    const newReviewEl = container.firstElementChild;
    if (newReviewEl) {
        newReviewEl.classList.add('visible');
    }
}

// NOVO: Função para carregar depoimentos do Apps Script (GET)
async function loadReviewsFromBackend() {
    const scriptIdInput = document.getElementById("scriptIdReview");
    const container = document.getElementById('reviewsContainer');
    
    if (!scriptIdInput || scriptIdInput.value.includes('COLE_AQUI')) {
        container.innerHTML = `<p style="color:red; text-align:center;">⚠️ **ATENÇÃO:** Configure a URL do Apps Script no index.html para carregar os depoimentos.</p>`;
        return; 
    }
    
    const SCRIPT_URL = scriptIdInput.value;
    container.innerHTML = '<p style="text-align:center; opacity:0.7;">Carregando depoimentos...</p>';

    try {
        const response = await fetch(SCRIPT_URL, { method: 'GET' });
        
        const text = await response.text(); 
        
        let reviews;
        try {
            reviews = JSON.parse(text);
        } catch (e) {
            console.error("Erro ao parsear JSON. Resposta do Apps Script:", text);
            container.innerHTML = `<p style="color:red; text-align:center;">Erro na comunicação com o servidor de depoimentos. Verifique a implantação do Apps Script.</p>`;
            return;
        }

        container.innerHTML = '';
        if (reviews.length === 0) {
            container.innerHTML = `<p style="text-align:center; opacity:0.7;">Seja o primeiro a deixar um depoimento!</p>`;
            return;
        }

        reviews.forEach(review => renderReview(review));
        
    } catch (error) {
        console.error('Erro ao carregar depoimentos do Apps Script:', error);
        container.innerHTML = `<p style="color:red; text-align:center;">Erro ao carregar depoimentos. Verifique a conexão.</p>`;
    }
}


/* ============================================================
   5) FORMULÁRIOS — Envio para Apps Script (POST)
============================================================ */

const SCRIPT_ID_PLACEHOLDER = "AKfycbxZNMFb1irqYJeAguhDGvQAyY43DyB2YmjWFBGrQ9la9uT4kmkguJxPyM6DjjH10PYl";

// Função utilitária para enviar dados via fetch
async function sendFormData(data, formType, statusElement, form) {
    let scriptIdInput;
    if (formType === 'review') {
        scriptIdInput = document.getElementById("scriptIdReview");
    } else if (formType === 'register') {
        scriptIdInput = document.getElementById("scriptIdRegister");
    } else {
        scriptIdInput = document.getElementById("scriptId");
    }

    if (!scriptIdInput || scriptIdInput.value.includes('COLE_AQUI')) {
        statusElement.style.color = 'red';
        statusElement.textContent = `❌ Erro: Por favor, substitua o texto no input hidden do formulário pela URL do Apps Script.`;
        return;
    }
    
    statusElement.textContent = "Enviando...";
    statusElement.style.color = 'var(--accent-1)';

    const SCRIPT_URL = scriptIdInput.value;

    const formData = new URLSearchParams({
        formType: formType,
        ...data
    });

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        statusElement.style.color = 'green';
        if (formType === 'quote') {
            statusElement.textContent = "✅ Cotação enviada com sucesso por e-mail! Entraremos em contato.";
        } else if (formType === 'review') {
            statusElement.textContent = "✅ Depoimento enviado! Você receberá um e-mail de confirmação. Após a aprovação manual, ele aparecerá no site.";
        } else if (formType === 'register') {
            statusElement.textContent = "✅ Cadastro realizado com sucesso! Em breve você receberá novidades.";
            // Fechar o modal após sucesso no cadastro
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

// Inicializa o Formulário de Cotação
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

// Inicializa o Formulário de Depoimentos
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

/* ============================================================
   6) FORMULÁRIO DE CADASTRO (DENTRO DO MODAL)
============================================================ */
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
   7) LÓGICA DO POP-UP MODAL
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

    // Fechar ao clicar fora do modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fechar com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
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
    
    // CARREGA OS DEPOIMENTOS PERMANENTES DO BACKEND
    loadReviewsFromBackend(); 
});
