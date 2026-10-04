document.addEventListener("DOMContentLoaded", () => {
  /*
   * OWNER WHATSAPP NUMBER
   * ----------------------
   * Replace the value below with the owner's WhatsApp number.
   * Use country code + number, without +, spaces or brackets.
   *
   * Example for India:
   * const OWNER_WHATSAPP = "0000000000";
   */
  const OWNER_WHATSAPP = "0000000000";

  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  const updateHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Reveal animations */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("show"));
  }

  /* Product filtering */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product-card");
  const emptyState = document.getElementById("emptyState");

  const filterProducts = (filter) => {
    let visible = 0;

    products.forEach(product => {
      const matches =
        filter === "all" ||
        product.dataset.category === filter;

      product.hidden = !matches;

      if (matches) {
        visible++;
        requestAnimationFrame(() => {
          product.classList.add("show");
        });
      }
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  };

  if (filterButtons.length) {
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        filterProducts(button.dataset.filter);
      });
    });

    const category =
      new URLSearchParams(window.location.search).get("category");

    const validCategories = [
      "mobile",
      "tv",
      "refrigerator",
      "accessories"
    ];

    if (category && validCategories.includes(category)) {
      const matchingButton =
        document.querySelector(
          `.filter-btn[data-filter="${category}"]`
        );

      if (matchingButton) {
        matchingButton.click();
      }
    }
  }

  /*
   * WhatsApp enquiry
   * ----------------
   * Product name and price are read directly from the product card.
   * encodeURIComponent() safely formats the message for WhatsApp.
   */
  document.querySelectorAll("[data-enquiry='true']").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      const card = button.closest(".product-card");

      if (!card) return;

      const productName =
        card.querySelector("h3")?.textContent.trim() || "Product";

      const price =
        card.querySelector(".product-bottom strong")?.textContent.trim() || "";

      const category =
        card.querySelector(".product-category")?.textContent.trim() || "";

      const message =
        `Hello Voltix!%0A%0A` +
        `I am interested in this product:%0A` +
        `Product: ${encodeURIComponent(productName)}%0A` +
        `Category: ${encodeURIComponent(category)}%0A` +
        `Price: ${encodeURIComponent(price)}%0A%0A` +
        `Please share more details and availability.`;

      const whatsappURL =
        `https://wa.me/${OWNER_WHATSAPP}?text=${message}`;

      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );
    });
  });
});


/* =========================================================
   VOLTIX HERO BACKGROUND SLIDER
   ========================================================= */

const heroSlides = document.querySelectorAll('.hero-bg-slide');
const heroDots = document.querySelectorAll('.hero-dot');

let currentHeroSlide = 0;
let heroTimer;


/* Show selected slide */

function showHeroSlide(index) {

    if (!heroSlides.length) return;

    heroSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    heroDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    currentHeroSlide = index;
}


/* Next slide */

function nextHeroSlide() {

    currentHeroSlide =
        (currentHeroSlide + 1) % heroSlides.length;

    showHeroSlide(currentHeroSlide);
}


/* Automatic slider */

function startHeroSlider() {

    clearInterval(heroTimer);

    heroTimer = setInterval(() => {
        nextHeroSlide();
    }, 2500);
}


/* Dot click */

heroDots.forEach((dot) => {

    dot.addEventListener('click', () => {

        const slideIndex =
            Number(dot.dataset.slide);

        showHeroSlide(slideIndex);

        startHeroSlider();

    });

});


/* Start */

if (heroSlides.length) {

    showHeroSlide(0);

    startHeroSlider();

}
