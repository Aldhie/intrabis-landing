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
  // Create elements with proper DOM order
  const stickyClone = document.createElement('div');
  stickyClone.className = 'hero-features-sticky';
  stickyClone.innerHTML = heroFeatures.innerHTML;
  
  const spacer = document.createElement('div');
  spacer.className = 'sticky-spacer';

  // Insert AFTER hero section
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
    const scrollY = window.scrollY;

    // Tampilkan sticky clone jika hero sudah lewat
    const shouldShow = heroBottom <= 0;

    stickyClone.classList.toggle('visible', shouldShow);
    spacer.classList.toggle('active', shouldShow);
    
    // Hide original hero-features saat sticky muncul
    heroFeatures.classList.toggle('hide', shouldShow);

    // DYNAMIC JS: Calculate scroll progress (0 to 1) over 800px range for crisp effect
    const scrollRange = 800;
    const scrollProgress = Math.min(scrollY / scrollRange, 1);

    // Update CSS variables based on scroll progress (reduced range for crisp text)
    // Blur: 20px → 32px (reduced from 60px → 100px)
    const blurAmount = 20 + (scrollProgress * 12);
    // Background opacity: 0.12 → 0.18 (higher for better text contrast)
    const bgOpacity = 0.12 + (scrollProgress * 0.06);
    // Saturate: 120% → 135% (reduced from 130% → 160%)
    const saturate = 120 + (scrollProgress * 15);
    // Brightness: 1.08 → 1.14
    const brightness = 1.08 + (scrollProgress * 0.06);

    stickyClone.style.setProperty('--blur-amount', `${blurAmount}px`);
    stickyClone.style.setProperty('--bg-opacity', bgOpacity);
    stickyClone.style.setProperty('--saturate', `${saturate}%`);
    stickyClone.style.setProperty('--brightness', brightness);

    // Add will-change during scroll
    stickyClone.classList.add('scrolling');
    
    // Remove will-change after scroll stops
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      stickyClone.classList.remove('scrolling');
    }, 150);

    ticking = false;
  }

  // Store scroll listener reference for cleanup
  const scrollHandler = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateStickyVisibility);
      ticking = true;
    }
  };

  window.addEventListener('scroll', scrollHandler, { passive: true });

  // Cleanup function for SPA navigation or page unload
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
