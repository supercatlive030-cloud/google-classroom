/* ========================================
   ===== CAT ARCADE NEON ENHANCEMENTS =====
   ======================================== */

// ---------- PARTICLE SYSTEM ----------
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.container = document.querySelector('.pawprint-container');
  }

  createPawprint(x, y) {
    const pawprint = document.createElement('div');
    pawprint.className = 'pawprint';
    pawprint.textContent = '🐾';
    pawprint.style.left = x + 'px';
    pawprint.style.top = y + 'px';
    this.container.appendChild(pawprint);

    let opacity = 1;
    let scale = 1;
    let vx = (Math.random() - 0.5) * 4;
    let vy = Math.random() * 2 - 3;

    const animate = () => {
      opacity -= 0.02;
      scale -= 0.01;
      x += vx;
      y += vy;
      vy += 0.1;

      pawprint.style.opacity = opacity;
      pawprint.style.transform = `translate(${x}px, ${y}px) scale(${Math.max(0, scale)})`;

      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        pawprint.remove();
      }
    };
    animate();
  }

  spawnRandomPawprints() {
    if (Math.random() > 0.7) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      this.createPawprint(x, y);
    }
  }
}

const particleSystem = new ParticleSystem();

// ---------- CURSOR TRAIL ----------
class CursorTrail {
  constructor() {
    this.canvas = document.getElementById('cursorTrail');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.particles = [];
    
    this.animate();
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  createParticle(x, y) {
    this.particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 1,
      life: 1,
      size: Math.random() * 3 + 2
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => {
      p.life -= 0.02;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;

      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, `rgba(0, 255, 136, ${p.life * 0.8})`);
      gradient.addColorStop(1, `rgba(0, 255, 136, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      return p.life > 0;
    });

    requestAnimationFrame(() => this.animate());
  }
}

const cursorTrail = new CursorTrail();

// ---------- CURSOR PARTICLE TRAIL ON MOVE ----------
document.addEventListener('mousemove', (e) => {
  if (cursorTrail.canvas) {
    cursorTrail.createParticle(e.clientX, e.clientY);
  }
  particleSystem.spawnRandomPawprints();
});

// ---------- SIMPLE GAME CARD CREATION ----------
const originalLoadGames = window.loadGames;
window.loadGames = function() {
  const grid = document.getElementById('gamesGrid');
  grid.innerHTML = '';

  games.forEach((game, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = (index * 0.05) + 's';
    card.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 10px;">🎮</div>
      <h3>${game.title}</h3>
      <a href="${game.path}" target="_blank" onclick="playSound(); showLoadingAnimation(); setTimeout(() => hideLoadingAnimation(), 1500); event.stopPropagation();">Play</a>
    `;
    grid.appendChild(card);
  });
};

// ---------- ENHANCED PAGE SWITCHING WITH PARTICLES ----------
const originalShowPageFunc = window.showPage;
window.showPage = function(pageId) {
  playSoundEffect('click');
  
  // Trigger particle burst on page switch
  for (let i = 0; i < 20; i++) {
    particleSystem.createPawprint(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight
    );
  }
  
  originalShowPageFunc(pageId);
};

// ---------- INITIALIZATION ----------
window.addEventListener('load', () => {
  // Initialize cat panel as hidden
  const catPanel = document.getElementById('catPanel');
  if (catPanel) {
    catPanel.style.display = 'none';
  }
  
  // Add interactive shine effects to buttons
  document.querySelectorAll('.nav-button, .glowing-button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.8), inset 0 0 20px rgba(0, 255, 136, 0.2)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = 'none';
    });
  });
});

/* ========================================
   ===== ORIGINAL CAT ARCADE FEATURES =====
   ======================================== */


const catFacts = [
  "🐱 Cats can rotate their ears 180 degrees!",
  "🐱 A cat's purr vibrates at a frequency that may promote bone healing.",
  "🐱 Cats have a specialized collarbone that allows them to squeeze through tight spaces.",
  "🐱 A cat's sense of smell is 14 times stronger than humans!",
  "🐱 Cats spend 70% of their lives sleeping or in a state of rest.",
  "🐱 A cat's heart beats almost twice as fast as a human heart.",
  "🐱 Cats have a unique nose print, like human fingerprints!",
  "🐱 Cats can jump up to 6 times their own length.",
  "🐱 A cat's lifespan is often considered 9 times a human year.",
  "🐱 Cats have 32 muscles in each ear!",
  "🐱 Indoor cats can live 12-18 years, while outdoor cats live 2-5 years.",
  "🐱 Cats can't taste sweetness.",
  "🐱 A group of cats is called a 'clowder'.",
  "🐱 Cats have excellent night vision, seeing in light levels 6 times lower than humans need.",
  "🐱 Ancient Egyptians shaved their eyebrows when their cats died as a sign of mourning."
];

