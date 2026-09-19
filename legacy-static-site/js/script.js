function initFooterYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function initBurgerMenu() {
  const burgerBtn = document.getElementById("burgerBtn");
  const mainNav = document.querySelector(".main-nav");
  if (!burgerBtn || !mainNav) return;

  burgerBtn.addEventListener("click", () => mainNav.classList.toggle("open"));
  mainNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mainNav.classList.remove("open"));
  });
}

function initFooterCallout() {
  const footer = document.getElementById("footer");
  const footerCallout = document.getElementById("footerCallout");
  const footerCalloutClose = document.getElementById("footerCalloutClose");
  if (!footer || !footerCallout) return;

  let calloutShown = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !calloutShown) {
          calloutShown = true;
          footerCallout.classList.add("show");
          setTimeout(() => footerCallout.classList.remove("show"), 6000);
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(footer);

  if (footerCalloutClose) {
    footerCalloutClose.addEventListener("click", () => {
      footerCallout.classList.remove("show");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initFooterYear();
  initBurgerMenu();
  initFooterCallout();
});
