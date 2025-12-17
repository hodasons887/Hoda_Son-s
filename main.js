const ready = (fn) => {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};

ready(() => {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });

  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id], header[id]");
  const backToTop = document.getElementById("backToTop");
  const contactForm = document.getElementById("contactForm");
  const newsletterBtn = document.getElementById("newsletterBtn");

  const setNavState = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 140;
      if (window.scrollY >= top) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href").slice(1) === current);
    });
  };

  const smoothScroll = (e) => {
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const navCollapse = document.querySelector(".navbar-collapse");
      if (navCollapse?.classList.contains("show")) {
        bootstrap.Collapse.getInstance(navCollapse).hide();
      }
    }
  };

  navLinks.forEach((link) => link.addEventListener("click", smoothScroll));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".service-card, .portfolio-card, .testimonial-card, .stat-card, .panel, .card-metric, .hero-image-content, .tech-card, .feature-card, .partner-logo, .accordion-item").forEach((el) => observer.observe(el));

  const animateCounters = () => {
    document.querySelectorAll(".stat-number").forEach((el) => {
      const target = parseInt(el.dataset.target || "0", 10);
      let start = 0;
      const duration = 1600;
      const step = (ts) => {
        if (!el._start) el._start = ts;
        const progress = Math.min((ts - el._start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased) + (el.textContent.includes("%") ? "%" : el.textContent.includes("+") ? "+" : "");
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  const statsSection = document.querySelector(".stats");
  if (statsSection) counterObserver.observe(statsSection);

  window.addEventListener("scroll", () => {
    setNavState();
    if (window.scrollY > 240) {
      backToTop?.classList.add("show");
    } else {
      backToTop?.classList.remove("show");
    }
  });

  setNavState();

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you! We will get back to you within one business day.");
    contactForm.reset();
  });

  newsletterBtn?.addEventListener("click", () => {
    const input = newsletterBtn.previousElementSibling;
    const email = input?.value || "";
    if (email.includes("@")) {
      alert("Subscribed! We'll send you monthly insights.");
      input.value = "";
    } else {
      alert("Please enter a valid email.");
    }
  });
});

   // Add click handlers for contact buttons
    document.querySelectorAll('.contact-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = btn.closest('.leadership-card').querySelector('h4').textContent;
        alert(`Contact form for ${name} would open here`);
      });
    });

    // Add subtle interaction feedback
    document.querySelectorAll('.leadership-card').forEach(card => {
      card.addEventListener('click', () => {
        card.style.transform = 'translateY(-8px) scale(0.98)';
        setTimeout(() => {
          card.style.transform = '';
        }, 200);
      });
    });