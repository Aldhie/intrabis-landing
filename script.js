const videoA = document.getElementById("videoA");
const videoB = document.getElementById("videoB");

let active = videoA;
let idle = videoB;

// Start first video
videoA.play();

setInterval(() => {
  if (!active.duration) return;

  // Trigger crossfade slightly before end
  if (active.duration - active.currentTime < 0.7) {
    idle.currentTime = 0;
    idle.play();

    idle.style.opacity = 1;
    active.style.opacity = 0;

    // Swap roles
    [active, idle] = [idle, active];
  }
}, 200);
