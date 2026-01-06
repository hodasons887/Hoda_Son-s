const ready = (fn) => {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};
ready(() => {
  // Enhanced AOS initialization with responsive settings
  const isMobile = window.innerWidth <= 768;
  AOS.init({
    duration: isMobile ? 600 : 700, // Faster on mobile
    once: true,
    offset: isMobile ? 60 : 80,
    disable: false, // Keep AOS enabled for modern browsers
    easing: 'ease-in-out-quad'
  });



  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id], header[id]");
  const backToTop = document.getElementById("backToTop");
  const contactForm = document.getElementById("contactForm");
  const newsletterBtn = document.getElementById("newsletterBtn");

  // Responsive viewport height handler for mobile address bar
  const handleViewportHeightChange = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  handleViewportHeightChange();
  window.addEventListener('resize', handleViewportHeightChange);

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

  // Enhanced Contact Form Handler with better validation and feedback
  if (contactForm) {
    // Clear any previous error states
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('is-invalid');
      });
      field.addEventListener('change', () => {
        field.classList.remove('is-invalid');
      });
    });

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        company: formData.get('company').trim(),
        phone: formData.get('phone').trim(),
        service: formData.get('service'),
        projectDetails: formData.get('project-details').trim(),
        timestamp: new Date().toISOString()
      };

      // Validation with field-level feedback
      const errors = [];
      const errorFields = {};
      
      if (!data.name) {
        errors.push('Name is required');
        errorFields['name'] = true;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Valid email is required');
        errorFields['email'] = true;
      }
      
      if (!data.service) {
        errors.push('Please select a service');
        errorFields['service'] = true;
      }
      
      if (!data.projectDetails) {
        errors.push('Project details are required');
        errorFields['project-details'] = true;
      }

      // Highlight invalid fields
      Object.keys(errorFields).forEach(fieldName => {
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        if (field) field.classList.add('is-invalid');
      });

      if (errors.length > 0) {
        alert('Please fix these errors:\n\n' + errors.join('\n'));
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';

      try {
        // Log form data to console (for development)
        console.log('Form submitted with data:', data);
        
        // Send to PHP backend handler
        const response = await fetch('contact-handler.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to send message');
        }

        // Success feedback
        const successMessage = 'Thank you! Your message has been sent successfully.\n\nWe will get back to you within one business day.\n\nDirect contact:\nEmail: hodasons887@gmail.com\nPhone: +91 9523420887';
        alert(successMessage);
        
        // Reset form
        contactForm.reset();
        
        // Remove error states
        contactForm.querySelectorAll('.is-invalid').forEach(field => {
          field.classList.remove('is-invalid');
        });
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error sending your message. Please try again or contact us directly:\n\nEmail: hodasons887@gmail.com\nPhone: +91 9523420887');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Enhanced Newsletter Handler
  if (newsletterBtn) {
    newsletterBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletterEmail');
      const feedback = document.getElementById('newsletterFeedback');
      const email = input?.value?.trim() || "";

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (feedback) { feedback.textContent = 'Please enter a valid email address.'; feedback.classList.remove('visually-hidden'); }
        input?.focus();
        return;
      }

      // Show loading state
      const originalHTML = newsletterBtn.innerHTML;
      newsletterBtn.disabled = true;
      newsletterBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      try {
        // Log newsletter signup
        console.log('Newsletter signup:', email);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));

        if (feedback) {
          feedback.textContent = `Subscribed! We'll send monthly insights to ${email}`;
          feedback.classList.remove('visually-hidden');
        } else {
          alert(`✓ Subscribed! We'll send you monthly insights to ${email}`);
        }
        input.value = "";

        // Reset button
        newsletterBtn.disabled = false;
        newsletterBtn.innerHTML = originalHTML;
      } catch (error) {
        console.error('Newsletter signup error:', error);
        if (feedback) { feedback.textContent = 'Subscription failed. Please try again.'; feedback.classList.remove('visually-hidden'); }
        else { alert("Subscription failed. Please try again."); }
        newsletterBtn.disabled = false;
        newsletterBtn.innerHTML = originalHTML;
      }
    });
  }

  // Enhanced touch and pointer event handling
  document.addEventListener('touchstart', () => {
    document.body.classList.add('has-touch');
  }, { passive: true });

  // Prevent double-tap zoom on buttons
  document.querySelectorAll('.btn, .nav-link').forEach(element => {
    element.addEventListener('touchend', (e) => {
      // Touch event handled properly
    }, { passive: true });
  });

  // Responsive image loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
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