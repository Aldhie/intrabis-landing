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
  // FIXED: Create elements with proper DOM order
  const stickyClone = document.createElement('div');
  stickyClone.className = 'hero-features-sticky';
  stickyClone.innerHTML = heroFeatures.innerHTML;
  
  const spacer = document.createElement('div');
  spacer.className = 'sticky-spacer';

  // FIXED: Insert AFTER hero section, not before
  // DOM order: [hero] → [spacer] → [next section]
  // sticky is fixed, outside normal flow
  const heroParent = hero.parentElement;
  const nextSibling = hero.nextElementSibling;
  
  if (nextSibling) {
    heroParent.insertBefore(spacer, nextSibling);
  } else {
    heroParent.appendChild(spacer);
  }
  
  // Sticky clone appended to body for global z-index context
  document.body.appendChild(stickyClone);

  let ticking = false;
  let scrollTimeout = null;

  function updateStickyVisibility() {
    const heroBottom = hero.getBoundingClientRect().bottom;

    // Tampilkan sticky clone jika hero sudah lewat
    const shouldShow = heroBottom <= 0;

    stickyClone.classList.toggle('visible', shouldShow);
    spacer.classList.toggle('active', shouldShow);
    
    // Hide original hero-features saat sticky muncul (avoid double text)
    heroFeatures.classList.toggle('hide', shouldShow);

    // FIXED: Add will-change during scroll, remove after
    stickyClone.classList.add('scrolling');
    
    // FIXED: Remove will-change after scroll stops (performance)
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      stickyClone.classList.remove('scrolling');
    }, 150);

    ticking = false;
  }

  // FIXED: Store scroll listener reference for cleanup
  const scrollHandler = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateStickyVisibility);
      ticking = true;
    }
  };

  window.addEventListener('scroll', scrollHandler, { passive: true });

  // FIXED: Cleanup function for SPA navigation or page unload
  // Expose cleanup globally if needed by SPA framework
  window.cleanupStickyFeatures = () => {
    window.removeEventListener('scroll', scrollHandler);
    clearTimeout(scrollTimeout);
    if (stickyClone && stickyClone.parentElement) {
      stickyClone.remove();
    }
    if (spacer && spacer.parentElement) {
      spacer.remove();
    }
  };

  // Initial check
  updateStickyVisibility();
}