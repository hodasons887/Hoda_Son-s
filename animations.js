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
    this.setupParticleSystem();
    this.setupTypewriterEffect();
    this.setupMagneticButtons();
    this.setupScrollProgress();
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
          const delay = index * 100;

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
    document.querySelectorAll('.service-card, .tech-card, .feature-card, .portfolio-card, .testimonial-card, .partner-logo, .accordion-item').forEach(el => {
      observer.observe(el);
    });
  }

  // Enhanced hover effects
  setupHoverEffects() {
    // Service cards 3D tilt effect
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });

    // Portfolio cards reveal effect
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const overlay = card.querySelector('.overlay');

      card.addEventListener('mouseenter', () => {
        overlay.style.transform = 'translateY(0)';
        overlay.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        overlay.style.transform = 'translateY(20px)';
        overlay.style.opacity = '0';
      });
    });
  }

  // Particle system for hero background
  setupParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';

    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.position = 'relative';
      hero.insertBefore(canvas, hero.firstChild);

      const ctx = canvas.getContext('2d');
      let particles = [];
      let animationId;

      const resizeCanvas = () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
      };

      const createParticle = () => {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2
        };
      };

      const initParticles = () => {
        particles = [];
        for (let i = 0; i < 50; i++) {
          particles.push(createParticle());
        }
      };

      const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(79, 209, 197, ${particle.opacity})`;
          ctx.fill();
        });

        animationId = requestAnimationFrame(animateParticles);
      };

      resizeCanvas();
      initParticles();
      animateParticles();

      window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
      });
    }
  }

  // Typewriter effect for hero text
  setupTypewriterEffect() {
    const heroText = document.querySelector('.hero-copy h1');
    if (heroText) {
      const originalText = heroText.innerHTML;
      const accentSpan = heroText.querySelector('.accent');
      const accentText = accentSpan ? accentSpan.textContent : '';

      heroText.innerHTML = '';

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
          setTimeout(typeWriter, 50);
        }
      };

      // Start typewriter after a delay
      setTimeout(typeWriter, 1000);
    }
  }

  // Magnetic button effects
  setupMagneticButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
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
      background: linear-gradient(90deg, #4fd1c5, #60a5fa);
      z-index: 9999;
      transition: width 0.25s ease;
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

// Loading animation improvements
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
});
