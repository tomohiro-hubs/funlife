// ── Mobile menu ──
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
mobileMenuBtn.addEventListener("click", () =>
  mobileMenu.classList.toggle("hidden"),
);
mobileMenu
  .querySelectorAll("a")
  .forEach((l) =>
    l.addEventListener("click", () => mobileMenu.classList.add("hidden")),
  );

// ── Header: transparent → solid on scroll ──
const header = document.getElementById("site-header");
const headerLogo = document.getElementById("header-logo");
const headerNav = document.getElementById("header-nav");
const headerCta = document.getElementById("header-cta");
const menuBtn = document.getElementById("mobile-menu-btn");

function updateHeader() {
  const scrolled = window.scrollY > 80;
  if (scrolled) {
    header.classList.add("bg-white/95", "backdrop-blur-md", "border-border/60");
    header.classList.remove("bg-transparent", "border-transparent");
    headerLogo.classList.add("text-accent");
    headerLogo.classList.remove("text-white");
    const headerLogoImg = document.getElementById("header-logo-img");
    if (headerLogoImg) {
      headerLogoImg.classList.remove("brightness-0", "invert");
    }
    if (headerNav) {
      headerNav.classList.add("text-muted");
      headerNav.classList.remove("text-white/80");
    }
    if (headerCta) {
      headerCta.classList.add("bg-accent", "text-white");
      headerCta.classList.remove("bg-white", "text-accent");
    }
    menuBtn.classList.add("text-ink");
    menuBtn.classList.remove("text-white");
  } else {
    header.classList.remove(
      "bg-white/95",
      "backdrop-blur-md",
      "border-border/60",
    );
    header.classList.add("bg-transparent", "border-transparent");
    headerLogo.classList.remove("text-accent");
    headerLogo.classList.add("text-white");
    const headerLogoImg = document.getElementById("header-logo-img");
    if (headerLogoImg) {
      headerLogoImg.classList.add("brightness-0", "invert");
    }
    if (headerNav) {
      headerNav.classList.remove("text-muted");
      headerNav.classList.add("text-white/80");
    }
    if (headerCta) {
      headerCta.classList.remove("bg-accent", "text-white");
      headerCta.classList.add("bg-white", "text-accent");
    }
    menuBtn.classList.remove("text-ink");
    menuBtn.classList.add("text-white");
  }
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// ── FAQ accordion ──
function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  const answer = item.querySelector(".faq-answer");
  const wasOpen = answer.classList.contains("open");
  document.querySelectorAll(".faq-item").forEach((el) => {
    el.classList.remove("active");
    el.querySelector(".faq-answer").classList.remove("open");
  });
  if (!wasOpen) {
    item.classList.add("active");
    answer.classList.add("open");
  }
}

// ── Floating CTA (show on scroll-down, hide on scroll-up) ──
const floatingCta = document.getElementById("floating-cta");
const floatingBtn = document.getElementById("floating-btn");
let lastScrollY = 0;
window.addEventListener(
  "scroll",
  () => {
    const currentY = window.scrollY;
    const pastFV = currentY > window.innerHeight * 0.6;
    const scrollingDown = currentY > lastScrollY;
    const show = pastFV && scrollingDown;

    // Mobile bar (md:hidden handles visibility via CSS)
    floatingCta.style.transform = show ? "translateY(0)" : "translateY(100%)";
    // PC floating button (hidden md:inline-flex handles visibility via CSS)
    if (floatingBtn && window.innerWidth >= 768) {
      floatingBtn.style.opacity = show ? "1" : "0";
      floatingBtn.style.pointerEvents = show ? "auto" : "none";
      floatingBtn.style.transform = show ? "translateY(0)" : "translateY(20px)";
    }
    lastScrollY = currentY;
  },
  { passive: true },
);

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", function (e) {
    const t = document.querySelector(this.getAttribute("href"));
    if (t) {
      e.preventDefault();
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  });
});

