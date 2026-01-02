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

// ================= THICK GLOWING ENERGY LINES (Section 3: System Architecture) =================
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

  // Thick glowing energy line with massive bloom
  class EnergyLine {
    constructor(from, to, index) {
      this.from = from;
      this.to = to;
      this.index = index;
      this.opacity = 0;
      this.maxOpacity = 0.85;
      this.flowOffset = Math.random() * Math.PI * 2;
    }

    draw(time) {
      const dx = this.to.x - this.from.x;
      const dy = this.to.y - this.from.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Perpendicular vector for curve
      const perpX = -dy / distance;
      const perpY = dx / distance;
      
      // Gentle curve
      const curveAmount = distance * 0.12;
      
      const midX = (this.from.x + this.to.x) / 2;
      const midY = (this.from.y + this.to.y) / 2;
      
      // Subtle breathing animation
      const breathe = Math.sin(time * 0.001 + this.flowOffset) * 10;
      
      const controlX = midX + perpX * (curveAmount + breathe);
      const controlY = midY + perpY * (curveAmount + breathe);

      // Pulsing opacity
      this.opacity = this.maxOpacity * (0.7 + 0.3 * Math.sin(time * 0.0012 + this.flowOffset));

      ctx.save();
      
      // Draw multiple layers for THICK bloom effect
      const layers = [
        { width: 30, opacity: 0.08, blur: 40 },   // Outer massive glow
        { width: 20, opacity: 0.15, blur: 30 },   // Mid glow
        { width: 12, opacity: 0.25, blur: 20 },   // Inner glow
        { width: 6, opacity: 0.5, blur: 12 },     // Core glow
        { width: 3, opacity: 0.8, blur: 6 },      // Bright center
        { width: 1.5, opacity: 1, blur: 0 }       // Sharp core
      ];

      layers.forEach(layer => {
        ctx.beginPath();
        ctx.moveTo(this.from.x, this.from.y);
        ctx.quadraticCurveTo(
          controlX,
          controlY,
          this.to.x,
          this.to.y
        );
        
        const layerOpacity = this.opacity * layer.opacity;
        ctx.strokeStyle = `rgba(100, 180, 255, ${layerOpacity})`;
        ctx.lineWidth = layer.width;
        ctx.shadowBlur = layer.blur;
        ctx.shadowColor = `rgba(100, 180, 255, ${layerOpacity * 0.8})`;
        ctx.stroke();
      });
      
      ctx.restore();
    }
  }

  // Create energy lines
  const energyLines = [];
  let centerHub, moduleCards;

  function initEnergyLines() {
    centerHub = document.querySelector('.center-hub');
    moduleCards = document.querySelectorAll('.module-card');

    if (!centerHub || moduleCards.length === 0) return;

    const centerPos = getElementCenter(centerHub);

    moduleCards.forEach((card, index) => {
      const cardPos = getElementCenter(card);
      energyLines.push(new EnergyLine(centerPos, cardPos, index));
    });
  }

  setTimeout(initEnergyLines, 100);

  // Animation loop
  function animateLines() {
    const currentTime = Date.now();

    ctx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);

    energyLines.forEach(line => {
      line.draw(currentTime);
    });

    requestAnimationFrame(animateLines);
  }

  setTimeout(() => {
    if (energyLines.length > 0) {
      animateLines();
    }
  }, 200);

  // Reinitialize on resize
  window.addEventListener('resize', () => {
    resizeCanvas();
    energyLines.length = 0;
    setTimeout(initEnergyLines, 100);
  });
}
