// Seamless video loop dengan restart sebelum video habis
const video = document.querySelector('.hero-video');

if (video) {
  video.addEventListener('timeupdate', function() {
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

// Sticky menu: muncul setelah hero tidak terlihat
const stickyMenu = document.querySelector('.sticky-menu');
const hero = document.querySelector('.hero');

if (stickyMenu && hero && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      // Jika hero masih terlihat -> sembunyikan menu
      // Jika hero sudah lewat (tidak terlihat) -> tampilkan menu
      document.body.classList.toggle('menu-visible', !entry.isIntersecting);
    },
    {
      threshold: 0.15,
    }
  );

  observer.observe(hero);
} else {
  // Fallback sederhana
  window.addEventListener('scroll', () => {
    if (!hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    document.body.classList.toggle('menu-visible', heroBottom <= 0);
  });
}