// ── Scroll reveal (Intersection Observer) ──
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Stagger children
        entry.target.querySelectorAll(".reveal-child").forEach((child, i) => {
          setTimeout(() => child.classList.add("visible"), 120 * i);
        });
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// ── Case Studies Manual Slider ──
// 3 cards visible (PC) / 2 (tablet) / 1 (mobile). 1 click = 1 card shift.
// Uses pixel-based calculation for exact alignment.
(function () {
  const track = document.getElementById("case-track");
  const prevBtn = document.getElementById("case-prev");
  const nextBtn = document.getElementById("case-next");
  const current = document.getElementById("case-current");
  const total = document.getElementById("case-total");
  const progress = document.getElementById("case-progress");
  if (!track) return;

  const slides = track.querySelectorAll(".case-slide");
  const totalCount = slides.length;
  let idx = 0;

  function perView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  function maxIdx() {
    return Math.max(0, totalCount - perView());
  }

  function update() {
    idx = Math.max(0, Math.min(idx, maxIdx()));

    // Pixel-based: measure the actual rendered width of one slide (includes padding)
    var slideW = slides[0].getBoundingClientRect().width;
    var shiftPx = idx * slideW;
    track.style.transform = "translateX(-" + shiftPx + "px)";

    // Counter
    current.textContent = idx + 1;
    total.textContent = maxIdx() + 1;
    // Buttons
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx >= maxIdx();
    // Progress bar
    var progressPct = maxIdx() === 0 ? 100 : (idx / maxIdx()) * 100;
    progress.style.width = Math.max(progressPct, 5) + "%";
  }

  prevBtn.addEventListener("click", () => {
    idx--;
    update();
  });
  nextBtn.addEventListener("click", () => {
    idx++;
    update();
  });

  // Touch / swipe support
  let startX = 0,
    startY = 0,
    isDragging = false;
  const viewport = track.parentElement;

  viewport.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    },
    { passive: true },
  );

  viewport.addEventListener(
    "touchend",
    (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = e.changedTouches[0].clientX - startX;
      const diffY = e.changedTouches[0].clientY - startY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
          idx++;
        } else {
          idx--;
        }
        update();
      }
    },
    { passive: true },
  );

  // Recalculate on resize (debounced)
  let resizeTimer;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => update(), 100);
    },
    { passive: true },
  );

  update();
})();

