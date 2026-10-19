// Interactive Scratch Card with Canvas Physics & Confetti Celebration
// Reveals the Auspicious Pakistani Wedding Date

class WeddingScratchCard {
  constructor(canvasId, containerId, onRevealCallback) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    this.onReveal = onRevealCallback;
    this.ctx = this.canvas ? this.canvas.getContext('2d', { willReadFrequently: true }) : null;
    this.isDrawing = false;
    this.isRevealed = false;
    this.lastSoundTime = 0;
    this.foilImage = new Image();
    this.foilImage.src = 'assets/images/gold_foil.jpg';
    this.foilLoaded = false;
    this.totalPixels = 0;
    this.scratchedPixels = 0;

    this.foilImage.onload = () => {
      this.foilLoaded = true;
      this.init();
    };
    this.foilImage.onerror = () => {
      // Fallback gradient if image fails
      this.foilLoaded = false;
      this.init();
    };

    window.addEventListener('resize', () => {
      if (!this.isRevealed) {
        this.resizeCanvas();
      }
    });
  }

  init() {
    if (!this.canvas) return;
    this.resizeCanvas();
    this.attachEvents();
  }

  resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // Set actual canvas resolution
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    
    // Scale context to match CSS pixels
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;

    this.drawCover();
  }

  drawCover() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    if (this.foilLoaded) {
      // Draw luxury gold foil image
      ctx.drawImage(this.foilImage, 0, 0, w, h);
      
      // Add metallic golden overlay tint
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
      grad.addColorStop(0.5, 'rgba(255, 235, 140, 0.6)');
      grad.addColorStop(1, 'rgba(170, 119, 28, 0.5)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else {
      // Rich metallic gold gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#B38728');
      grad.addColorStop(0.25, '#FBF5B7');
      grad.addColorStop(0.5, '#DAA520');
      grad.addColorStop(0.75, '#AA771C');
      grad.addColorStop(1, '#FFDF73');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Mughal Arch Golden Border on foil
    ctx.strokeStyle = '#6A4305';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    ctx.strokeStyle = '#FFE882';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    // Decorative corner diamonds
    const corners = [
      [24, 24], [w - 24, 24], [24, h - 24], [w - 24, h - 24]
    ];
    ctx.fillStyle = '#FFE882';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Center Badge / Stamp
    const badgeW = Math.min(w * 0.78, 340);
    const badgeH = 110;
    const badgeX = (w - badgeW) / 2;
    const badgeY = (h - badgeH) / 2;

    ctx.fillStyle = 'rgba(28, 11, 16, 0.85)';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16);
    ctx.fill();

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Calligraphy / Scratch instructions
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFDF73';
    ctx.font = 'bold 22px "Amiri", "Playfair Display", serif';
    ctx.fillText('✨ تاریخِ مبارک معلوم کریں ✨', w / 2, badgeY + 40);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('RUB / SCRATCH WITH COIN OR FINGER', w / 2, badgeY + 68);

    ctx.fillStyle = '#E8BD56';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🪙 Tap & Rub to Reveal Wedding Date 🪙', w / 2, badgeY + 92);

    ctx.restore();
  }

  attachEvents() {
    const handleStart = (e) => {
      if (this.isRevealed) return;
      this.isDrawing = true;
      this.scratch(e);
    };

    const handleMove = (e) => {
      if (!this.isDrawing || this.isRevealed) return;
      this.scratch(e);
    };

    const handleEnd = () => {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.checkProgress();
    };

    // Pointer events (works for mouse and touch seamlessly)
    this.canvas.addEventListener('pointerdown', handleStart);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('pointercancel', handleEnd);

    // Prevent default touch behaviors like scrolling when scratching
    this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  scratch(e) {
    const pos = this.getPointerPos(e);
    const ctx = this.ctx;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    // Circular scratch with soft feathered edge
    const radius = Math.max(26, Math.min(this.width * 0.08, 42));
    const radGrad = ctx.createRadialGradient(pos.x, pos.y, radius * 0.4, pos.x, pos.y, radius);
    radGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');

    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Extra organic scratch jitter
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * radius * 0.8;
      const offsetY = (Math.random() - 0.5) * radius * 0.8;
      ctx.beginPath();
      ctx.arc(pos.x + offsetX, pos.y + offsetY, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Play scratch sound (throttled)
    const now = Date.now();
    if (now - this.lastSoundTime > 90) {
      if (window.weddingAudio) window.weddingAudio.playScratchSound();
      this.lastSoundTime = now;
      this.spawnScratchSparks(e.clientX, e.clientY);
    }
  }

  spawnScratchSparks(x, y) {
    const spark = document.createElement('div');
    spark.className = 'scratch-spark';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`);
    spark.style.setProperty('--dy', `${(Math.random() - 0.5) * 60 - 20}px`);
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
  }

  checkProgress() {
    if (this.isRevealed) return;

    // Fast sub-sampled pixel inspection
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.width;
    const h = this.canvas.height;
    const imgData = this.ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let transparentCount = 0;
    const stride = 16 * 4; // Check every 16th pixel for super smooth 60fps performance

    for (let i = 3; i < data.length; i += stride) {
      if (data[i] < 128) {
        transparentCount++;
      }
    }

    const totalSampled = data.length / stride;
    const percent = Math.min(100, Math.round((transparentCount / totalSampled) * 100));

    // Update UI progress
    const progressEl = document.getElementById('scratch-percent');
    const progressBar = document.getElementById('scratch-bar-fill');
    if (progressEl) progressEl.textContent = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;

    // If over 45% scratched, automatically reveal completely!
    if (percent >= 45) {
      this.revealDate();
    }
  }

  revealDate() {
    if (this.isRevealed) return;
    this.isRevealed = true;

    // Smoothly dissolve remaining foil
    this.canvas.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    this.canvas.style.opacity = '0';
    this.canvas.style.transform = 'scale(1.05)';
    this.canvas.style.pointerEvents = 'none';

    const promptText = document.getElementById('scratch-prompt');
    if (promptText) {
      promptText.innerHTML = '✨ <strong>Mubarak! Auspicious Wedding Dates Revealed!</strong> ✨';
      promptText.classList.add('revealed-glow');
    }

    const progressEl = document.getElementById('scratch-percent');
    if (progressEl) progressEl.textContent = '100% (Revealed!)';

    const revealedActions = document.getElementById('scratch-revealed-actions');
    if (revealedActions) revealedActions.classList.add('visible');

    // Trigger celebration sound & confetti
    if (window.weddingAudio) {
      window.weddingAudio.playCelebrationChime();
    }

    this.launchConfetti();

    if (typeof this.onReveal === 'function') {
      this.onReveal();
    }
  }

  reset() {
    this.isRevealed = false;
    this.canvas.style.transition = 'none';
    this.canvas.style.opacity = '1';
    this.canvas.style.transform = 'none';
    this.canvas.style.pointerEvents = 'auto';

    const progressEl = document.getElementById('scratch-percent');
    const progressBar = document.getElementById('scratch-bar-fill');
    const promptText = document.getElementById('scratch-prompt');
    const revealedActions = document.getElementById('scratch-revealed-actions');

    if (progressEl) progressEl.textContent = '0%';
    if (progressBar) progressBar.style.width = '0%';
    if (promptText) {
      promptText.innerHTML = '🪙 <strong>Rub or scratch the gold card below</strong> to reveal the official wedding dates!';
      promptText.classList.remove('revealed-glow');
    }
    if (revealedActions) revealedActions.classList.remove('visible');

    this.drawCover();
  }

  launchConfetti() {
    const colors = ['#D4AF37', '#FFDF73', '#9E1B32', '#C71585', '#0E4D3C', '#FFF', '#F5B027'];
    const container = document.body;

    for (let i = 0; i < 90; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti-piece';
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.left = `${Math.random() * 100}vw`;
      conf.style.top = '-20px';
      conf.style.width = `${Math.random() * 10 + 6}px`;
      conf.style.height = `${Math.random() * 14 + 8}px`;
      conf.style.animationDuration = `${Math.random() * 2.5 + 2}s`;
      conf.style.animationDelay = `${Math.random() * 0.4}s`;
      container.appendChild(conf);

      setTimeout(() => conf.remove(), 4500);
    }
  }
}

window.WeddingScratchCard = WeddingScratchCard;
