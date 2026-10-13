const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const progressBar = document.querySelector(".scroll-progress span");

function moveBefore(containerSelector, movingSelector, anchorSelector) {
  const container = document.querySelector(containerSelector);
  const moving = container?.querySelector(movingSelector);
  const anchor = container?.querySelector(anchorSelector);
  if (moving && anchor) container.insertBefore(moving, anchor);
}

moveBefore("#work", "#thalia", "#stayrelive");
moveBefore(".case-studies", "#case-thalia", "#case-stayrelive");

document.documentElement.classList.add("motion-ready");

const revealTargets = document.querySelectorAll(
  ".proof-item, .project-block, .case-heading, .case-facts, .case-content > *, .approach-list > div, .about-mark, .about-copy, .contact-inner",
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal", `reveal-delay-${index % 4}`);
    revealObserver.observe(element);
  });

  const caseTargets = [
    [document.querySelector("#case-thalia"), document.querySelector('[data-case-link][href="#thalia"]')],
    [document.querySelector("#case-stayrelive"), document.querySelector('[data-case-link][href="#stayrelive"]')],
    [document.querySelector("#case-kicks"), document.querySelector('[data-case-link][href="#freelance"]')],
  ];
  const caseObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      caseTargets.forEach(([target, link]) => {
        if (!link) return;
        const isCurrent = target === entry.target;
        link.classList.toggle("is-current", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -55% 0px", threshold: 0 });

  caseTargets.forEach(([target]) => {
    if (target) caseObserver.observe(target);
  });
}

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

function revealPassedContent() {
  revealTargets.forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight) {
      element.classList.add("is-visible");
    }
  });
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("scroll", revealPassedContent, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
    revealPassedContent();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => requestAnimationFrame(revealPassedContent));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelector("#year").textContent = new Date().getFullYear();