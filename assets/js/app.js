// Master Application Logic for Royal Pakistani Wedding Invitation
// Features: 3D Envelope Opening, Perspective Switcher (Larkay Walay vs Larki Walay),
// Personalized Guest Dawat-Nama, Interactive Dholak Drum Machine,
// Joota Chupai Negotiator Fun Meter, Mubarakbaad & Duas Wall, and In-Browser Live Editor

const DEFAULT_CONFIG = {
  groomName: "Hamza Tariq",
  brideName: "Ayesha Farooq",
  groomParents: "Mr. & Mrs. Tariq Mahmood Khan",
  brideParents: "Mr. & Mrs. Farooq Ahmed Siddiqui",
  whatsappNumber: "923001234567",
  weddingDate: "2026-12-18T20:00:00",
  events: {
    mehndi: {
      title: "رسمِ حنا — Mehndi & Sangeet",
      dateStr: "Wednesday, 16th December 2026",
      time: "07:30 PM Onwards",
      venue: "Haveli Marquee, Gulberg Greens, Islamabad",
      dressCode: "Festive Saffron, Mustard Yellow, Peacock Teal & Dholki Kurtas",
      mapUrl: "https://maps.google.com/?q=Islamabad"
    },
    baraat: {
      title: "بارات و رخصتی — Grand Baraat",
      dateStr: "Friday, 18th December 2026",
      time: "08:00 PM Sharp",
      venue: "Serena Grand Ballrooms, Club Road, Islamabad",
      dressCode: "Regal Maroon, Zari Formals, Royal Sherwanis & Designer Lehengas",
      mapUrl: "https://maps.google.com/?q=Serena+Hotel+Islamabad"
    },
    walima: {
      title: "دعوتِ ولیمہ — Walima Reception",
      dateStr: "Sunday, 20th December 2026",
      time: "08:00 PM Onwards",
      venue: "Islamabad Club Grand Lawns, Murree Road, Islamabad",
      dressCode: "Black Tie / Classic Suits, Champagne Pastels & Chic Elegance",
      mapUrl: "https://maps.google.com/?q=Islamabad+Club"
    }
  }
};

class RoyalWeddingApp {
  constructor() {
    this.config = this.loadConfig();
    this.currentSide = this.detectInitialSide();
    this.guestName = this.detectGuestName() || "معزز مہمانِ خاص (Honoured Guest)";
    this.blessings = this.loadBlessings();

    this.init();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem('pak_royal_wedding_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : { ...DEFAULT_CONFIG };
    } catch (e) {
      return { ...DEFAULT_CONFIG };
    }
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('pak_royal_wedding_config', JSON.stringify(this.config));
    this.applyConfig();
  }

  detectInitialSide() {
    const params = new URLSearchParams(window.location.search);
    const side = params.get('side');
    if (side === 'groom' || side === 'bride') return side;
    return localStorage.getItem('pak_wedding_side') || 'combined';
  }

  detectGuestName() {
    const params = new URLSearchParams(window.location.search);
    return params.get('guest') || localStorage.getItem('pak_guest_name');
  }

  setSide(side) {
    this.currentSide = side;
    localStorage.setItem('pak_wedding_side', side);

    document.querySelectorAll('.side-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.side === side);
    });

    this.updateSideContent();

