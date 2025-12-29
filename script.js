// Seamless video loop dengan restart sebelum video habis
const video = document.querySelector('.hero-video');

if (video) {
  video.addEventListener('timeupdate', function() {
    // Restart video 0.3 detik sebelum selesai untuk seamless loop
    if (video.duration - video.currentTime <= 0.3) {
      video.currentTime = 0;
      video.play();
    }
  });
  
  // Fallback: pastikan video selalu autoplay
  video.play().catch(e => {
    // Autoplay blocked, user needs to interact first
    console.log('Autoplay blocked:', e);
  });
}