const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
};

setActiveNav(sections[0]?.id);

if ("IntersectionObserver" in window) {
  const visibleSections = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.boundingClientRect.top);
        } else {
          visibleSections.delete(entry.target.id);
        }
      }

      const active = [...visibleSections.entries()].sort((a, b) => a[1] - b[1])[0];
      if (active) {
        setActiveNav(active[0]);
      }
    },
    {
      rootMargin: "-96px 0px -62% 0px",
      threshold: [0, 0.1, 0.35],
    }
  );

  sections.forEach((section) => observer.observe(section));
} else {
  let ticking = false;
  const activateNav = () => {
    let active = sections[0];
    for (const section of sections) {
      const box = section.getBoundingClientRect();
      if (box.top <= 120) {
        active = section;
      }
    }
    setActiveNav(active.id);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(activateNav);
        ticking = true;
      }
    },
    { passive: true }
  );
}