// ── "3 Reasons" Auto-slide (mobile only) ──
(function () {
  const slider = document.getElementById("reasons-slider");
  const dotsWrap = document.getElementById("reasons-dots");
  if (!slider || !dotsWrap) return;

  const items = slider.querySelectorAll(".swipe-item");
  const dots = dotsWrap.querySelectorAll(".dot");
  const total = items.length;
  let current = 0;
  let autoTimer = null;

  function goTo(idx) {
    current = idx;
    // scroll-snap handles alignment; we just scrollLeft to the right item
    const itemW = items[0].offsetWidth + 16; // width + gap
    slider.scrollTo({ left: itemW * current, behavior: "smooth" });
    // Update dots
    dots.forEach((d, i) => d.classList.toggle("on", i === current));
  }

  function next() {
    goTo((current + 1) % total);
  }

  function startAuto() {
    stopAuto();
    // Only auto-slide on mobile
    if (window.innerWidth >= 768) return;
    autoTimer = setInterval(next, 3500);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Pause on touch, resume after
  slider.addEventListener("touchstart", stopAuto, { passive: true });
  slider.addEventListener(
    "touchend",
    () => {
      // Sync current index from scroll position
      const itemW = items[0].offsetWidth + 16;
      current = Math.round(slider.scrollLeft / itemW);
      dots.forEach((d, i) => d.classList.toggle("on", i === current));
      setTimeout(startAuto, 4000);
    },
    { passive: true },
  );

  // Dot click
  dots.forEach((dot, i) => {
    dot.style.cursor = "pointer";
    dot.addEventListener("click", () => {
      stopAuto();
      goTo(i);
      setTimeout(startAuto, 4000);
    });
  });

  // Re-evaluate on resize
  window.addEventListener(
    "resize",
    () => {
      stopAuto();
      startAuto();
    },
    { passive: true },
  );

  startAuto();
})();

// ── "6 Steps" Auto-slide + manual (mobile only) ──
(function () {
  const slider = document.getElementById("steps-slider");
  const dotsWrap = document.getElementById("steps-dots");
  if (!slider || !dotsWrap) return;

  const items = slider.querySelectorAll(".step-item");
  const dots = dotsWrap.querySelectorAll(".dot");
  const total = items.length;
  let current = 0;
  let autoTimer = null;

  function getItemWidth() {
    // step-item has no gap in CSS, width includes padding
    return items[0].offsetWidth;
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    slider.scrollTo({
      left: getItemWidth() * current,
      behavior: "smooth",
    });
    dots.forEach((d, i) => d.classList.toggle("on", i === current));
  }

  function next() {
    goTo(current + 1);
  }

  function startAuto() {
    stopAuto();
    if (window.innerWidth >= 768) return;
    autoTimer = setInterval(next, 3000);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Touch: pause auto, sync index, resume
  slider.addEventListener("touchstart", stopAuto, { passive: true });
  slider.addEventListener(
    "touchend",
    () => {
      const w = getItemWidth();
      current = Math.round(slider.scrollLeft / w);
      dots.forEach((d, i) => d.classList.toggle("on", i === current));
      setTimeout(startAuto, 4000);
    },
    { passive: true },
  );

  // Dot click
  dots.forEach((dot, i) => {
    dot.style.cursor = "pointer";
    dot.addEventListener("click", () => {
      stopAuto();
      goTo(i);
      setTimeout(startAuto, 4000);
    });
  });

  window.addEventListener(
    "resize",
    () => {
      stopAuto();
      startAuto();
    },
    { passive: true },
  );

  startAuto();
})();

// ── Pricing Slider: auto + manual arrows + swipe (mobile only) ──
(function () {
  var track = document.getElementById("pricing-track");
  var prevBtn = document.getElementById("pricing-prev");
  var nextBtn = document.getElementById("pricing-next");
  var counter = document.getElementById("pricing-current");
  var totalEl = document.getElementById("pricing-total");
  var dotsWrap = document.getElementById("pricing-dots");
  if (!track || !prevBtn) return;

  var slides = track.querySelectorAll(".pricing-slide");
  var dots = dotsWrap ? dotsWrap.querySelectorAll(".dot") : [];
  var total = slides.length;
  var idx = 0;
  var autoTimer = null;

  function update() {
    idx = Math.max(0, Math.min(idx, total - 1));
    var w = slides[0].getBoundingClientRect().width;
    var vpW = track.parentElement.getBoundingClientRect().width;
    var targetTranslate = idx * w - (vpW - w) / 2;
    var maxTranslate = total * w - vpW;
    var translateX = Math.max(0, Math.min(targetTranslate, maxTranslate));

    track.style.transform = "translateX(-" + translateX + "px)";
    if (counter) counter.textContent = idx + 1;
    if (totalEl) totalEl.textContent = total;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx >= total - 1;
    dots.forEach(function (d, i) {
      d.classList.toggle("on", i === idx);
    });
  }

  function next() {
    idx = (idx + 1) % total;
    update();
  }

  function startAuto() {
    stopAuto();
    if (window.innerWidth >= 768) return;
    autoTimer = setInterval(next, 4000);
  }
  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Arrow buttons
  prevBtn.addEventListener("click", function () {
    stopAuto();
    idx--;
    update();
    setTimeout(startAuto, 5000);
  });
  nextBtn.addEventListener("click", function () {
    stopAuto();
    idx++;
    update();
    setTimeout(startAuto, 5000);
  });

  // Touch / swipe
  var startX = 0,
    startY = 0,
    dragging = false;
  var vp = track.parentElement;
  vp.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragging = true;
      stopAuto();
    },
    { passive: true },
  );
  vp.addEventListener(
    "touchend",
    function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) idx++;
        else idx--;
        update();
      }
      setTimeout(startAuto, 5000);
    },
    { passive: true },
  );

  // Dot click
  dots.forEach(function (dot, i) {
    dot.style.cursor = "pointer";
    dot.addEventListener("click", function () {
      stopAuto();
      idx = i;
      update();
      setTimeout(startAuto, 5000);
    });
  });

  window.addEventListener(
    "resize",
    function () {
      stopAuto();
      update();
      startAuto();
    },
    { passive: true },
  );
  update();
  startAuto();
})();
