// Modal
const modal = document.getElementById("registerModal");
const openModalBtn = document.getElementById("openRegisterModal");
const closeModalBtn = modal.querySelector(".modal-close-btn");

openModalBtn.addEventListener("click", () => modal.classList.add("is-open"));
closeModalBtn.addEventListener("click", () => modal.classList.remove("is-open"));
window.addEventListener("click", e => { if(e.target === modal) modal.classList.remove("is-open"); });

// Tema
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
});

// Lazy load do YouTube
const ytLazy = document.getElementById("ytLazy");
ytLazy.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    ytLazy.innerHTML = "";
    ytLazy.appendChild(iframe);
});

// Carousel simples
const track = document.querySelector(".carousel-track");
const nextBtn = document.querySelector(".carousel-btn.next");
const prevBtn = document.querySelector(".carousel-btn.prev");
let scrollAmount = 0;
const scrollStep = 350;

nextBtn.addEventListener("click", () => { track.scrollBy({ left: scrollStep, behavior: "smooth" }); });
prevBtn.addEventListener("click", () => { track.scrollBy({ left: -scrollStep, behavior: "smooth" }); });

// Reviews animados
const reviews = document.querySelectorAll(".review");
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("visible"); });
}, { threshold: 0.2 });

reviews.forEach(r => observer.observe(r));
