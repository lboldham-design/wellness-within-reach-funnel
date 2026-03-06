/* ============================================
   Wellness Within Reach — Offer Page Script
   ============================================ */

(function () {
  'use strict';

  /* ── Scroll reveal ─────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const index = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), index * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ── Day chips visual ──────────────────────── */
  const chipContainer = document.getElementById('dayChips');
  if (chipContainer) {
    for (let i = 1; i <= 14; i++) {
      const chip = document.createElement('span');
      chip.className = 'day-chip' + (i === 1 ? ' today' : '');
      chip.textContent = `Day ${i}`;
      chipContainer.appendChild(chip);
    }
  }

  /* ── Progress bar animation ────────────────── */
  const bar = document.getElementById('progressBar');
  if (bar) {
    setTimeout(() => { bar.style.width = '7%'; }, 600);
  }

  /* ── FAQ accordion ─────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-item__q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it wasn't open
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Smooth scroll for anchor links ───────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Buy button — store purchase in localStorage ── */
  const buyBtn = document.getElementById('buyBtn');
  if (buyBtn) {
    buyBtn.addEventListener('click', (e) => {
      // Record purchase for demo
      localStorage.setItem('wwr_challenge_purchased', JSON.stringify({
        date: new Date().toISOString(),
        product: '14-Day Bite-Size Reconnect Challenge',
        price: 27
      }));
      // Navigation is handled by href in HTML
    });
  }

})();
