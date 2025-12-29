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
  // Spacer supaya konten tidak ketutup sticky (menghindari "menumpuk")
  const spacer = document.createElement('div');
  spacer.className = 'sticky-spacer';
  document.body.insertBefore(spacer, document.body.firstChild);

  // Buat clone sticky
  const stickyClone = document.createElement('div');
  stickyClone.className = 'hero-features-sticky';
  stickyClone.innerHTML = heroFeatures.innerHTML;
  document.body.insertBefore(stickyClone, spacer.nextSibling);

  let ticking = false;

  function updateStickyVisibility() {
    const heroBottom = hero.getBoundingClientRect().bottom;

    // Tampilkan sticky clone jika hero sudah lewat
    const shouldShow = heroBottom <= 0;

    stickyClone.classList.toggle('visible', shouldShow);
    spacer.classList.toggle('active', shouldShow);

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateStickyVisibility);
      ticking = true;
    }
  });

  // Initial check
  updateStickyVisibility();
}
