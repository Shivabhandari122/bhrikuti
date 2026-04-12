/* =========================================================
   BHRIKUTI HOSPITAL – Premium Interactive Script
   ========================================================= */


// Define initApp globally so loader.js can call it after fetching components
window.initApp = () => {

  /* ─── Scroll Progress Bar ───────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  const updateProgress = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  };

  /* ─── Header Scroll Behaviour ───────────────────────── */
  const header   = document.getElementById('header');
  const backTop  = document.getElementById('backToTop');

  const handleScroll = () => {
    updateProgress();
    const scrolled = window.scrollY > 60;
    header?.classList.toggle('scrolled', scrolled);
    backTop?.classList.toggle('visible', window.scrollY > 400);
    highlightNavLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ─── Mobile Menu ───────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  const openNav = () => {
    navMenu?.classList.add('active');
    hamburger?.classList.add('active');
    navOverlay?.classList.add('active');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    navMenu?.classList.remove('active');
    hamburger?.classList.remove('active');
    navOverlay?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    navMenu?.classList.contains('active') ? closeNav() : openNav();
  });

  navOverlay?.addEventListener('click', closeNav);

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* ─── Active Nav Highlight on Scroll ────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-link');

  const highlightNavLink = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        const match = document.querySelector(`.nav-link[href="#${section.id}"]`);
        match?.classList.add('active');
      }
    });
  };

  /* ─── Back To Top ───────────────────────────────────── */
  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── Counter Animation ─────────────────────────────── */
  const counters = document.querySelectorAll('.counter');

  const animateCounter = (el) => {
    const target   = +el.getAttribute('data-target');
    const duration = 1800;
    const stepTime = 16;
    const steps    = Math.ceil(duration / stepTime);
    let current    = 0;
    const increment = target / steps;

    const tick = () => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current < target) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(tick);
  };

  // Observe stats section
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(animateCounter);
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    statsObs.observe(statsSection);
  }

  /* ─── Scroll Reveal ─────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-hidden');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on position within sibling group
        const siblings = entry.target.parentElement?.querySelectorAll('.reveal-hidden');
        let delay = 0;
        if (siblings) {
          siblings.forEach((sib, idx) => {
            if (sib === entry.target) delay = idx * 90;
          });
        }
        setTimeout(() => entry.target.classList.add('reveal-active'), delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  /* ─── Toast Notification ────────────────────────────── */
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer;

  const showToast = (message, type = 'success') => {
    if (!toast || !toastMsg) return;
    clearTimeout(toastTimer);
    toast.className     = `toast ${type}`;
    toastMsg.textContent = message;
    const icon = toast.querySelector('i');
    if (icon) {
      icon.className = type === 'success'
        ? 'fa-solid fa-circle-check'
        : 'fa-solid fa-circle-exclamation';
    }
    // Force reflow so transition plays
    void toast.offsetWidth;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
  };

  /* ─── Form Validation & Submission ─────────────────── */
  const form = document.getElementById('appointmentForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name  = document.getElementById('name')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const dept  = document.getElementById('department')?.value;

      // Validation
      if (!name) {
        showToast('Please enter your full name.', 'error');
        document.getElementById('name')?.focus();
        return;
      }
      if (!phone) {
        showToast('Please enter your phone number.', 'error');
        document.getElementById('phone')?.focus();
        return;
      }
      if (!dept) {
        showToast('Please select a department.', 'error');
        document.getElementById('department')?.focus();
        return;
      }

      // Simulate submission
      const submitBtn  = document.getElementById('submit-btn');
      const btnSpan    = submitBtn?.querySelector('span');
      const btnIcon    = submitBtn?.querySelector('i');

      if (submitBtn) {
        submitBtn.disabled        = true;
        if (btnSpan) btnSpan.textContent = 'Sending…';
        if (btnIcon) btnIcon.className   = 'fa-solid fa-spinner fa-spin';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled        = false;
          if (btnSpan) btnSpan.textContent = 'Send Appointment Request';
          if (btnIcon) btnIcon.className   = 'fa-solid fa-paper-plane';
        }
        form.reset();
        showToast('Appointment request sent! We will contact you within 24 hours. 🩺', 'success');
      }, 1600);
    });
  }

  /* ─── Hero Tagline Typewriter ───────────────────────── */
  const badge = document.querySelector('.hero-badge');
  if (badge) {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(-10px)';
    badge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      badge.style.opacity   = '1';
      badge.style.transform = 'translateY(0)';
    }, 400);
  }

  /* ─── Smooth Parallax on Hero ───────────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const offset  = window.scrollY;
      const overlay = hero.querySelector('.hero-overlay');
      if (overlay && offset < window.innerHeight) {
        overlay.style.transform = `translateY(${offset * 0.18}px)`;
      }
    }, { passive: true });
  }

  /* ─── Service Card Hover Ripple ─────────────────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function (e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:10px; height:10px;
        background:rgba(0,82,204,0.06);
        transform:scale(0); pointer-events:none;
        left:${e.clientX - rect.left - 5}px;
        top:${e.clientY - rect.top - 5}px;
        animation:ripple-grow 0.6s ease forwards;
        z-index:0;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe once
  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-grow {
        from { transform: scale(0); opacity: 1; }
        to   { transform: scale(80); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── Set minimum date for appointment field ────────── */
  const dateInput = document.getElementById('appt-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  /* ─── Newsletter Form ───────────────────────────────── */
  document.querySelectorAll('.newsletter-form').forEach(nf => {
    nf.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailEl = nf.querySelector('input[type="email"]');
      if (emailEl?.value.trim()) {
        emailEl.value = '';
        showToast('You have subscribed to our health newsletter! 💌', 'success');
      } else {
        showToast('Please enter a valid email address.', 'error');
      }
    });
  });



  /* ─── Initialize first scroll state ────────────────── */
  handleScroll();
};
