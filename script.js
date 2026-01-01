// Seamless video loop dengan restart sebelum video habis
const video = document.querySelector('.hero-video');

if (video) {
  video.addEventListener('timeupdate', function () {
    // Restart video 0.3 detik sebelum selesai untuk seamless loop
    if (video.duration && (video.duration - video.currentTime <= 0.3)) {
      video.currentTime = 0;
      video.play();
    }
  });

  video.play().catch(() => {
    // Autoplay bisa diblok browser; abaikan.
  });
}

// Sticky features: clone element dan tampilkan saat scroll melewati hero
const heroFeatures = document.querySelector('.hero-features');
const hero = document.querySelector('.hero');

if (heroFeatures && hero) {
  const stickyClone = document.createElement('div');
  stickyClone.className = 'hero-features-sticky';
  stickyClone.innerHTML = heroFeatures.innerHTML;
  
  const spacer = document.createElement('div');
  spacer.className = 'sticky-spacer';

  const heroParent = hero.parentElement;
  const nextSibling = hero.nextElementSibling;
  
  if (nextSibling) {
    heroParent.insertBefore(spacer, nextSibling);
  } else {
    heroParent.appendChild(spacer);
  }
  
  document.body.appendChild(stickyClone);

  let ticking = false;

  function updateStickyVisibility() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const shouldShow = heroBottom <= 0;

    stickyClone.classList.toggle('visible', shouldShow);
    spacer.classList.toggle('active', shouldShow);
    heroFeatures.classList.toggle('hide', shouldShow);
    document.body.classList.toggle('nav-visible', shouldShow);

    ticking = false;
  }

  const scrollHandler = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateStickyVisibility);
      ticking = true;
    }
  };

  window.addEventListener('scroll', scrollHandler, { passive: true });

  window.cleanupStickyFeatures = () => {
    window.removeEventListener('scroll', scrollHandler);
    if (stickyClone && stickyClone.parentElement) {
      stickyClone.remove();
    }
    if (spacer && spacer.parentElement) {
      spacer.remove();
    }
  };

  updateStickyVisibility();
}
