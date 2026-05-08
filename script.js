  // Custom cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  // Smooth ring follow
  function animateCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) *.12;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover expansion
  document.querySelectorAll('a, button, .masonry-item, .client-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(201,169,110,0.9)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(201,169,110,0.5)';
    });
  });

  // Tab switching
  function switchTab(btn, panelId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.grid-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + panelId).classList.add('active');
    // Re-trigger reveals in new panel
    document.querySelectorAll('#panel-' + panelId + ' .reveal').forEach((el, i) => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));

  // Scroll indicator
  const sections = document.querySelectorAll('[data-section]');
  const dots = document.querySelectorAll('.scroll-dot');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = entry.target.dataset.section;
        dots.forEach(d => d.classList.remove('active'));
        const dot = document.querySelector(`.scroll-dot[data-section="${idx}"]`);
        if (dot) dot.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-section]').forEach(s => sectionObserver.observe(s));

  // Event modal — clic sur une vignette du panel Events
  const modal = document.getElementById('eventModal');
  const modalImg = document.getElementById('eventModalImg');
  const modalTitle = document.getElementById('eventModalTitle');
  const modalDate = document.getElementById('eventModalDate');
  const modalText = document.getElementById('eventModalText');
  const modalClose = document.getElementById('eventModalClose');

  function openEventModal(item) {
    const img = item.querySelector('img');
    const title = item.querySelector('.item-overlay-title');
    const date = item.querySelector('.item-overlay-date');
    const text = item.querySelector('.item-overlay-text');
    if (!img) return;
    modalImg.src = img.src;
    modalImg.alt = img.alt || '';
    modalTitle.textContent = title ? title.textContent : '';
    modalDate.textContent = date ? date.textContent : '';
    modalText.textContent = text ? text.textContent : '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeEventModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('#panel-expositions .masonry-item').forEach(item => {
    item.addEventListener('click', () => openEventModal(item));
  });

  modalClose.addEventListener('click', closeEventModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeEventModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeEventModal();
  });

  // Custom lightbox — clic sur une vignette du panel Deco & Custom (section Custom)
  const lb = document.getElementById('customLightbox');
  const lbImg = document.getElementById('customLightboxImg');
  const lbClose = document.getElementById('customLightboxClose');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }
  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.custom-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => {
    if (e.target !== lbImg) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
  });
