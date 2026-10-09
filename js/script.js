// =========================
// MENÚ MÓVIL
// =========================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

const links = document.querySelectorAll(".nav-links a");

links.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


// =========================
// NAVBAR AL HACER SCROLL
// =========================

const header = document.getElementById("header");

const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });


// =========================
// FALLBACK DE FOTOS EN GALERÍA
// (mientras no haya fotos reales del local, se muestra "Próximamente")
// =========================

document.querySelectorAll(".polaroid-photo img").forEach((img) => {
    img.addEventListener("error", () => {
        img.classList.add("broken");
    });
});


// =========================
// ANIMACIONES AL HACER SCROLL
// =========================

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll("[data-reveal]");

if (prefersReducedMotion) {

    revealEls.forEach((el) => el.classList.add("is-visible"));

} else {

    // stagger: los elementos de un mismo contenedor aparecen en cadena
    const groups = new Map();

    revealEls.forEach((el) => {
        const parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
    });

    groups.forEach((group) => {
        group.forEach((el, i) => {
            el.style.transitionDelay = `${(i % 6) * 90}ms`;
        });
    });

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
}


// =========================
// CONTADORES DE CIFRAS
// =========================

const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1100;
    const start = performance.now();

    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;

        if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
};

const counters = document.querySelectorAll(".stat-number");

if (prefersReducedMotion) {

    counters.forEach((el) => {
        el.textContent = el.dataset.count + (el.dataset.suffix || "");
    });

} else {

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    counters.forEach((el) => counterObserver.observe(el));
}
