/* ---- Typed Text ---- */
const phrases = ['Fullstack Developer', 'JavaScript Focused', 'Building Real Projects', 'Clean Code & UI'];
let pi = 0, ci = 0, deleting = false;
const el = document.getElementById('typed-text');

function typeLoop() {
  const word = phrases[pi];
  if (!deleting) {
    el.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    el.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 50 : 85);
}
typeLoop();

/* ---- Particles ---- */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.85 ? '#ff3b5c' : '#00ff87';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 80) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#00ff87';
        ctx.globalAlpha = (1 - d / 80) * 0.08;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animParticles);
}
animParticles();

/* ---- Scroll Reveal ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Skill bars
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      // Timeline items
      e.target.querySelectorAll('.timeline-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 150);
      });
      // Project cards
      e.target.querySelectorAll('.project-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 100);
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Also observe skill cards individually for bar animation
document.querySelectorAll('.skill-card').forEach(card => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
      }
    });
  }, { threshold: 0.3 }).observe(card);
});

/* ---- Form ---- */
function handleSubmit() {
  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const msg = document.getElementById('f-msg').value.trim();
  const msgEl = document.getElementById('form-msg');

  // Reset
  document.querySelectorAll('.form-input, .form-textarea').forEach(i => i.classList.remove('error'));
  msgEl.className = 'form-msg';

  if (!name || !email || !msg) {
    document.querySelectorAll('.form-input, .form-textarea').forEach(i => {
      if (!i.value.trim()) i.classList.add('error');
    });
    msgEl.textContent = '⚠️ Preencha todos os campos obrigatórios.';
    msgEl.className = 'form-msg error';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('f-email').classList.add('error');
    msgEl.textContent = '⚠️ Email inválido.';
    msgEl.className = 'form-msg error';
    return;
  }

  msgEl.textContent = '✅ Mensagem enviada com sucesso! Responderei em breve.';
  msgEl.className = 'form-msg success';
  document.getElementById('f-name').value = '';
  document.getElementById('f-email').value = '';
  document.getElementById('f-subject').value = '';
  document.getElementById('f-msg').value = '';
}

/* ---- Smooth nav links ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