    if (window.royalAudio) {
      window.royalAudio.playBell();
    }
  }

  init() {
    this.applyConfig();
    this.updateSideContent();
    this.initPerspectiveSwitch();
    this.initPersonalizedGuestCard();
    this.initCountdown();
    this.initScratchCard();
    this.initAudioWidget();
    this.initDholakWidget();
    this.initJootaChupaiGame();
    this.initDuasWall();
    this.initCustomizerModal();
    this.initCalendarButtons();
    this.initShareButtons();

    // Initialize 3D scene
    window.addEventListener('DOMContentLoaded', () => {
      if (window.Royal3DScene) {
        new window.Royal3DScene('scene-3d-container');
      }
    });
  }

  applyConfig() {
    document.querySelectorAll('.groom-name-txt').forEach(el => el.textContent = this.config.groomName);
    document.querySelectorAll('.bride-name-txt').forEach(el => el.textContent = this.config.brideName);

    const heroTitle = document.getElementById('hero-couple-title');
    if (heroTitle) {
      heroTitle.innerHTML = `<span class="royal-name">${this.config.groomName}</span> <span class="ampersand">&</span> <span class="royal-name">${this.config.brideName}</span>`;
    }

    const events = this.config.events;
    if (events) {
      if (document.getElementById('event-mehndi-date')) document.getElementById('event-mehndi-date').textContent = events.mehndi.dateStr;
      if (document.getElementById('event-mehndi-time')) document.getElementById('event-mehndi-time').textContent = events.mehndi.time;
      if (document.getElementById('event-mehndi-venue')) document.getElementById('event-mehndi-venue').textContent = events.mehndi.venue;

      if (document.getElementById('event-baraat-date')) document.getElementById('event-baraat-date').textContent = events.baraat.dateStr;
      if (document.getElementById('event-baraat-time')) document.getElementById('event-baraat-time').textContent = events.baraat.time;
      if (document.getElementById('event-baraat-venue')) document.getElementById('event-baraat-venue').textContent = events.baraat.venue;

      if (document.getElementById('event-walima-date')) document.getElementById('event-walima-date').textContent = events.walima.dateStr;
      if (document.getElementById('event-walima-time')) document.getElementById('event-walima-time').textContent = events.walima.time;
      if (document.getElementById('event-walima-venue')) document.getElementById('event-walima-venue').textContent = events.walima.venue;
    }

    const scratchDateEl = document.getElementById('scratch-revealed-date');
    if (scratchDateEl) {
      scratchDateEl.textContent = this.config.events.baraat.dateStr;
    }
  }

  updateSideContent() {
    const announcementBox = document.getElementById('side-announcement-content');
    const badge = document.getElementById('side-active-badge');

    if (!announcementBox) return;

    if (this.currentSide === 'groom') {
      badge.textContent = "لڑکے والے • Groom's Family Invitation";
      announcementBox.innerHTML = `
        <div class="invitation-text-royal">
          <p class="bismillah-calligraphy">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <div class="guest-salutation-line" id="guest-salutation-box">
            <span class="guest-salute-tag">محترم و مکرم جناب / محترمہ:</span>
            <span class="guest-salute-name" id="display-salute-name">${this.guestName}</span>
          </div>
          <p class="ayah-quote">"And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts."</p>
          <h3 class="host-names">${this.config.groomParents}</h3>
          <p class="lead-invite">
            request the honour of your gracious presence and heartfelt prayers at the auspicious wedding festivities of their beloved son
          </p>
          <div class="celebrated-couple">
            <span class="highlight-groom">${this.config.groomName}</span>
            <span class="knot-with">with</span>
            <span class="highlight-bride">${this.config.brideName}</span>
          </div>
          <p class="daughter-of">Daughter of ${this.config.brideParents}</p>
          <div class="side-special-highlight groom-theme">
            <span class="gold-sparkle-icon">✨</span>
            <span>You are cordially invited as cherished guests of the <strong>Groom's Family (لڑکے والے)</strong></span>
          </div>
        </div>
      `;
    } else if (this.currentSide === 'bride') {
      badge.textContent = "لڑکی والے • Bride's Family Invitation";
      announcementBox.innerHTML = `
        <div class="invitation-text-royal">
          <p class="bismillah-calligraphy">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <div class="guest-salutation-line" id="guest-salutation-box">
            <span class="guest-salute-tag">محترم و مکرم جناب / محترمہ:</span>
            <span class="guest-salute-name" id="display-salute-name">${this.guestName}</span>
          </div>
          <p class="ayah-quote">"And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts."</p>
          <h3 class="host-names">${this.config.brideParents}</h3>
          <p class="lead-invite">
            cordially invite you and your family to grace the joyous wedding ceremonies and Rukhsati of their cherished daughter
          </p>
          <div class="celebrated-couple">
            <span class="highlight-bride">${this.config.brideName}</span>
            <span class="knot-with">with</span>
            <span class="highlight-groom">${this.config.groomName}</span>
          </div>
          <p class="daughter-of">Son of ${this.config.groomParents}</p>
          <div class="side-special-highlight bride-theme">
            <span class="gold-sparkle-icon">✨</span>
            <span>You are cordially invited as honoured guests of the <strong>Bride's Family (لڑکی والے)</strong></span>
          </div>
        </div>
      `;
    } else {
      badge.textContent = "مشترکہ دعوت • Combined Families Invitation";
      announcementBox.innerHTML = `
        <div class="invitation-text-royal">
          <p class="bismillah-calligraphy">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <div class="guest-salutation-line" id="guest-salutation-box">
            <span class="guest-salute-tag">محترم و مکرم جناب / محترمہ:</span>
            <span class="guest-salute-name" id="display-salute-name">${this.guestName}</span>
          </div>
          <p class="ayah-quote">"And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts."</p>
          <h3 class="host-names">${this.config.groomParents} & ${this.config.brideParents}</h3>
          <p class="lead-invite">
            request the pleasure of your company to share in the joy of the auspicious union of their beloved children
          </p>
          <div class="celebrated-couple">
            <span class="highlight-groom">${this.config.groomName}</span>
            <span class="knot-with">&</span>
            <span class="highlight-bride">${this.config.brideName}</span>
          </div>
          <div class="side-special-highlight combined-theme">
            <span class="gold-sparkle-icon">✨</span>
            <span>Warmest welcome from <strong>Both Families (خان اور صدیقی خاندان)</strong></span>
          </div>
        </div>
      `;
    }
  }

  initPerspectiveSwitch() {
    const tabs = document.querySelectorAll('.side-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.setSide(tab.dataset.side);
      });
    });
  }

  // Personalized Guest Invitation Welcomer
  initPersonalizedGuestCard() {
    const input = document.getElementById('guest-name-input');
    const updateBtn = document.getElementById('apply-guest-name-btn');
    const shareBtn = document.getElementById('share-personal-card-btn');

    if (!input || !updateBtn) return;

    if (this.guestName && this.guestName !== "معزز مہمانِ خاص (Honoured Guest)") {
      input.value = this.guestName;
    }

    const applyName = () => {
      const name = input.value.trim();
      if (!name) return;
      this.guestName = name;
      localStorage.setItem('pak_guest_name', name);
      this.updateSideContent();

      if (window.royalAudio) {
        window.royalAudio.playCelebrationChime();
      }

      // Smooth scroll to card
      const card = document.getElementById('invitation-details');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
    };

    updateBtn.addEventListener('click', applyName);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyName();
    });

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const name = input.value.trim() || this.guestName;
        const url = `${window.location.origin}${window.location.pathname}?guest=${encodeURIComponent(name)}&side=${this.currentSide}`;
        navigator.clipboard.writeText(url).then(() => {
          alert(`📋 Personalized Wedding Invitation Link copied for "${name}"!\n\n${url}`);
        });
      });
    }
  }

  initCountdown() {
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minutesEl = document.getElementById('count-minutes');
    const secondsEl = document.getElementById('count-seconds');

    if (!daysEl) return;

    const targetDate = new Date(this.config.weddingDate).getTime();

    const updateTicker = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        const banner = document.getElementById('countdown-status-text');
        if (banner) banner.textContent = "🎉 The Royal Wedding Celebrations Have Commenced! 🎉";
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateTicker();
    setInterval(updateTicker, 1000);
  }

  initScratchCard() {
    if (window.WeddingScratchCard) {
      this.scratchCard = new window.WeddingScratchCard(
        'scratch-canvas',
        'scratch-card-wrapper',
        () => {
          const revealedSection = document.getElementById('scratch-revealed-content');
          if (revealedSection) {
            revealedSection.classList.add('active');
          }
        }
      );

      const resetBtn = document.getElementById('scratch-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.scratchCard.reset();
          if (window.royalAudio) window.royalAudio.playBell();
        });
      }
    }
  }

  initAudioWidget() {
    const musicBtn = document.getElementById('floating-music-btn');
    const musicStatus = document.getElementById('music-wave-indicator');

    if (!musicBtn) return;

    musicBtn.addEventListener('click', () => {
      if (window.royalAudio) {
        window.royalAudio.toggleMusic();
      }
    });

    // Auto attempt to start on first interaction
    const startAudioOnce = () => {
      if (window.royalAudio && !window.royalAudio.isPlaying) {
        window.royalAudio.playMusic();
      }
      window.removeEventListener('click', startAudioOnce);
      window.removeEventListener('touchstart', startAudioOnce);
    };

    window.addEventListener('click', startAudioOnce, { once: true });
    window.addEventListener('touchstart', startAudioOnce, { once: true });
  }

  // Interactive Dholak Drum Machine
  initDholakWidget() {
    const bayanBtn = document.getElementById('dhol-bayan-head');
    const dayanBtn = document.getElementById('dhol-dayan-head');
    const luddiBtn = document.getElementById('dhol-beat-luddi');
    const bhangraBtn = document.getElementById('dhol-beat-bhangra');
    const stopBeatsBtn = document.getElementById('dhol-beat-stop');

    let beatInterval = null;

    if (bayanBtn) {
      bayanBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        bayanBtn.classList.add('hit');
        setTimeout(() => bayanBtn.classList.remove('hit'), 150);
        if (window.royalAudio) window.royalAudio.playDholBayan();
      });
    }

    if (dayanBtn) {
      dayanBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        dayanBtn.classList.add('hit');
        setTimeout(() => dayanBtn.classList.remove('hit'), 150);
        if (window.royalAudio) window.royalAudio.playDholDayan();
      });
    }

    const drumInteractive = document.querySelector('.dholak-drum-interactive');

    // Preset Beat Rhythms - Real Recorded Dhol Audio
    const stopPattern = () => {
      if (window.royalAudio) {
        window.royalAudio.stopDholBeats();
      }
      if (luddiBtn) luddiBtn.classList.remove('active-beat');
      if (bhangraBtn) bhangraBtn.classList.remove('active-beat');
      if (drumInteractive) drumInteractive.classList.remove('playing-live-beat');
    };

    if (stopBeatsBtn) stopBeatsBtn.addEventListener('click', stopPattern);

    if (luddiBtn) {
      luddiBtn.addEventListener('click', () => {
        stopPattern();
        luddiBtn.classList.add('active-beat');
        if (drumInteractive) drumInteractive.classList.add('playing-live-beat');
        if (window.royalAudio) {
          window.royalAudio.playLuddiBeat();
        }
      });
    }

    if (bhangraBtn) {
      bhangraBtn.addEventListener('click', () => {
        stopPattern();
        bhangraBtn.classList.add('active-beat');
        if (drumInteractive) drumInteractive.classList.add('playing-live-beat');
        if (window.royalAudio) {
          window.royalAudio.playBhangraBeat();
        }
      });
    }
  }

  // Joota Chupai Negotiator Game
  initJootaChupaiGame() {
    const slider = document.getElementById('joota-amount-slider');
    const amountDisplay = document.getElementById('joota-amount-val');
    const commentBox = document.getElementById('joota-status-dialogue');
    const sideToggles = document.querySelectorAll('.joota-side-choice');

    if (!slider || !amountDisplay) return;

    let selectedCamp = "bride"; // or groom

    sideToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        sideToggles.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCamp = btn.dataset.camp;
        updateDialogue(parseInt(slider.value));
      });
    });

    const updateDialogue = (amt) => {
      amountDisplay.textContent = `PKR ${amt.toLocaleString()}`;

      let dialogue = "";
      if (selectedCamp === "bride") {
        if (amt < 15000) {
          dialogue = "🤦‍♀️ Dulhan ki behnein: 'Haye Allah! Itnay mein to jootay ki lais bhi nahi milegi jiju! Barhao!'";
        } else if (amt < 40000) {
          dialogue = "😏 Saaliyan: 'Thora or zorr lagao Dulha bhai! Hamari pyaari behn ka sawaal hai!'";
        } else if (amt < 70000) {
          dialogue = "💃 Saaliyan: 'Ab aayi na baat line pr! Lekin thori methai bhi sath chahiye!'";
        } else {
          dialogue = "👑 Saaliyan: 'Deal Shahi hai! Yeh pakro apna khussa aur jiju mubarak ho!' ✨💐";
        }
      } else {
        if (amt < 15000) {
          dialogue = "😎 Dulhe kay Dost: 'Yeh hoti hai na dosti! Sastay mein chutti karwa di!'";
        } else if (amt < 40000) {
          dialogue = "😅 Dulhay Walay: 'Bhabhi ki behno, reham khao! Hum nay baraat wapis bhi le kr jani hai!'";
        } else {
          dialogue = "💸 Dulhay Walay: 'Joota sona ka tha kia?! Loot lia bhai loot lia!' 😂";
        }
      }

      if (commentBox) commentBox.innerHTML = dialogue;
    };

    slider.addEventListener('input', (e) => {
      updateDialogue(parseInt(e.target.value));
    });

    updateDialogue(parseInt(slider.value));
  }

  // Mubarakbaad & Duas Wall
  loadBlessings() {
    const saved = localStorage.getItem('pak_royal_duas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 1,
        name: "Uncle Tariq & Chachi Shagufta",
        side: "groom",
        message: "ماشاءاللہ! Bohat bohat mubarak to both families! May Allah SWT bless Hamza & Ayesha with lifelong harmony, immense barakah, and happiness.",
        date: "Today",
        likes: 12
      },
      {
        id: 2,
        name: "Dr. Samina & Family",
        side: "bride",
        message: "Hamari pyaari Ayesha beti ko dheron duayein aur pyar! Farooq Bhai and Bhabhi Mubarak ho! Radiant couple!",
        date: "Yesterday",
        likes: 19
      },
      {
        id: 3,
        name: "Bilal & LUMS Alumni Squad",
        side: "groom",
        message: "Hamza bhai ki shadi! Looking forward to setting the dance floor on fire on Mehndi night! Mubarak brother!",
        date: "Oct 17",
        likes: 24
      }
    ];
  }

  initDuasWall() {
    this.renderDuas();

    const form = document.getElementById('wedding-dua-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const senderName = document.getElementById('dua-name-input').value.trim();
      const senderSide = document.getElementById('dua-side-input').value;
      const message = document.getElementById('dua-message-input').value.trim();

      if (!senderName || !message) {
        alert("Please enter your name and a heartfelt blessing message!");
        return;
      }

      const newDua = {
        id: Date.now(),
        name: senderName,
        side: senderSide,
        message: message,
        date: "Just now",
        likes: 1
      };

      this.blessings.unshift(newDua);
      localStorage.setItem('pak_royal_duas', JSON.stringify(this.blessings));
      this.renderDuas();

      if (window.royalAudio) {
        window.royalAudio.playCelebrationChime();
      }

      // Generate WhatsApp link to send dua directly to host
      const text = encodeURIComponent(
        `السلام علیکم!\n\n` +
        `Heartiest Mubarakbaad on the auspicious wedding of *${this.config.groomName} & ${this.config.brideName}*! 💐🤲\n\n` +
        `💌 *Dua & Wishes:* "${message}"\n\n` +
        `— *From:* ${senderName} (${senderSide === 'groom' ? "لڑکے والے" : senderSide === 'bride' ? "لڑکی والے" : "Family Friend"})\n\n` +
        `بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ`
      );

      const waUrl = `https://wa.me/${this.config.whatsappNumber}?text=${text}`;

      const banner = document.getElementById('dua-success-banner');
      if (banner) {
        banner.classList.add('visible');
        setTimeout(() => banner.classList.remove('visible'), 5000);
      }

      form.reset();

      // Open WhatsApp to deliver the Dua
      window.open(waUrl, '_blank');
    });
  }

  renderDuas() {
    const container = document.getElementById('duas-wall-cards');
    if (!container) return;

    container.innerHTML = this.blessings.map(b => `
      <div class="dua-card" data-3d-tilt>
        <div class="card-glare"></div>
        <div class="dua-card-header">
          <div class="dua-author-info">
            <span class="dua-author-name">${b.name}</span>
            <span class="dua-side-badge ${b.side}">
              ${b.side === 'groom' ? "لڑکے والے" : b.side === 'bride' ? "لڑکی والے" : "Family Friend"}
            </span>
          </div>
          <span class="dua-time-tag">${b.date}</span>
        </div>
        <p class="dua-card-msg">"${b.message}"</p>
        <div class="dua-card-footer">
          <span class="dua-blessing-icon">🤲 بارک اللہ</span>
          <button class="dua-heart-btn" onclick="window.weddingApp.likeDua(${b.id})">
            ❤️ <span>${b.likes || 1}</span>
          </button>
        </div>
      </div>
    `).join('');

    if (window.royal3DScene && window.royal3DScene.init3DCardTilt) {
      window.royal3DScene.init3DCardTilt();
    }
  }

  likeDua(id) {
    const item = this.blessings.find(b => b.id === id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      localStorage.setItem('pak_royal_duas', JSON.stringify(this.blessings));
      this.renderDuas();
      if (window.royalAudio) window.royalAudio.playBell();
    }
  }

  initCustomizerModal() {
    const modal = document.getElementById('customizer-modal');
    const openBtn = document.getElementById('open-customizer-btn');
    const closeBtn = document.getElementById('close-customizer-btn');
    const saveBtn = document.getElementById('save-customizer-btn');
    const resetBtn = document.getElementById('reset-customizer-btn');

    if (!modal || !openBtn) return;

    const populateInputs = () => {
      document.getElementById('edit-groom-name').value = this.config.groomName;
      document.getElementById('edit-bride-name').value = this.config.brideName;
      document.getElementById('edit-groom-parents').value = this.config.groomParents;
      document.getElementById('edit-bride-parents').value = this.config.brideParents;
      document.getElementById('edit-whatsapp').value = this.config.whatsappNumber;
      document.getElementById('edit-baraat-date').value = this.config.events.baraat.dateStr;
      document.getElementById('edit-baraat-venue').value = this.config.events.baraat.venue;
    };

    openBtn.addEventListener('click', () => {
      populateInputs();
      modal.classList.add('open');
      if (window.royalAudio) window.royalAudio.playBell();
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });

    saveBtn.addEventListener('click', () => {
      const updated = {
        groomName: document.getElementById('edit-groom-name').value.trim() || this.config.groomName,
        brideName: document.getElementById('edit-bride-name').value.trim() || this.config.brideName,
        groomParents: document.getElementById('edit-groom-parents').value.trim() || this.config.groomParents,
        brideParents: document.getElementById('edit-bride-parents').value.trim() || this.config.brideParents,
        whatsappNumber: document.getElementById('edit-whatsapp').value.trim() || this.config.whatsappNumber,
        events: {
          ...this.config.events,
          baraat: {
            ...this.config.events.baraat,
            dateStr: document.getElementById('edit-baraat-date').value.trim() || this.config.events.baraat.dateStr,
            venue: document.getElementById('edit-baraat-venue').value.trim() || this.config.events.baraat.venue
          }
        }
      };

      this.saveConfig(updated);
      this.updateSideContent();
      modal.classList.remove('open');

      if (window.royalAudio) {
        window.royalAudio.playCelebrationChime();
      }
      alert("✨ Royal Wedding Invitation details updated successfully!");
    });

    resetBtn.addEventListener('click', () => {
      if (confirm("Reset invitation details back to original defaults?")) {
        localStorage.removeItem('pak_royal_wedding_config');
        this.config = { ...DEFAULT_CONFIG };
        this.applyConfig();
        this.updateSideContent();
        populateInputs();
        modal.classList.remove('open');
      }
    });
  }

  initCalendarButtons() {
    const addToCalBtns = document.querySelectorAll('[data-add-calendar]');
    addToCalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const eventKey = btn.dataset.addCalendar;
        const ev = this.config.events[eventKey];
        if (!ev) return;

        const title = encodeURIComponent(`${this.config.groomName} & ${this.config.brideName}'s Wedding — ${ev.title}`);
        const details = encodeURIComponent(`You are cordially invited to celebrate ${ev.title}. Dress Code: ${ev.dressCode}. Looking forward to your warm presence!`);
        const location = encodeURIComponent(ev.venue);

        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
        window.open(gcalUrl, '_blank');
      });
    });
  }

  initShareButtons() {
    const shareGroom = document.getElementById('share-groom-link');
    const shareBride = document.getElementById('share-bride-link');
    const shareWhatsApp = document.getElementById('share-whatsapp-btn');

    const getBaseUrl = () => window.location.origin + window.location.pathname;

    if (shareGroom) {
      shareGroom.addEventListener('click', () => {
        const link = `${getBaseUrl()}?side=groom`;
        navigator.clipboard.writeText(link).then(() => {
          alert("📋 Groom's Family Invitation Link copied to clipboard!\n\n" + link);
        });
      });
    }

    if (shareBride) {
      shareBride.addEventListener('click', () => {
        const link = `${getBaseUrl()}?side=bride`;
        navigator.clipboard.writeText(link).then(() => {
          alert("📋 Bride's Family Invitation Link copied to clipboard!\n\n" + link);
        });
      });
    }

    if (shareWhatsApp) {
      shareWhatsApp.addEventListener('click', () => {
        const url = window.location.href;
        const msg = encodeURIComponent(
          `✨ *Royal Pakistani Wedding Invitation* ✨\n\n` +
          `You are cordially invited to celebrate the wedding of *${this.config.groomName} & ${this.config.brideName}*! 💐\n\n` +
          `Open the 3D Royal Wax Sealed Envelope, scratch the gold card to reveal wedding dates, and view venues here:\n${url}\n\n` +
          `دعوت نامہ • We eagerly anticipate your warm presence & heartfelt prayers! 🤲`
        );
        window.open(`https://wa.me/?text=${msg}`, '_blank');
      });
    }
  }
}

// Global App bootstrap
window.weddingApp = new RoyalWeddingApp();
