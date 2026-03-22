/* ============================================================
   main.js — HighTech Shared JavaScript
   Navigation, Scroll Reveal, Animations, Form Handling
   ============================================================ */

// ─── Navigation ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');

// Sticky nav shadow on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger toggle
function toggleNav() {
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
}

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── Scroll Reveal ──────────────────────────────────────────
function initReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ─── Animated Counter ───────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current = Math.min(Math.round(increment * step), target);
    el.textContent = current + suffix;
    if (step >= steps) clearInterval(timer);
  }, duration / steps);
}

function initCounters() {
  const statEls = document.querySelectorAll('.stat-item h3');
  if (!statEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const text = entry.target.textContent;
        const num = parseInt(text.replace(/\D/g, ''));
        const suffix = text.includes('%') ? '%' : text.includes('+') ? '+' : '';

        if (!isNaN(num)) {
          animateCounter(entry.target, num, suffix);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => observer.observe(el));
}

// ─── Navbar Active Link Highlight ───────────────────────────
function setActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (!link.classList.contains('nav-cta')) {
      link.classList.remove('active');
    }
  });
}

// ─── Cursor Glow Effect ─────────────────────────────────────
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    z-index: 0;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ─── Card Tilt Effect ───────────────────────────────────────
function initCardTilt() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── Contact Form Handler ────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  if (!btn || !btnText) return;

  // Loading state
  btn.disabled = true;
  btnText.textContent = 'Sending...';
  btn.style.opacity = '0.8';

  // Simulate async submission
  setTimeout(() => {
    btn.disabled = false;
    btnText.textContent = 'Send Message →';
    btn.style.opacity = '';

    // Show toast
    showToast();

    // Reset form
    document.getElementById('contactForm').reset();
  }, 1500);
}

function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ─── Typing Animation for Hero ───────────────────────────────
function initTypewriter() {
  const target = document.querySelector('.gradient-text');
  if (!target) return;

  const phrases = [
    'That Changes Everything',
    'That Scales Infinitely',
    'That Drives Revenue',
    'That Users Love',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const current = phrases[phraseIdx];

    if (isPaused) {
      isPaused = false;
      setTimeout(type, 1800);
      return;
    }

    if (!isDeleting) {
      target.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        isPaused = true;
        setTimeout(type, 50);
        return;
      }
    } else {
      target.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    setTimeout(type, isDeleting ? 40 : 60);
  }

  // Start after initial animation delay
  setTimeout(type, 1500);
}

// ─── Particle Canvas Background (Hero only) ─────────────────
function initParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0.4';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: ['#00f5ff', '#7c3aed', '#ff0080'][Math.floor(Math.random() * 3)],
      alpha: Math.random() * 0.6 + 0.2,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { init(); });
}

// ─── Init All ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  setActiveLink();
  initCursorGlow();
  initCardTilt();
  initParticles();
  initTypewriter();
});
