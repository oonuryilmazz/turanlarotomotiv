// ==========================================================
// Turanlar Otomotiv - Site etkileşimleri
// ==========================================================

// WhatsApp numarası (başında + olmadan, ülke koduyla): 90 5xx xxx xx xx
const WHATSAPP_NUMBER = "905419263462";

// ---------- Kaydırınca header arka planı ----------
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Mobil menü ----------
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
navToggle.addEventListener("click", () => {
  nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open");
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
  })
);

// ---------- Galeri: eksik fotoğraf için yer tutucu ----------
const figures = [...document.querySelectorAll("#gallery figure")];
figures.forEach((fig) => {
  const img = fig.querySelector("img");
  const markMissing = () => {
    fig.classList.add("is-placeholder");
    img.remove();
  };
  if (img.complete && img.naturalWidth === 0) markMissing();
  else img.addEventListener("error", markMissing);
});

// ---------- Galeri: büyütme (lightbox) ----------
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
let currentIndex = 0;

const availableImages = () =>
  figures.map((f) => f.querySelector("img")).filter(Boolean);

function openLightbox(index) {
  const imgs = availableImages();
  if (!imgs.length) return;
  currentIndex = (index + imgs.length) % imgs.length;
  lightboxImg.src = imgs[currentIndex].src;
  lightboxImg.alt = imgs[currentIndex].alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

figures.forEach((fig) =>
  fig.addEventListener("click", () => {
    const img = fig.querySelector("img");
    if (img) openLightbox(availableImages().indexOf(img));
  })
);

lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox__prev").addEventListener("click", () => openLightbox(currentIndex - 1));
lightbox.querySelector(".lightbox__next").addEventListener("click", () => openLightbox(currentIndex + 1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
  if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
});

// ---------- Hizmet kartı butonu: formda hizmeti seç ----------
const hizmetSelect = document.querySelector('#contactForm select[name="hizmet"]');
document.querySelectorAll(".service__cta").forEach((btn) =>
  btn.addEventListener("click", () => {
    const option = [...hizmetSelect.options].find((o) => o.text === btn.dataset.hizmet);
    if (option) hizmetSelect.value = option.value;
    setTimeout(() => document.querySelector('#contactForm input[name="ad"]').focus({ preventScroll: true }), 600);
  })
);

// ---------- Videolar: ekrana gelince sessiz otomatik oynat ----------
const videos = document.querySelectorAll(".video video");
const videoObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    }),
  { threshold: 0.5 }
);
videos.forEach((video) => {
  videoObserver.observe(video);
  video.addEventListener("play", () => video.parentElement.classList.add("is-playing"));
  video.addEventListener("pause", () => video.parentElement.classList.remove("is-playing"));
  // Biri sesli açılınca diğerleri sessize alınsın
  video.addEventListener("volumechange", () => {
    if (!video.muted) videos.forEach((v) => { if (v !== video) v.muted = true; });
  });
});

// ---------- İletişim formu -> WhatsApp ----------
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const lines = [
    "Merhaba, web sitenizden ulaşıyorum.",
    `Ad Soyad: ${data.get("ad")}`,
    `Telefon: ${data.get("telefon")}`,
    data.get("arac") && `Araç: ${data.get("arac")}`,
    `Hizmet: ${data.get("hizmet")}`,
    data.get("mesaj") && `Mesaj: ${data.get("mesaj")}`,
  ].filter(Boolean);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener");
});

// ---------- Kaydırınca beliren içerik ----------
const revealTargets = document.querySelectorAll(
  ".section__head, .about__image, .about__text, .service, .gallery figure, .video, .contact__info, .contact__form"
);
revealTargets.forEach((el) => el.classList.add("reveal"));
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 }
);
revealTargets.forEach((el) => observer.observe(el));

// ---------- Yıl ----------
document.getElementById("year").textContent = new Date().getFullYear();
