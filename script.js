// ================= SEAMLESS VIDEO CROSSFADE LOOP =================
// Uses 2 video layers that crossfade for buttery smooth loop

const video1 = document.querySelector('.hero-video-1');
const video2 = document.querySelector('.hero-video-2');

if (video1 && video2) {
  let activeVideo = video1;
  let inactiveVideo = video2;
  
  // Start first video
  video1.play().catch(() => {
    // Autoplay blocked, silently handle
  });

  function setupCrossfade() {
    activeVideo.addEventListener('timeupdate', function checkLoop() {
      // Start crossfade 1.5 seconds before end
      const timeLeft = activeVideo.duration - activeVideo.currentTime;
      
      if (timeLeft <= 1.5 && timeLeft > 0) {
        // Start inactive video from beginning
        inactiveVideo.currentTime = 0;
        inactiveVideo.play().catch(() => {});
        
        // Crossfade: fade out active, fade in inactive
        activeVideo.style.opacity = '0';
        inactiveVideo.style.opacity = '1';
        
        // Swap references after crossfade completes
        setTimeout(() => {
          [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo];
          inactiveVideo.pause();
          inactiveVideo.currentTime = 0;
        }, 1000); // Match CSS transition duration
        
        // Remove listener to avoid multiple triggers
        activeVideo.removeEventListener('timeupdate', checkLoop);
        
        // Setup listener on new active video
        setTimeout(() => setupCrossfade(), 1000);
      }
    });
  }
  
  // Initialize crossfade system
  setupCrossfade();
}

// ================= STICKY NAVBAR =================
const heroFeatures = document.querySelector('.hero-features');
const hero = document.querySelector('.hero');

if (heroFeatures && hero) {
  const stickyClone = document.createElement('div');
  stickyClone.className = 'hero-features-sticky';
  stickyClone.innerHTML = heroFeatures.innerHTML;
  document.body.appendChild(stickyClone);

  let ticking = false;

  function updateStickyVisibility() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const shouldShow = heroBottom <= 0;

    stickyClone.classList.toggle('visible', shouldShow);
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
  updateStickyVisibility();
}
