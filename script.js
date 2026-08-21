// Dynatrix Tech — multi-page site behavior

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Active nav link highlighting ----------
  const currentFile = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentFile) a.classList.add('active');
  });

  // ---------- Mobile nav toggle ----------
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // ---------- Animated stat counters ----------
  function animateCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    const duration = 1400;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function initCounters(scope) {
    if (!scope) return;
    scope.querySelectorAll('[data-count]').forEach(el => animateCount(el));
  }

  // ---------- Scroll reveal ----------
  function initReveal(scope) {
    if (!scope) return;
    const els = scope.querySelectorAll('.card:not([data-revealed]), .section-head:not([data-revealed]), .blog-featured:not([data-revealed])');
    els.forEach(el => {
      el.dataset.revealed = 'true';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
    });
  }

  // Run counters + reveal for whatever page is currently loaded
  initReveal(document.body);
  initCounters(document.body);

  // ---------- Portfolio / blog filter tabs ----------
  document.querySelectorAll('.filter-row').forEach(row => {
    const btns = row.querySelectorAll('.filter-btn');
    const scopeItems = row.parentElement.querySelectorAll('[data-category]');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        scopeItems.forEach(item => {
          const show = filter === 'all' || item.getAttribute('data-category') === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  });

  // ---------- Testimonial rail (horizontal scroll) ----------
  document.querySelectorAll('.rail-wrap').forEach(wrap => {
    const rail = wrap.querySelector('.rail');
    const prevBtn = wrap.querySelector('.rail-prev');
    const nextBtn = wrap.querySelector('.rail-next');
    if (!rail) return;
    function cardWidth() {
      const card = rail.querySelector('.rail-card');
      return card ? card.getBoundingClientRect().width + 20 : 380;
    }
    if (nextBtn) nextBtn.addEventListener('click', () => rail.scrollBy({ left: cardWidth(), behavior: 'smooth' }));
    if (prevBtn) prevBtn.addEventListener('click', () => rail.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
  });

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---------- Popup modal (free audit offer) ----------
  const popupOverlay = document.getElementById('popup-overlay');
  const popupClose = document.getElementById('popup-close');
  const popupForm = document.getElementById('popup-form');

  function openPopup() {
    if (popupOverlay) popupOverlay.classList.add('show');
  }
  function closePopup() {
    if (popupOverlay) popupOverlay.classList.remove('show');
  }

  if (popupOverlay) {
    if (!sessionStorage.getItem('dynatrixAuditPopupShown')) {
      setTimeout(() => {
        openPopup();
        sessionStorage.setItem('dynatrixAuditPopupShown', 'true');
      }, 6000);
    }
    if (popupClose) popupClose.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) closePopup();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePopup();
    });
  }
  if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('popup-success');
      if (success) {
        success.classList.add('show');
        success.textContent = "Request received — we'll send your audit within 2 business days.";
      }
      popupForm.reset();
      setTimeout(closePopup, 2200);
    });
  }

  // ---------- Contact form ----------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('form-success');
      if (success) {
        success.classList.add('show');
        success.textContent = "Message received — we'll reply within one business day.";
      }
      form.reset();
    });
  }

  // ---------- Get Started (plan checkout-style flow) ----------
  const GS_PLANS = {
    starter: {
      name: 'Starter',
      features: [
        'Single-platform build (Shopify or Webflow)',
        'Up to 6 pages / templates',
        'Mobile-optimized &amp; speed-tuned',
        '2 rounds of revisions'
      ],
      priceLabel: 'One-time price',
      priceAmt: '$850',
      showOngoing: false,
      ongoingAmt: '',
      totalLabel: 'Estimated total',
      totalSub: 'Fixed price — confirmed on your audit call',
      totalAmt: '$850'
    },
    growth: {
      name: 'Growth',
      features: [
        'Full Shopify or Webflow build',
        'Monthly SEO &amp; email program',
        'Social content calendar',
        'Monthly reporting call'
      ],
      priceLabel: 'Starting price',
      priceAmt: '$2,200',
      showOngoing: true,
      ongoingAmt: '$400/mo',
      totalLabel: 'Estimated starting price',
      totalSub: 'Final scope confirmed on your audit call',
      totalAmt: '$2,200'
    },
    scale: {
      name: 'Scale',
      features: [
        'Custom Shopify/Webflow architecture',
        'Paid social management',
        'Dedicated senior team',
        'Weekly reporting &amp; strategy'
      ],
      priceLabel: 'Pricing',
      priceAmt: 'Custom quoted',
      showOngoing: false,
      ongoingAmt: '',
      totalLabel: 'Estimated price',
      totalSub: 'Scoped and quoted after your audit call',
      totalAmt: 'Custom'
    }
  };

  const gsPlanSelect = document.getElementById('gs-plan-select');
  const gsFeatureList = document.getElementById('gs-feature-list');
  const gsPriceLabel = document.getElementById('gs-price-label');
  const gsPriceAmt = document.getElementById('gs-price-amt');
  const gsOngoingLine = document.getElementById('gs-ongoing-line');
  const gsOngoingAmt = document.getElementById('gs-ongoing-amt');
  const gsTotalAmt = document.getElementById('gs-total-amt');

  function renderGsPlan(key) {
    const plan = GS_PLANS[key];
    if (!plan || !gsPlanSelect) return;
    gsPlanSelect.value = key;
    gsFeatureList.innerHTML = plan.features.map(f => `<li>${f}</li>`).join('');
    gsPriceLabel.textContent = plan.priceLabel;
    gsPriceAmt.textContent = plan.priceAmt;
    gsOngoingLine.style.display = plan.showOngoing ? 'flex' : 'none';
    gsOngoingAmt.textContent = plan.ongoingAmt;
    document.querySelector('.gs-total .t-label').textContent = plan.totalLabel;
    document.querySelector('.gs-total .t-sub').textContent = plan.totalSub;
    gsTotalAmt.textContent = plan.totalAmt;
  }

  if (gsPlanSelect) {
    // Read the plan from the URL (?plan=growth) set by whichever pricing button was clicked.
    // Falls back to "growth" if the page was reached another way.
    const params = new URLSearchParams(location.search);
    const requestedPlan = params.get('plan');
    renderGsPlan(GS_PLANS[requestedPlan] ? requestedPlan : 'growth');
    gsPlanSelect.addEventListener('change', () => renderGsPlan(gsPlanSelect.value));
  }

  // "What do you need" chip selector (single-select)
  const gsChips = document.querySelectorAll('#gs-need-chips .chip');
  gsChips.forEach(chip => {
    chip.addEventListener('click', () => {
      gsChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  // Get Started form (placeholder submit, same pattern as contact form)
  const gsForm = document.getElementById('get-started-form');
  if (gsForm) {
    gsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('gs-form-success');
      if (success) {
        success.classList.add('show');
        success.textContent = "Details received — we'll reply within one business day to book your audit call.";
      }
      gsForm.reset();
      gsChips.forEach(c => c.classList.remove('selected'));
    });
  }

});
