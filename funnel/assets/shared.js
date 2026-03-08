/* ============================================================
   Wellness Within Reach — Shared JS Utilities
   Load at end of <body>:
     <script src="../assets/shared.js"></script>
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll reveal ─────────────────────────────────────────
     Animates any element with class="reveal" as it enters the
     viewport. Siblings inside the same parent are staggered.
  ──────────────────────────────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const index = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), index * 85);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    els.forEach(el => observer.observe(el));
  }

  /* ── Smooth scroll for anchor links ────────────────────────
     Works with an optional sticky nav (id="mainNav") so the
     target is never obscured.
  ──────────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    const nav = document.getElementById('mainNav');

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = nav ? nav.offsetHeight + 16 : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ── Nav scroll shadow ─────────────────────────────────────
     Adds class "scrolled" to #mainNav when the page is scrolled.
  ──────────────────────────────────────────────────────────── */
  function initNavShadow() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── FAQ accordion ─────────────────────────────────────────
     Expects .faq-item elements each containing a .faq-item__q
     button. One open at a time.
  ──────────────────────────────────────────────────────────── */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const btn = item.querySelector('.faq-item__q');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(fi => {
          fi.classList.remove('open');
          const b = fi.querySelector('.faq-item__q');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── Toast notification ────────────────────────────────────
     Usage: WWR.showToast('Message', 3000)
     Requires a <div id="toast"></div> in the page.
  ──────────────────────────────────────────────────────────── */
  let _toastTimer;

  function showToast(msg, duration) {
    duration = duration || 3000;
    const el = document.getElementById('toast');
    if (!el) return;
    clearTimeout(_toastTimer);
    el.textContent = msg;
    el.classList.add('show');
    _toastTimer = setTimeout(() => el.classList.remove('show'), duration);
  }

  /* ── Init all ──────────────────────────────────────────── */
  initReveal();
  initSmoothScroll();
  initNavShadow();
  initFAQ();

  /* ── Public API ─────────────────────────────────────────── */
  window.WWR = window.WWR || {};
  window.WWR.showToast = showToast;

})();
