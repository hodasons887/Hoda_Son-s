// Advanced Animations for Hoda & Son's Website
// Enhanced scroll-triggered animations, parallax effects, and interactive elements

class AdvancedAnimations {
  constructor() {
    this.init();
  }
  init() {
    this.setupParallax();
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupTypewriterEffect();
    this.setupMagneticButtons();
    this.setupScrollProgress();
    this.setupSmoothEnter();
  }

  // Parallax scrolling effects
  setupParallax() {
    const parallaxElements = document.querySelectorAll('.hero-bg, .hero-image-bg');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(element => {
        const rate = element.classList.contains('hero-bg') ? 0.5 : 0.3;
        element.style.transform = `translateY(${scrolled * rate}px)`;
      });
    });
  }

  // Advanced scroll-triggered animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = index * 80;

          setTimeout(() => {
            element.classList.add('animate-in');
          }, delay);

          // Add stagger effect for child elements
          const children = element.querySelectorAll('.animate-child');
          children.forEach((child, childIndex) => {
            setTimeout(() => {
              child.classList.add('animate-in');
            }, delay + (childIndex * 50));
          });
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.service-card, .tech-card, .feature-card, .portfolio-card, .testimonial-card, .partner-logo, .accordion-item, .stat-card').forEach(el => {
      observer.observe(el);
    });
  }

  // Enhanced hover effects with smooth transitions
  setupHoverEffects() {
    // Service cards 3D tilt effect (disabled on mobile)
    document.querySelectorAll('.service-card').forEach(card => {
      if (window.innerWidth > 768) {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 12;
          const rotateY = (centerX - x) / 12;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(25px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
      }
    });

    // Portfolio cards reveal effect
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const overlay = card.querySelector('.overlay');
      if (overlay) {
        card.addEventListener('mouseenter', () => {
          overlay.style.transform = 'translateY(0)';
          overlay.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
          overlay.style.transform = 'translateY(20px)';
          overlay.style.opacity = '0';
        });
      }
    });

    // Tech cards glow effect
    document.querySelectorAll('.tech-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = `0 20px 50px var(--tech-primary)40`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
      });
    });
  }

  // Smooth element reveal on load
  setupSmoothEnter() {
    document.querySelectorAll('.service-card, .feature-card, .tech-card').forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      setTimeout(() => {
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // Typewriter effect for hero text
  setupTypewriterEffect() {
    const heroText = document.querySelector('.hero-copy h1');
    if (heroText) {
      const originalText = heroText.innerHTML;
      const accentSpan = heroText.querySelector('.accent');

      // Only run if not already animated
      if (!heroText.classList.contains('typewriter-done')) {
        heroText.innerHTML = '';
        heroText.style.minHeight = 'auto';

        let i = 0;
        const typeWriter = () => {
          if (i < originalText.length) {
            const char = originalText.charAt(i);
            if (char === '<') {
              // Handle HTML tags
              const tagEnd = originalText.indexOf('>', i);
              heroText.innerHTML += originalText.substring(i, tagEnd + 1);
              i = tagEnd + 1;
            } else {
              heroText.innerHTML += char;
              i++;
            }
            setTimeout(typeWriter, 40);
          } else {
            heroText.classList.add('typewriter-done');
          }
        };

        // Start typewriter after a delay
        setTimeout(typeWriter, 500);
      }
    }
  }

  // Magnetic button effects
  setupMagneticButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
      if (window.innerWidth > 768) {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.02)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0px, 0px) scale(1)';
        });
      }
    });
  }

  // Scroll progress indicator
  setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #00d9ff, #0066ff);
      z-index: 9999;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    });
  }
}

// Initialize advanced animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AdvancedAnimations();
});

// Smooth reveal animations for elements
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// Enhanced loading animation
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 600);
  }
});

// Add ripple effect to buttons on click
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      animation: ripple 0.6s ease-out;
    `;

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});
