/* ============================================
   Wellness Within Reach — Landing Page Script
   ============================================ */

(function () {
  'use strict';

  /* ── Nav scroll shadow ─────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Scroll reveal ─────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ── Toast helper ──────────────────────────── */
  const toastEl = document.getElementById('toast');
  let toastTimer;

  function showToast(msg, duration = 3000) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  /* ── Form validation ───────────────────────── */
  const form        = document.getElementById('lead-form');
  const firstInput  = document.getElementById('firstName');
  const emailInput  = document.getElementById('email');
  const submitBtn   = document.getElementById('submitBtn');
  const successMsg  = document.getElementById('successMsg');
  const successName = document.getElementById('successName');
  const skipOffer   = document.getElementById('skipOffer');

  const firstError = document.getElementById('firstNameError');
  const emailError = document.getElementById('emailError');

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function clearErrors() {
    [firstInput, emailInput].forEach(el => el.classList.remove('error'));
    [firstError, emailError].forEach(el => el.classList.remove('visible'));
  }

  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send me the guide';
    }
  }

  /* ── Submit lead to API ────────────────────── */
  async function postLead(first_name, email) {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, email }),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const first_name = firstInput.value.trim();
    const email      = emailInput.value.trim();
    let valid = true;

    if (!first_name) {
      firstInput.classList.add('error');
      firstError.classList.add('visible');
      valid = false;
    }

    if (!validateEmail(email)) {
      emailInput.classList.add('error');
      emailError.classList.add('visible');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    try {
      await postLead(first_name, email);
    } catch (err) {
      // Server unavailable (e.g. opened via file://) — fall back to localStorage
      console.warn('API unreachable, storing lead locally:', err.message);
      const leads = JSON.parse(localStorage.getItem('wwr_leads') || '[]');
      leads.push({ first_name, email, date: new Date().toISOString() });
      localStorage.setItem('wwr_leads', JSON.stringify(leads));
    }

    setLoading(false);

    // Personalize the confirmation screen
    const greeting = first_name ? `Welcome, ${first_name}!` : `You're in!`;
    if (successName) successName.textContent = greeting;

    // Show success regardless of where the lead was stored
    form.style.display = 'none';
    successMsg.classList.add('visible');

    showToast('Guide is on its way — check your inbox!', 5000);
  });

  // Skip offer button on confirmation screen
  if (skipOffer) {
    skipOffer.addEventListener('click', () => {
      const offerEl = document.querySelector('.success-offer');
      if (offerEl) {
        offerEl.style.opacity = '0.4';
        offerEl.style.pointerEvents = 'none';
        skipOffer.textContent = 'Enjoy your guide!';
      }
    });
  }

  /* ── Smooth scroll for anchor links ───────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
