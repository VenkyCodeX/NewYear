const btn = document.getElementById("surpriseBtn");
const entry = document.getElementById("entry");
const celebration = document.getElementById("celebration");
const music = document.getElementById("bgMusic");

/* ================= CONFETTI ================= */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const rect = celebration.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

window.addEventListener("resize", () => {
  resizeCanvas();
  if (celebration.classList.contains("hidden") === false) {
    initImages(); // re-init on orientation change
  }
});

const CONFETTI_COUNT = window.innerWidth < 500 ? 120 : 200;
let confetti = [];

function startConfetti() {
  resizeCanvas();
  confetti = [];

  for (let i = 0; i < CONFETTI_COUNT; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 2,
      d: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 360},100%,50%)`
    });
  }
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();

    c.y += c.d;
    if (c.y > canvas.height) c.y = 0;
  });

  requestAnimationFrame(animateConfetti);
}

/* ================= FLOATING IMAGES (STRICT MOBILE SAFE) ================= */
const images = document.querySelectorAll(".floating-images img");

let balls = [];
let SIZE = 160;
const TOP_PADDING = 70;
const EDGE_PADDING = 4;

function initImages() {
  balls = [];

  const rect = celebration.getBoundingClientRect();
  const isMobile = rect.width < 600;
  const SPEED_MIN = isMobile ? 0.08 : 0.15;
const SPEED_RANGE = isMobile ? 0.12 : 0.25;


  SIZE = isMobile ? rect.width / 3.2 : 170;

  images.forEach(img => {
    img.style.width = SIZE + "px";
    img.style.height = SIZE + "px";

    const x = Math.random() * (rect.width - SIZE);
    const y =
      Math.random() * (rect.height - SIZE - TOP_PADDING) + TOP_PADDING;

    balls.push({
      el: img,
      x,
      y,
      vx: (Math.random() * SPEED_RANGE + SPEED_MIN) * (Math.random() > 0.5 ? 1 : -1),
      vy: (Math.random() * SPEED_RANGE + SPEED_MIN) * (Math.random() > 0.5 ? 1 : -1),

      r: SIZE / 2
    });
  });
}

function animateImages() {
  if (!balls.length) return;

  const rect = celebration.getBoundingClientRect();

  balls.forEach((b, i) => {
    b.x += b.vx;
    b.y += b.vy;

    /* HARD CONTAINER BOUNDS */
    if (b.x <= 0 + EDGE_PADDING) {
      b.x = EDGE_PADDING;
      b.vx *= -1;
    }
    if (b.x + SIZE >= rect.width - EDGE_PADDING) {
      b.x = rect.width - SIZE - EDGE_PADDING;
      b.vx *= -1;
    }

    if (b.y <= TOP_PADDING) {
      b.y = TOP_PADDING;
      b.vy *= -1;
    }
    if (b.y + SIZE >= rect.height - EDGE_PADDING) {
      b.y = rect.height - SIZE - EDGE_PADDING;
      b.vy *= -1;
    }

    /* IMAGE COLLISIONS */
    for (let j = i + 1; j < balls.length; j++) {
      const b2 = balls[j];
      const dx = b2.x - b.x;
      const dy = b2.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = b.r + b2.r + 6;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const overlap = minDist - dist;

        const ox = Math.cos(angle) * overlap / 2;
        const oy = Math.sin(angle) * overlap / 2;

        b.x -= ox;
        b.y -= oy;
        b2.x += ox;
        b2.y += oy;

        [b.vx, b2.vx] = [b2.vx, b.vx];
        [b.vy, b2.vy] = [b2.vy, b.vy];
      }
    }

    b.el.style.left = b.x + "px";
    b.el.style.top = b.y + "px";
  });

  requestAnimationFrame(animateImages);
}

/* ================= BUTTON ================= */
btn.addEventListener("click", () => {
  entry.style.display = "none";
  celebration.classList.remove("hidden");

  music.volume = 0.7;
  music.play().catch(() => {});

  startConfetti();
  initImages();
  animateImages();
});
