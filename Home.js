const _hero = document.querySelector(".hero");
if (_hero) {
  requestAnimationFrame(() => {
    setTimeout(() => _hero.classList.add("loaded"), 60);
  });
}

const _heroImagesSection = document.querySelector(".hero-images");
if (_heroImagesSection) {
  requestAnimationFrame(() => {
    setTimeout(() => _heroImagesSection.classList.add("loaded"), 60);
  });
}

(function initTrustLogosMarquee() {
  const row = document.querySelector(".trust-logos-row");
  if (!row) return;
  if (row.dataset.marqueeInitialized) return;

  const originalChildren = Array.from(row.children);
  const track = document.createElement("div");
  track.className = "marquee-track";

  originalChildren.forEach((c) => track.appendChild(c));

  row.innerHTML = "";
  row.appendChild(track);

  function appendOneCopy() {
    originalChildren.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }

  let origSetWidth = track.scrollWidth;

  let safety = 0;
  while (track.scrollWidth < row.clientWidth + origSetWidth && safety < 12) {
    appendOneCopy();
    safety += 1;
  }

  origSetWidth = origSetWidth || track.scrollWidth / 2 || 0;
  const origWidth = origSetWidth;

  row.dataset.marqueeInitialized = "1";
  row.classList.add("marquee");
  track.style.setProperty("--marquee-distance", origWidth + "px");

  function setDuration() {
    const distance = origWidth;
    const duration = Math.max(6, Math.round(distance / 90));
    track.style.setProperty("--marquee-duration", duration + "s");
  }

  setDuration();

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const items = Array.from(track.children).slice(
        0,
        originalChildren.length
      );
      track.innerHTML = "";
      items.forEach((it) => track.appendChild(it));
      track.style.setProperty("--marquee-distance", origWidth + "px");
      setDuration();
    }, 220);
  });
})();

(function attachHeroScrollShrink() {
  if (!_hero) return;
  let ticking = false;

  const heroImages =
    document.querySelector(".hero-images") ||
    (_hero && _hero.querySelector(".hero-images"));
  let centerCard = heroImages
    ? heroImages.querySelector(".image-card.img2")
    : null;

  function updateScale() {
    const rect = _hero.getBoundingClientRect();
    const scrolled = Math.max(0, -rect.top);

    const START = 0;
    const RANGE = 240;
    const rawProgress = (scrolled - START) / RANGE;
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    const MIN_SCALE = 0.66;
    const scale = 1 - progress * (1 - MIN_SCALE);

    _hero.style.setProperty("--hero-scale", scale.toFixed(3));

    const MAX_COVER = 160;
    const cover = progress * MAX_COVER;
    _hero.style.setProperty("--hero-cover", `-${cover.toFixed(2)}px`);
    if (heroImages)
      heroImages.style.setProperty("--hero-cover", `-${cover.toFixed(2)}px`);

    const SIDE_SCALE = 0.5;
    const coverSide = cover * SIDE_SCALE;
    _hero.style.setProperty("--hero-cover-side", `-${coverSide.toFixed(2)}px`);
    if (heroImages)
      heroImages.style.setProperty(
        "--hero-cover-side",
        `-${coverSide.toFixed(2)}px`
      );
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScale);
      ticking = true;
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

document.addEventListener("click", (e) => {
  if (
    sideMenu.classList.contains("open") &&
    !sideMenu.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    closeMenu();
  }
});

// ======= Count-up on scroll for stats section =======
const statsSection = document.querySelector(".stats-image-section");
if (statsSection) {
  const statNumbers = document.querySelectorAll(".stat-number");
  let countUpDone = false;

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
  }

  function countUp(el) {
    const target = +el.getAttribute("data-target");
    const countEl = el.querySelector(".count");
    let current = 0;
    const stepTime = 20;
    const increment = Math.ceil(target / 100);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        countEl.textContent = target;
        clearInterval(timer);
      } else {
        countEl.textContent = current;
      }
    }, stepTime);
  }

  function runCountUp() {
    if (!countUpDone && isInViewport(statsSection)) {
      statNumbers.forEach((el) => countUp(el));
      countUpDone = true;
      window.removeEventListener("scroll", runCountUp);
    }
  }

  window.addEventListener("scroll", runCountUp);
  runCountUp();
}

/* ============================================================
   SERVICES ACCORDION LOGIC
   One open at a time — smooth height — single button + → ×
============================================================ */
document.querySelectorAll(".service-item").forEach((item) => {
  const btn = item.querySelector(".accordion-btn");
  const header = item.querySelector(".service-header");
  const content = item.querySelector(".service-content");

  // Initialize open state if present in HTML
  if (item.classList.contains("open")) {
    content.style.maxHeight = content.scrollHeight + 30 + "px";
  }

  function closeAll() {
    document.querySelectorAll(".service-item").forEach((s) => {
      s.classList.remove("open");
      s.classList.add("collapsed");
      const inner = s.querySelector(".service-content");
      if (inner) inner.style.maxHeight = "0px";
    });
  }

  function toggle() {
    const isOpen = item.classList.contains("open");
    closeAll();
    if (!isOpen) {
      item.classList.remove("collapsed");
      item.classList.add("open");
      content.style.maxHeight = content.scrollHeight + 30 + "px";
    }
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  header.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    toggle();
  });
});

