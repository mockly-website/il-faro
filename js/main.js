(() => {
  "use strict";

  const preloader = document.getElementById("preloader");
  const start = performance.now();

  function hidePreloader() {
    const wait = Math.max(0, 700 - (performance.now() - start));
    setTimeout(() => {
      preloader.classList.add("done");
      setTimeout(() => preloader.remove(), 800);
    }, wait);
  }
  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 2600);

  const header = document.getElementById("header");
  const onScrollHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  const burger = document.getElementById("burger");
  const menuMobile = document.getElementById("menuMobile");
  function toggleMenu(open) {
    const willOpen = open ?? !menuMobile.classList.contains("open");
    menuMobile.classList.toggle("open", willOpen);
    burger.classList.toggle("open", willOpen);
    header.classList.toggle("menu-open", willOpen);
    burger.setAttribute("aria-expanded", String(willOpen));
    burger.setAttribute("aria-label", willOpen ? "Chiudi il menu" : "Apri il menu");
    document.body.style.overflow = willOpen ? "hidden" : "";
  }
  burger.addEventListener("click", () => toggleMenu());
  menuMobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 820 && menuMobile.classList.contains("open")) toggleMenu(false);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--d", `${Math.min(i % 4, 3) * 0.08}s`);
    revealObserver.observe(el);
  });

  const progressBar = document.getElementById("progressBar");

  function onScrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  }
  onScrollProgress();
  window.addEventListener("scroll", onScrollProgress, { passive: true });

  const fab = document.getElementById("fab");
  if (fab) {
    const onScrollFab = () => fab.classList.toggle("show", window.scrollY > 320);
    onScrollFab();
    window.addEventListener("scroll", onScrollFab, { passive: true });
  }

  const lightbox = document.createElement("figure");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-label", "Immagine ingrandita");
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Chiudi">&times;</button>
    <img alt="">
    <figcaption></figcaption>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");
  const lightboxCap = lightbox.querySelector("figcaption");

  function openLightbox(figure) {
    const img = figure.querySelector("img");
    const cap = figure.querySelector("figcaption");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = cap ? cap.textContent.replace(/\s+/g, " ").trim() : "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  document.querySelectorAll(".gallery-item").forEach((figure) => {
    figure.addEventListener("click", () => openLightbox(figure));
  });
  lightbox.addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-close").addEventListener("click", (e) => {
    e.stopPropagation();
    closeLightbox();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
})();
