// ================= SEAMLESS VIDEO CROSSFADE LOOP =================
// Uses 2 video layers that crossfade for buttery smooth loop

const video1 = document.querySelector('.hero-video-1');
const video2 = document.querySelector('.hero-video-2');

if (video1 && video2) {
  // Set playback speed to 0.75x (subtle slow motion)
  video1.playbackRate = 0.75;
  video2.playbackRate = 0.75;
  
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
        inactiveVideo.playbackRate = 0.75; // Ensure same speed
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

// ================= CANVAS INTERACTIVE PARTICLES (Section 2) =================
const canvas = document.getElementById('particles-canvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const section = canvas.parentElement;
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle system
  const particles = [];
  const particleCount = 60;
  const connectionDistance = 150;
  const mouse = { x: null, y: null, radius: 100 };

  // Mouse tracking
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  section.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
      // Mouse interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.vx -= (dx / dist) * force * 0.5;
          this.vy -= (dy / dist) * force * 0.5;
        }
      }

      // Boundaries
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Friction
      this.vx *= 0.98;
      this.vy *= 0.98;

      // Movement
      this.x += this.vx;
      this.y += this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 150, 255, 0.5)';
      ctx.fill();
      
      // Glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(100, 150, 255, 0.3)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();

    requestAnimationFrame(animate);
  }

  animate();
}

// ================= LIGHTNING CONNECTIONS (Section 3: System Architecture) =================
const lightningCanvas = document.getElementById('lightning-canvas');

if (lightningCanvas) {
  const ctx = lightningCanvas.getContext('2d');
  const section = lightningCanvas.parentElement;
  
  function resizeCanvas() {
    lightningCanvas.width = section.offsetWidth;
    lightningCanvas.height = section.offsetHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Get positions of center hub and module cards
  function getElementCenter(element) {
    const rect = element.getBoundingClientRect();
    const parentRect = section.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - parentRect.left,
      y: rect.top + rect.height / 2 - parentRect.top
    };
  }

  // Lightning bolt generator
  class Lightning {
    constructor(from, to) {
      this.from = from;
      this.to = to;
      this.segments = [];
      this.opacity = 0;
      this.maxOpacity = 0.6;
      this.generateBolt();
    }

    generateBolt() {
      this.segments = [];
      const dx = this.to.x - this.from.x;
      const dy = this.to.y - this.from.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.floor(dist / 20);

      this.segments.push({ x: this.from.x, y: this.from.y });

      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const x = this.from.x + dx * t + (Math.random() - 0.5) * 15;
        const y = this.from.y + dy * t + (Math.random() - 0.5) * 15;
        this.segments.push({ x, y });
      }

      this.segments.push({ x: this.to.x, y: this.to.y });
    }

    draw() {
      if (this.segments.length < 2) return;

      ctx.save();
      ctx.strokeStyle = `rgba(100, 180, 255, ${this.opacity})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(100, 180, 255, ${this.opacity * 0.8})`;

      ctx.beginPath();
      ctx.moveTo(this.segments[0].x, this.segments[0].y);

      for (let i = 1; i < this.segments.length; i++) {
        ctx.lineTo(this.segments[i].x, this.segments[i].y);
      }

      ctx.stroke();

      // Draw glow line (thicker, more transparent)
      ctx.strokeStyle = `rgba(100, 180, 255, ${this.opacity * 0.3})`;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.restore();
    }

    pulse(time) {
      // Pulsing opacity animation
      this.opacity = this.maxOpacity * (0.5 + 0.5 * Math.sin(time * 0.002 + this.from.x));
    }
  }

  // Create lightning bolts
  const lightnings = [];
  let centerHub, moduleCards;

  function initLightnings() {
    centerHub = document.querySelector('.center-hub');
    moduleCards = document.querySelectorAll('.module-card');

    if (!centerHub || moduleCards.length === 0) return;

    const centerPos = getElementCenter(centerHub);

    moduleCards.forEach(card => {
      const cardPos = getElementCenter(card);
      lightnings.push(new Lightning(centerPos, cardPos));
    });
  }

  // Wait for DOM to be ready
  setTimeout(initLightnings, 100);

  // Animation loop
  let lastTime = Date.now();
  let regenerateTimer = 0;

  function animateLightning() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    ctx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);

    // Regenerate bolts occasionally for variation
    regenerateTimer += deltaTime;
    if (regenerateTimer > 3000) {
      lightnings.forEach(lightning => lightning.generateBolt());
      regenerateTimer = 0;
    }

    // Draw and animate
    lightnings.forEach(lightning => {
      lightning.pulse(currentTime);
      lightning.draw();
    });

    requestAnimationFrame(animateLightning);
  }

  // Start animation after lightnings are initialized
  setTimeout(() => {
    if (lightnings.length > 0) {
      animateLightning();
    }
  }, 200);

  // Reinitialize on resize
  window.addEventListener('resize', () => {
    resizeCanvas();
    lightnings.length = 0;
    setTimeout(initLightnings, 100);
  });
}
