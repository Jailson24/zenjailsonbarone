// -------------------------------
// CARROSSEL AUTOMÁTICO
// -------------------------------
const carousel = document.querySelector(".carousel");
let currentIndex = 0;

function startCarousel() {
    const items = document.querySelectorAll(".carousel-item");
    if (items.length === 0) return;

    currentIndex++;
    if (currentIndex >= items.length) currentIndex = 0;

    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

setInterval(startCarousel, 3500); // 3.5s por slide


// -------------------------------
// BOTÃO FULLSCREEN NO VÍDEO
// -------------------------------
const fullscreenBtn = document.getElementById("fullscreen-btn");
const videoFrame = document.getElementById("video-frame");

if (fullscreenBtn && videoFrame) {
    fullscreenBtn.addEventListener("click", () => {
        if (videoFrame.requestFullscreen) {
            videoFrame.requestFullscreen();
        } else if (videoFrame.webkitRequestFullscreen) {
            videoFrame.webkitRequestFullscreen();
        } else if (videoFrame.msRequestFullscreen) {
            videoFrame.msRequestFullscreen();
        }
    });
}


// -------------------------------
// ANIMAÇÃO DOS DEPOIMENTOS
// -------------------------------
const depoimentos = document.querySelectorAll(".testimonial");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.3 });

depoimentos.forEach(dep => observer.observe(dep));


// -------------------------------
// MENU MOBILE (CASO EXISTA)
// -------------------------------
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
    });
}
