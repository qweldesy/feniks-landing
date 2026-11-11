/* ============================================================
   ФЕНИКС — логика макета
   ============================================================ */
(function () {
  'use strict';

  /* иконки Lucide */
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  /* ---------- мобильное меню ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      nav.classList.remove('is-open');
      burger.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  /* ---------- активный пункт меню ---------- */
  const sections = ['services', 'prices', 'how', 'reviews', 'contacts']
    .map(id => document.getElementById(id)).filter(Boolean);
  const links = [...nav.querySelectorAll('.nav__link')];
  let lockedId = null;
  let scrollEndTimer = null;

  function setActive(id) {
    links.forEach(l => l.classList.toggle('is-active', !!id && l.getAttribute('href') === '#' + id));
  }
  function sectionAtBand() {
    const top = window.innerHeight * 0.40;
    const bottom = window.innerHeight * 0.46;
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= bottom && r.bottom >= top) return s.id;
    }
    return null;
  }
  const visible = new Set();
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) visible.add(en.target.id);
      else visible.delete(en.target.id);
    });
    if (lockedId) return;
    const cur = sections.find(s => visible.has(s.id));
    setActive(cur ? cur.id : null);
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));

  links.forEach(l => l.addEventListener('click', () => {
    lockedId = l.getAttribute('href').slice(1);
    setActive(lockedId);
  }));
  window.addEventListener('scroll', () => {
    if (!lockedId) return;
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      const target = lockedId;
      lockedId = null;
      setActive(sectionAtBand() || target);
    }, 140);
  }, { passive: true });

  /* ---------- появление блоков ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- маска телефона ---------- */
  function attachPhoneMask(input) {
    input.addEventListener('input', () => {
      let d = input.value.replace(/\D/g, '');
      if (d.startsWith('8')) d = '7' + d.slice(1);
      if (d && !d.startsWith('7')) d = '7' + d;
      d = d.slice(0, 11);
      let out = '';
      if (d.length) out = '+7';
      if (d.length > 1) out += ' (' + d.slice(1, 4);
      if (d.length >= 4) out += ')';
      if (d.length > 4) out += ' ' + d.slice(4, 7);
      if (d.length > 7) out += '-' + d.slice(7, 9);
      if (d.length > 9) out += '-' + d.slice(9, 11);
      input.value = out;
    });
  }
  function validPhone(v) { return v.replace(/\D/g, '').length === 11; }

  /* ---------- заявка ---------- */
  const form = document.getElementById('inquiryForm');
  if (form) {
    const name = document.getElementById('fName');
    const phone = document.getElementById('fPhone');
    attachPhoneMask(phone);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const okName = name.value.trim().length > 1;
      const okPhone = validPhone(phone.value);
      name.classList.toggle('is-error', !okName);
      phone.classList.toggle('is-error', !okPhone);
      if (!okName || !okPhone) return;
      document.getElementById('formDone').hidden = false;
      form.reset();
      setTimeout(() => { document.getElementById('formDone').hidden = true; }, 6000);
    });
  }

  /* ---------- поиск по прайсу ---------- */
  const search = document.getElementById('plSearch');
  const rows = [...document.querySelectorAll('.prow')];
  const empty = document.getElementById('plEmpty');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      let n = 0;
      rows.forEach(r => {
        const hit = !q || (r.dataset.name + ' ' + r.textContent).toLowerCase().includes(q);
        r.style.display = hit ? '' : 'none';
        if (hit) n++;
      });
      empty.hidden = n !== 0;
    });
  }

  /* год */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
