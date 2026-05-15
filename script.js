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

  // Custom lightbox — clic sur une vignette (image OU vidéo)
  const lb = document.getElementById('customLightbox');
  const lbImg = document.getElementById('customLightboxImg');
  const lbVid = document.getElementById('customLightboxVideo');
  const lbClose = document.getElementById('customLightboxClose');

  function openLightbox(src, alt) {
    lb.classList.remove('lightbox--video');
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }
  function openLightboxVideo(src) {
    lb.classList.add('lightbox--video');
    lbVid.src = src;
    lbVid.muted = true;
    lbVid.loop = true;
    lbVid.autoplay = true;
    lbVid.playsInline = true;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    // Lancer la lecture (certains navigateurs exigent un appel explicite)
    lbVid.play().catch(() => {});
  }
  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    // Stoppe la vidéo proprement
    lbVid.pause();
    lbVid.removeAttribute('src');
    lbVid.load();
    lb.classList.remove('lightbox--video');
  }

  document.querySelectorAll('.custom-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  // Lightbox pour les photos ET vidéos des panels Murs & Fresques et Vitrines
  document.querySelectorAll('#panel-murs .masonry-item, #panel-vitrines .masonry-item').forEach(item => {
    const img = item.querySelector('img');
    const vid = item.querySelector('video');
    if (!img && !vid) return;
    item.addEventListener('click', () => {
      if (vid) openLightboxVideo(vid.currentSrc || vid.src);
      else openLightbox(img.src, img.alt);
    });
    item.style.cursor = 'zoom-in';
  });

  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => {
    // On ferme seulement si le clic vise le fond (pas l'image, ni la vidéo, ni la croix)
    if (e.target !== lbImg && e.target !== lbVid && e.target !== lbClose) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
  });

  // ---------- Auto-hide des sections vides ----------
  // 1) On masque les .masonry-item dont l'image/vidéo ne charge pas (404)
  // 2) Si une .vitrine-section n'a plus aucun item visible, on la masque (titre + grille)
  // Conséquence : ajoute des fichiers au bon chemin → ça réapparaît tout seul.
  function refreshEmptySections() {
    // 1) Masquer chaque section sans item visible
    document.querySelectorAll('.vitrine-section').forEach(section => {
      const visibleItems = section.querySelectorAll('.masonry-item:not([hidden])');
      section.hidden = visibleItems.length === 0;
    });

    // 2) Masquer chaque bouton d'onglet dont le panel n'a plus aucune section visible
    document.querySelectorAll('.tab-btn').forEach(btn => {
      // Récupère le suffixe du panel ciblé par switchTab(this, 'xxx')
      const match = btn.getAttribute('onclick')?.match(/switchTab\(this,\s*'([^']+)'\)/);
      if (!match) return;
      const panel = document.getElementById('panel-' + match[1]);
      if (!panel) return;

      // Le panel a-t-il encore au moins une section visible OU un item visible ?
      const hasVisibleSection = panel.querySelector('.vitrine-section:not([hidden]), .masonry-item:not([hidden])');
      btn.hidden = !hasVisibleSection;

      // Si le bouton actif disparaît, on bascule sur le premier visible
      if (btn.hidden && btn.classList.contains('active')) {
        btn.classList.remove('active');
        panel.classList.remove('active');
        const firstVisibleBtn = document.querySelector('.tab-btn:not([hidden])');
        if (firstVisibleBtn) firstVisibleBtn.click();
      }
    });
  }

  document.querySelectorAll('.masonry-item').forEach(item => {
    const media = item.querySelector('img, video');
    if (!media) { item.hidden = true; return; }

    const markBroken = () => { item.hidden = true; refreshEmptySections(); };

    if (media.tagName === 'IMG') {
      // Image déjà chargée OU déjà cassée ?
      if (media.complete) {
        if (media.naturalWidth === 0) markBroken();
      } else {
        media.addEventListener('error', markBroken);
        media.addEventListener('load', () => {
          if (media.naturalWidth === 0) markBroken();
        });
      }
    } else {
      media.addEventListener('error', markBroken);
    }
  });

  // Premier passage (utile si toutes les images sont en cache)
  refreshEmptySections();