/* ============================================================
   FAQ ACCORDION LOGIC
   One open at a time — smooth height — single button + → ×
============================================================ */
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-header");
  const header = item.querySelector(".faq-header");
  const content = item.querySelector(".faq-content");

  function closeAll() {
    document.querySelectorAll(".faq-item").forEach((s) => {
      s.classList.remove("open");
      s.classList.add("collapsed");
      const inner = s.querySelector(".faq-content");
      if (inner) inner.style.maxHeight = "0px";
    });
  }

  function toggle() {
    const isOpen = item.classList.contains("open");
    closeAll();

    if (!isOpen) {
      item.classList.remove("collapsed");
      item.classList.add("open");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  header.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    toggle();
  });
});

/* ============================================================
   SCROLL REVEAL ANIMATION
============================================================ */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ============================================================
   BACK TO TOP BUTTON
============================================================ */
(function createBackToTop() {
  // Create button element
  const btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.setAttribute("aria-label", "Back to Top");
  document.body.appendChild(btn);

  // Scroll logic
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  // Click logic
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
})();

// Hamburger Menu Logic
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinksItems = document.querySelectorAll(".nav-links li a");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      // Toggle icon between bars and times (X)
      const icon = hamburger.querySelector("i");
      if (icon) {
        if (navLinks.classList.contains("active")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-times");
        } else {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });

    // Close menu when a link is clicked
    navLinksItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        // Check if this is the dropdown toggle
        const parentLi = item.parentElement;
        const isDropdownToggle = parentLi.classList.contains("dropdown");

        // If it's the dropdown toggle and we are on mobile, DO NOT close the menu
        const hamburger = document.querySelector(".hamburger");
        const isMobile =
          hamburger && getComputedStyle(hamburger).display !== "none";

        if (isDropdownToggle && isMobile) {
          // Do nothing here, let the other event listener handle the toggle
          return;
        }

        // Otherwise, close the menu as usual
        navLinks.classList.remove("active");
        const icon = hamburger.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      });
    });
  }
});

// Mobile Dropdown Toggle
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector(".dropdown");

  if (dropdown) {
    const dropdownLink = dropdown.querySelector("a");

    dropdownLink.addEventListener("click", (e) => {
      // Only activate on mobile (when hamburger is visible)
      const hamburger = document.querySelector(".hamburger");
      if (hamburger && getComputedStyle(hamburger).display !== "none") {
        e.preventDefault();
        dropdown.classList.toggle("active");
      }
    });
  }
});

// Lightbox Functionality
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lightboxImg = document.getElementById("lightbox-img");
  const captionText = document.getElementById("caption");
  const closeBtn = document.querySelector(".close-lightbox");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  // Select all images in gallery grids and masonry items
  // Convert NodeList to Array for easier indexing
  const images = Array.from(
    document.querySelectorAll(".gallery-item img, .masonry-item img")
  );
  let currentIndex = 0;

  function showImage(index) {
    if (index >= images.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = images.length - 1;
    } else {
      currentIndex = index;
    }

    const img = images[currentIndex];
    lightboxImg.src = img.src;
    captionText.innerHTML = img.alt || "";
  }

  images.forEach((img, index) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      lightbox.style.display = "block";
      currentIndex = index;
      showImage(currentIndex);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      lightbox.style.display = "none";
      document.body.style.overflow = ""; // Restore scrolling
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent closing lightbox
      showImage(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent closing lightbox
      showImage(currentIndex + 1);
    });
  }

  // Close on outside click
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
      document.body.style.overflow = ""; // Restore scrolling
    }
  });

  // Keyboard Navigation
  document.addEventListener("keydown", function (e) {
    if (lightbox.style.display === "block") {
      if (e.key === "Escape") {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
      } else if (e.key === "ArrowLeft") {
        showImage(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        showImage(currentIndex + 1);
      }
    }
  });
});

(function highlightActiveService() {
  const currentPath = window.location.pathname;
  const servicePages = [
    "photography.html",
    "videography.html",
    "creative.html",
    "digital-marketing.html",
    "technology.html",
  ];

  const isServicePage = servicePages.some((page) => currentPath.includes(page));

  if (isServicePage) {
    const servicesLink = document.querySelector(".dropdown > a");
    if (servicesLink) {
      servicesLink.classList.add("active");
    }
  }
})();

(function updateCopyrightYear() {
  const footerPara = document.querySelector(".footer-bottom p");
  if (footerPara) {
    const currentYear = new Date().getFullYear();
    footerPara.innerHTML = `&copy; ${currentYear} Akili Studios. All rights reserved.`;
  }
})();
