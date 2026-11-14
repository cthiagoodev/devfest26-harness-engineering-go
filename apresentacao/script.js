(() => {
  const body = document.body;
  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;
  const progressFill = document.getElementById('progress-fill');
  const slideCounter = document.getElementById('slide-counter');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnMode = document.getElementById('btn-mode');
  const btnIndex = document.getElementById('btn-index');
  const btnCloseIndex = document.getElementById('btn-close-index');
  const indexDrawer = document.getElementById('index-drawer');
  const indexList = document.getElementById('index-list');

  const loopNodes = Array.from(document.querySelectorAll('.loop-node'));
  const steeringCaption = document.getElementById('steering-caption');

  let currentIndex = 0;
  let steeringTimer = null;
  let steeringStep = 0;
  let touchStartX = null;

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function isSiteMode() {
    return body.classList.contains('mode-site');
  }

  function setMode(mode) {
    const useSite = mode === 'site';
    body.classList.toggle('mode-site', useSite);
    body.classList.toggle('mode-slides', !useSite);
    btnMode.textContent = useSite ? 'Modo Slides' : 'Modo Site';
    btnMode.classList.toggle('is-active', useSite);

    if (useSite) {
      startSteeringCycle();
    } else if (slides[currentIndex]?.dataset.slide !== '8') {
      stopSteeringCycle();
    }
  }

  function toggleMode() {
    setMode(isSiteMode() ? 'slides' : 'site');
  }

  function setActiveLoopNode(index) {
    if (!loopNodes.length) return;
    steeringStep = index % loopNodes.length;
    loopNodes.forEach((node, idx) => {
      node.classList.toggle('active', idx === steeringStep);
    });
    const activeNode = loopNodes[steeringStep];
    if (steeringCaption && activeNode?.dataset.caption) {
      steeringCaption.textContent = activeNode.dataset.caption;
    }
  }

  function startSteeringCycle() {
    stopSteeringCycle();
    setActiveLoopNode(0);
    steeringTimer = window.setInterval(() => {
      setActiveLoopNode(steeringStep + 1);
    }, 2400);
  }

  function stopSteeringCycle() {
    if (steeringTimer !== null) {
      window.clearInterval(steeringTimer);
      steeringTimer = null;
    }
  }

  function buildIndex() {
    if (!indexList) return;
    indexList.innerHTML = '';
    slides.forEach((slide, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'index-item-btn';
      btn.dataset.index = String(idx);

      const numSpan = document.createElement('span');
      numSpan.className = 'index-num';
      numSpan.textContent = pad(idx + 1);

      const titleSpan = document.createElement('span');
      titleSpan.textContent = slide.dataset.title || `Slide ${idx + 1}`;

      btn.append(numSpan, titleSpan);
      btn.addEventListener('click', () => {
        closeIndex();
        if (isSiteMode()) {
          slides[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          goToSlide(idx);
        }
      });

      li.appendChild(btn);
      indexList.appendChild(li);
    });
  }

  function highlightIndexItem(idx) {
    indexList?.querySelectorAll('.index-item-btn').forEach((btn, i) => {
      btn.classList.toggle('current', i === idx);
    });
  }

  function openIndex() {
    highlightIndexItem(currentIndex);
    indexDrawer?.classList.add('open');
    indexDrawer?.setAttribute('aria-hidden', 'false');
  }

  function closeIndex() {
    indexDrawer?.classList.remove('open');
    indexDrawer?.setAttribute('aria-hidden', 'true');
  }

  function goToSlide(targetIndex) {
    const clamped = Math.max(0, Math.min(totalSlides - 1, targetIndex));
    currentIndex = clamped;

    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'is-prev');
      if (idx === currentIndex) {
        slide.classList.add('active');
      } else if (idx < currentIndex) {
        slide.classList.add('is-prev');
      }
    });

    const progressPct = ((currentIndex + 1) / totalSlides) * 100;
    progressFill.style.width = `${progressPct}%`;
    slideCounter.textContent = `${pad(currentIndex + 1)} / ${pad(totalSlides)}`;

    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === totalSlides - 1;
    highlightIndexItem(currentIndex);

    window.history.replaceState(null, '', `#${currentIndex + 1}`);

    if (!isSiteMode()) {
      if (slides[currentIndex]?.dataset.slide === '8') {
        startSteeringCycle();
      } else {
        stopSteeringCycle();
      }
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  function updateFullscreenLabel() {
    btnFullscreen.textContent = document.fullscreenElement ? 'Sair tela cheia' : 'Tela cheia';
  }

  btnPrev.addEventListener('click', () => goToSlide(currentIndex - 1));
  btnNext.addEventListener('click', () => goToSlide(currentIndex + 1));
  btnFullscreen.addEventListener('click', toggleFullscreen);
  btnMode.addEventListener('click', toggleMode);
  btnIndex.addEventListener('click', openIndex);
  btnCloseIndex.addEventListener('click', closeIndex);
  indexDrawer.addEventListener('click', (event) => {
    if (event.target === indexDrawer) closeIndex();
  });
  document.addEventListener('fullscreenchange', updateFullscreenLabel);

  loopNodes.forEach((node, idx) => {
    node.addEventListener('click', () => {
      stopSteeringCycle();
      setActiveLoopNode(idx);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    if (event.key === 'Escape' && indexDrawer.classList.contains('open')) {
      closeIndex();
      return;
    }

    if (event.key === 'i' || event.key === 'I') {
      event.preventDefault();
      if (indexDrawer.classList.contains('open')) closeIndex();
      else openIndex();
      return;
    }

    if (event.key === 'm' || event.key === 'M') {
      event.preventDefault();
      toggleMode();
      return;
    }

    if (event.key === 'f' || event.key === 'F') {
      event.preventDefault();
      toggleFullscreen();
      return;
    }

    if (isSiteMode()) return;

    switch (event.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        event.preventDefault();
        goToSlide(currentIndex + 1);
        break;
      case 'ArrowLeft':
      case 'PageUp':
        event.preventDefault();
        goToSlide(currentIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      default:
        break;
    }
  });

  // Navegação por gesto em telas touch no Modo Slides
  document.addEventListener('touchstart', (event) => {
    if (isSiteMode() || event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    if (isSiteMode() || touchStartX === null) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 48) {
      goToSlide(dx < 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });

  buildIndex();

  const params = new URLSearchParams(window.location.search);
  const hashNum = Number.parseInt(window.location.hash.replace('#', ''), 10);
  const initialIndex = Number.isFinite(hashNum) && hashNum >= 1 && hashNum <= totalSlides
    ? hashNum - 1
    : 0;

  if (params.get('mode') === 'site' || window.innerWidth < 768) {
    setMode('site');
  } else {
    setMode('slides');
  }

  goToSlide(initialIndex);
})();