// ---------- CAT ASSISTANT ----------
function toggleCatPanel() {
  const panel = document.getElementById('catPanel');
  playSoundEffect('meow');
  
  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    getNewCatFact();
  } else {
    panel.style.display = 'none';
  }
}

function getNewCatFact() {
  const factElement = document.getElementById('catFact');
  const randomFact = catFacts[Math.floor(Math.random() * catFacts.length)];
  
  factElement.style.opacity = '0';
  setTimeout(() => {
    factElement.textContent = randomFact;
    factElement.style.transition = 'opacity 0.3s ease';
    factElement.style.opacity = '1';
  }, 150);
  
  playSoundEffect('meow');
}

// ---------- SOUND EFFECTS ----------
function playSoundEffect(type) {
  if (typeof soundEnabled === 'undefined' || !soundEnabled) return;
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    switch(type) {
      case 'meow':
        playMeow(audioContext, now);
        break;
      case 'click':
        playClick(audioContext, now);
        break;
      case 'unlock':
        playUnlock(audioContext, now);
        break;
      case 'launch':
        playLaunch(audioContext, now);
        break;
    }
  } catch(e) {
    console.log('Audio context error:', e);
  }
}

function playMeow(ctx, now) {
  // Create multiple oscillators for a richer meow sound
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();
  const masterGain = ctx.createGain();
  
  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(masterGain);
  gain2.connect(masterGain);
  masterGain.connect(ctx.destination);
  
  // First frequency sweep (main meow)
  osc1.frequency.setValueAtTime(250, now);
  osc1.frequency.exponentialRampToValueAtTime(400, now + 0.15);
  osc1.frequency.exponentialRampToValueAtTime(150, now + 0.4);
  
  gain1.gain.setValueAtTime(0.25, now);
  gain1.gain.exponentialRampToValueAtTime(0.3, now + 0.15);
  gain1.gain.exponentialRampToValueAtTime(0.05, now + 0.4);
  
  // Second frequency (harmonic)
  osc2.frequency.setValueAtTime(500, now);
  osc2.frequency.exponentialRampToValueAtTime(650, now + 0.15);
  osc2.frequency.exponentialRampToValueAtTime(300, now + 0.4);
  
  gain2.gain.setValueAtTime(0.1, now);
  gain2.gain.exponentialRampToValueAtTime(0.15, now + 0.15);
  gain2.gain.exponentialRampToValueAtTime(0.02, now + 0.4);
  
  masterGain.gain.setValueAtTime(0.3, now);
  masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
  
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.4);
  osc2.stop(now + 0.4);
}

function playClick(ctx, now) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.frequency.setValueAtTime(800, now);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
  
  osc.start(now);
  osc.stop(now + 0.1);
}

function playUnlock(ctx, now) {
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(freq, now + i * 0.1);
    gain.gain.setValueAtTime(0.2, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
    
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.2);
  });
}

function playLaunch(ctx, now) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(1000, now + 0.3);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  
  osc.start(now);
  osc.stop(now + 0.3);
}

// ---------- LOADING ANIMATION ----------
function showLoadingAnimation() {
  const overlay = document.getElementById('gameLoadingOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
    playSoundEffect('launch');
  }
}

function hideLoadingAnimation() {
  const overlay = document.getElementById('gameLoadingOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// ---------- PARALLAX BACKGROUND EFFECT ----------
document.addEventListener('mousemove', (e) => {
  const shapes = document.querySelectorAll('.neon-shape');
  const x = (e.clientX / window.innerWidth) * 20;
  const y = (e.clientY / window.innerHeight) * 20;
  
  shapes.forEach((shape, i) => {
    const speed = 0.5 + i * 0.1;
    shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});

// ---------- ENHANCED PAGE SWITCHING WITH SOUND ----------
const originalShowPage = window.showPage;
if (originalShowPage) {
  window.showPage = function(pageId) {
    playSoundEffect('click');
    originalShowPage(pageId);
  };
}

// ---------- GAME LAUNCH SOUNDS ----------
document.addEventListener('click', function(e) {
  if (e.target.closest('.card a')) {
    playSoundEffect('launch');
    showLoadingAnimation();
    setTimeout(() => hideLoadingAnimation(), 1500);
  }
});

// ---------- INITIALIZE EFFECTS ON PAGE LOAD ----------
window.addEventListener('load', () => {
  // Initialize cat panel as hidden
  const catPanel = document.getElementById('catPanel');
  if (catPanel) {
    catPanel.style.display = 'none';
  }
  
  // Add glowing effect to nav buttons
  document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.4)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    });
  });
  
  // Apply card glow effect
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.card')) {
      const card = e.target.closest('.card');
      card.style.borderColor = '#00ff88';
    }
  });
  
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.card')) {
      const card = e.target.closest('.card');
      card.style.borderColor = 'var(--border-color)';
    }
  });
});