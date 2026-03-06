/* ============================================
   Wellness Within Reach — Upsell Page Script
   ============================================ */

(function () {
  'use strict';

  /* ── Countdown timer ───────────────────────── */
  const timerEl = document.getElementById('timer');
  let totalSeconds = 15 * 60; // 15 minutes

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  if (timerEl) {
    // Restore from session storage so refreshes don't reset timer
    const stored = sessionStorage.getItem('wwr_oto_timer');
    if (stored) {
      totalSeconds = Math.max(0, parseInt(stored, 10));
    }

    const interval = setInterval(() => {
      totalSeconds = Math.max(0, totalSeconds - 1);
      sessionStorage.setItem('wwr_oto_timer', totalSeconds);
      timerEl.textContent = formatTime(totalSeconds);

      if (totalSeconds <= 0) {
        clearInterval(interval);
        timerEl.textContent = 'EXPIRED';
        timerEl.style.background = 'rgba(0,0,0,0.4)';
        // Disable upgrade buttons
        document.querySelectorAll('#upgradeBtn, #upgradeBtnCard').forEach(btn => {
          btn.style.opacity = '0.5';
          btn.style.pointerEvents = 'none';
          btn.textContent = 'Offer has expired';
        });
      }

      // Turn red in last 2 minutes
      if (totalSeconds <= 120) {
        timerEl.style.background = 'rgba(180, 0, 0, 0.4)';
      }
    }, 1000);

    timerEl.textContent = formatTime(totalSeconds);
  }

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
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ── Modal helpers ─────────────────────────── */
  const overlay   = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalText  = document.getElementById('modalText');

  function showModal(title, text) {
    modalTitle.textContent = title;
    modalText.textContent  = text;
    overlay.style.display  = 'flex';
    document.body.style.overflow = 'hidden';
  }

  overlay && overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  /* ── Upgrade buttons ───────────────────────── */
  function handleUpgrade(e) {
    e.preventDefault();
    // Record toolkit purchase
    localStorage.setItem('wwr_toolkit_purchased', JSON.stringify({
      date: new Date().toISOString(),
      product: 'Nervous System Reset Toolkit',
      price: 37
    }));
    sessionStorage.removeItem('wwr_oto_timer');
    showModal(
      'Toolkit added!',
      'Your full order is confirmed. Check your inbox for access to the challenge and the toolkit. Welcome — you made a great choice for yourself.'
    );
  }

  document.querySelectorAll('#upgradeBtn, #upgradeBtnCard').forEach(btn => {
    btn.addEventListener('click', handleUpgrade);
  });

  /* ── Skip buttons ──────────────────────────── */
  function handleSkip(e) {
    e.preventDefault();
    const confirm = window.confirm(
      'Are you sure you want to skip this offer?\n\nThe Nervous System Reset Toolkit is only available at $37 on this page — it will not be offered again at this price.'
    );
    if (confirm) {
      sessionStorage.removeItem('wwr_oto_timer');
      showModal(
        "You're all set!",
        "Your 14-Day Reconnect Challenge is confirmed. Check your inbox for access details. We can't wait for you to begin."
      );
    }
  }

  document.querySelectorAll('#skipBtn, #skipBtnCard').forEach(btn => {
    btn.addEventListener('click', handleSkip);
  });

  /* ── Smooth scroll ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
