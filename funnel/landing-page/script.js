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
  const form       = document.getElementById('optinForm');
  const firstInput = document.getElementById('firstName');
  const emailInput = document.getElementById('email');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');

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

  /* ── Simulate async submission ─────────────── */
  function fakeSubmit() {
    return new Promise(resolve => setTimeout(resolve, 1200));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name  = firstInput.value.trim();
    const email = emailInput.value.trim();
    let valid = true;

    if (!name) {
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

    // Store lead (localStorage for local demo)
    const leads = JSON.parse(localStorage.getItem('wwr_leads') || '[]');
    leads.push({ name, email, date: new Date().toISOString() });
    localStorage.setItem('wwr_leads', JSON.stringify(leads));

    setLoading(true);
    await fakeSubmit();
    setLoading(false);

    // Show success
    form.style.display = 'none';
    successMsg.classList.add('visible');

    showToast('Guide is on its way — check your inbox!', 5000);

    // After 3s, offer challenge
    setTimeout(() => {
      const go = confirm('Your guide is sent!\n\nWant to also check out the free 14-Day Reconnect Challenge?');
      if (go) window.location.href = '../offer-page/index.html';
    }, 3500);
  });

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
