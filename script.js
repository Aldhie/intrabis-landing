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

// ================= SMOOTH CURVED FLOWING LINES (Section 3: System Architecture) =================
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

  // Smooth curved flowing line
  class FlowingLine {
    constructor(from, to, index) {
      this.from = from;
      this.to = to;
      this.index = index; // For offset
      this.opacity = 0;
      this.maxOpacity = 0.4;
      this.flowOffset = Math.random() * Math.PI * 2; // Random starting phase
    }

    draw(time) {
      const dx = this.to.x - this.from.x;
      const dy = this.to.y - this.from.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Perpendicular vector for curve offset
      const perpX = -dy / distance;
      const perpY = dx / distance;
      
      // Curve amount based on distance (gentle arc)
      const curveAmount = distance * 0.15;
      
      // Control point for smooth bezier curve
      const midX = (this.from.x + this.to.x) / 2;
      const midY = (this.from.y + this.to.y) / 2;
      
      // Add sine wave animation for flowing effect
      const waveOffset = Math.sin(time * 0.001 + this.flowOffset) * 20;
      
      const controlX = midX + perpX * (curveAmount + waveOffset);
      const controlY = midY + perpY * (curveAmount + waveOffset);

      // Pulsing opacity
      this.opacity = this.maxOpacity * (0.6 + 0.4 * Math.sin(time * 0.0015 + this.flowOffset));

      ctx.save();
      
      // Draw multiple parallel lines for thickness
      for (let i = 0; i < 3; i++) {
        const offset = (i - 1) * 1.5; // -1.5, 0, 1.5
        const lineOpacity = this.opacity * (i === 1 ? 1 : 0.5); // Center line brighter
        
        ctx.beginPath();
        ctx.moveTo(
          this.from.x + perpX * offset,
          this.from.y + perpY * offset
        );
        
        ctx.quadraticCurveTo(
          controlX + perpX * offset,
          controlY + perpY * offset,
          this.to.x + perpX * offset,
          this.to.y + perpY * offset
        );
        
        // Gradient stroke for glow effect
        ctx.strokeStyle = `rgba(100, 180, 255, ${lineOpacity})`;
        ctx.lineWidth = i === 1 ? 2 : 1;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(100, 180, 255, ${lineOpacity * 0.6})`;
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }

  // Create flowing lines
  const flowingLines = [];
  let centerHub, moduleCards;

  function initFlowingLines() {
    centerHub = document.querySelector('.center-hub');
    moduleCards = document.querySelectorAll('.module-card');

    if (!centerHub || moduleCards.length === 0) return;

    const centerPos = getElementCenter(centerHub);

    moduleCards.forEach((card, index) => {
      const cardPos = getElementCenter(card);
      flowingLines.push(new FlowingLine(centerPos, cardPos, index));
    });
  }

  // Wait for DOM to be ready
  setTimeout(initFlowingLines, 100);

  // Animation loop
  function animateLines() {
    const currentTime = Date.now();

    ctx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);

    // Draw all flowing lines
    flowingLines.forEach(line => {
      line.draw(currentTime);
    });

    requestAnimationFrame(animateLines);
  }

  // Start animation after lines are initialized
  setTimeout(() => {
    if (flowingLines.length > 0) {
      animateLines();
    }
  }, 200);

  // Reinitialize on resize
  window.addEventListener('resize', () => {
    resizeCanvas();
    flowingLines.length = 0;
    setTimeout(initFlowingLines, 100);
  });
}
