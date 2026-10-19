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
  weddingHashtag: "#HamzaWedsAyesha",
  weddingTagline: "Cordially Invite You to Share in the Joy of Their Wedding",
  theme: "theme-crimson",
  petalCount: 1348,
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
  },
  eSalami: {
    enabled: true,
    raastId: "0333-2568818",
    raastTitle: "Muhammad Tariq Khan",
    walletNo: "0333-2568818",
    walletTitle: "Hamza Tariq",
    bankIban: "PK64ALFH0001001004812345",
    bankTitle: "Hamza Tariq (Groom)"
  },
  agency: {
    agencyName: "Royal Nikah Digital Studio",
    agencyWhatsapp: "923332568818",
    badge: "enabled"
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
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          events: { ...DEFAULT_CONFIG.events, ...(parsed.events || {}) },
          eSalami: { ...DEFAULT_CONFIG.eSalami, ...(parsed.eSalami || {}) },
          agency: { ...DEFAULT_CONFIG.agency, ...(parsed.agency || {}) }
        };
      }
      return { ...DEFAULT_CONFIG };
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
    this.initPetalShower();
    this.initShagunLifafa();
    this.initRoyalGallery();
    this.initAgencyStudio();
    this.initCalendarButtons();
    this.initShareButtons();
    this.initRoyalGuide();

    // Initialize 3D scene
    window.addEventListener('DOMContentLoaded', () => {
      if (window.Royal3DScene) {
        new window.Royal3DScene('scene-3d-container');
      }
    });
  }

  applyConfig() {
    // 1. Theme application
    const themeClass = this.config.theme || 'theme-crimson';
    document.body.className = document.body.className.replace(/\btheme-\w+/g, '').trim();
    document.body.classList.add(themeClass);

    // 2. Names & Titles
    document.querySelectorAll('.groom-name-txt').forEach(el => el.textContent = this.config.groomName);
    document.querySelectorAll('.bride-name-txt').forEach(el => el.textContent = this.config.brideName);

    const heroTitle = document.getElementById('hero-couple-title');
    if (heroTitle) {
      heroTitle.innerHTML = `<span class="royal-name groom-name-txt">${this.config.groomName}</span> <span class="ampersand">&</span> <span class="royal-name bride-name-txt">${this.config.brideName}</span>`;
    }

    const taglineEl = document.querySelector('.wedding-tagline');
    if (taglineEl && this.config.weddingTagline) {
      taglineEl.textContent = this.config.weddingTagline;
    }

    // 3. Events & Timings
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
    if (scratchDateEl && events && events.baraat) {
      scratchDateEl.textContent = events.baraat.dateStr;
    }

    // 4. Digital Shagun / E-Salami
    const es = this.config.eSalami;
    if (es) {
      const shagunSec = document.getElementById('step-shagun');
      if (shagunSec) shagunSec.style.display = es.enabled ? 'block' : 'none';

      if (document.getElementById('shagun-raast-val')) document.getElementById('shagun-raast-val').textContent = es.raastId;
      if (document.getElementById('shagun-raast-title-val')) document.getElementById('shagun-raast-title-val').textContent = es.raastTitle;

      if (document.getElementById('shagun-wallet-val')) document.getElementById('shagun-wallet-val').textContent = es.walletNo;
      if (document.getElementById('shagun-wallet-title-val')) document.getElementById('shagun-wallet-title-val').textContent = es.walletTitle;

      if (document.getElementById('shagun-iban-val')) document.getElementById('shagun-iban-val').textContent = es.bankIban;
      if (document.getElementById('shagun-bank-title-val')) document.getElementById('shagun-bank-title-val').textContent = es.bankTitle;

      const shagunWaBtn = document.getElementById('shagun-confirm-wa-btn');
      if (shagunWaBtn) {
        const groomFirstName = this.config.groomName.split(' ')[0];
        const brideFirstName = this.config.brideName.split(' ')[0];
        const waMsg = encodeURIComponent(`Assalam-o-Alaikum! We have sent our humble Shagun / Salami for ${groomFirstName} & ${brideFirstName}'s wedding with our heartfelt prayers. Shadi Mubarak! 💐`);
        shagunWaBtn.href = `https://wa.me/${this.config.whatsappNumber}?text=${waMsg}`;
      }
    }

    // 5. Agency Branding & Viral Referral
    const ag = this.config.agency;
    if (ag) {
      const isBadgeActive = ag.badge === 'enabled';
      const referralFloat = document.getElementById('agency-referral-float');
      if (referralFloat) {
        referralFloat.style.display = isBadgeActive ? 'inline-flex' : 'none';
        const msg = encodeURIComponent(`Assalam-o-Alaikum! I saw this Royal 3D Wedding Website and want to order a custom website for my wedding. Please share packages.`);
        referralFloat.href = `https://wa.me/${ag.agencyWhatsapp}?text=${msg}`;
      }

      const footerBanner = document.getElementById('agency-footer-banner');
      if (footerBanner) {
        footerBanner.style.display = isBadgeActive ? 'block' : 'none';
      }

      const footerWaBtn = document.getElementById('agency-footer-whatsapp-btn');
      if (footerWaBtn) {
        const msg = encodeURIComponent(`Assalam-o-Alaikum! I saw this Royal Wedding Website by ${ag.agencyName} and want to order one. Please share details.`);
        footerWaBtn.href = `https://wa.me/${ag.agencyWhatsapp}?text=${msg}`;
      }
    }

    // 6. Live Petal Counter
    const countEl = document.getElementById('live-petal-count');
    if (countEl) {
      countEl.textContent = (this.config.petalCount || 1348).toLocaleString();
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

  // 1. Virtual Rose Petal Shower & Gulab Pash
  initPetalShower() {
    const showerBtn = document.getElementById('hero-petal-shower-btn');
    const container = document.getElementById('petal-shower-layer');
    if (!showerBtn || !container) return;

    showerBtn.addEventListener('click', () => {
      // Spawn 28 fluttering petals
      const varieties = ['rose-red', 'rose-dark', 'jasmine-white', 'marigold-gold'];
      const count = 30;

      for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        const variety = varieties[Math.floor(Math.random() * varieties.length)];
        const leftPercent = Math.random() * 98;
        const size = Math.floor(14 + Math.random() * 20);
        const fallDuration = (3.2 + Math.random() * 2.8).toFixed(2);
        const swayDuration = (1.5 + Math.random() * 1.5).toFixed(2);
        const delay = (Math.random() * 0.8).toFixed(2);

        petal.className = `falling-petal ${variety}`;
        petal.style.left = `${leftPercent}vw`;
        petal.style.width = `${size}px`;
        petal.style.height = `${Math.floor(size * 1.25)}px`;
        petal.style.animation = `petalFall ${fallDuration}s linear ${delay}s forwards, petalSway ${swayDuration}s ease-in-out infinite`;

        container.appendChild(petal);

        // Remove from DOM after falling completes
        setTimeout(() => {
          if (petal.parentNode) petal.parentNode.removeChild(petal);
        }, (parseFloat(fallDuration) + parseFloat(delay) + 0.5) * 1000);
      }

      // Increment live persistent counter
      this.config.petalCount = (this.config.petalCount || 1348) + 1;
      localStorage.setItem('pak_royal_wedding_config', JSON.stringify(this.config));
      const counterEl = document.getElementById('live-petal-count');
      if (counterEl) {
        counterEl.textContent = this.config.petalCount.toLocaleString();
      }

      if (window.royalAudio) {
        window.royalAudio.playPetalSound();
      }
    });
  }

  // 2. Digital Shagun / E-Salami Lifafa Copy Controller
  initShagunLifafa() {
    const copyBtns = document.querySelectorAll('[data-copy-target]');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.copyTarget;
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        const textToCopy = targetEl.textContent.trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = 'کاپی ہو گیا! ✓';
          btn.classList.add('copied');

          if (window.royalAudio) {
            window.royalAudio.playCoinDrop();
          }

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('copied');
          }, 2200);
        }).catch(err => {
          console.error('Copy error:', err);
        });
      });
    });
  }

  // 3. Royal Photo Gallery Lightbox
  initRoyalGallery() {
    const cards = document.querySelectorAll('.gallery-card');
    const modal = document.getElementById('gallery-lightbox-modal');
    const imgEl = document.getElementById('lightbox-img');
    const capEl = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close-btn');

    if (!modal || !imgEl) return;

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.dataset.img;
        const caption = card.dataset.caption;
        imgEl.src = imgSrc;
        imgEl.alt = caption || 'Wedding Photo Preview';
        if (capEl) capEl.textContent = caption || '';
        modal.classList.add('active');
        if (window.royalAudio) window.royalAudio.playBell();
      });
    });

    const closeModal = () => modal.classList.remove('active');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  // 4. Agency Studio & Client Configurator Panel
  initAgencyStudio() {
    const modal = document.getElementById('agency-studio-modal');
    const openBtns = [
      document.getElementById('open-customizer-btn'),
      document.getElementById('top-open-agency-btn')
    ].filter(Boolean);
    const closeBtn = document.getElementById('studio-close-modal-btn');
    const saveBtn = document.getElementById('studio-btn-save');
    const exportBtn = document.getElementById('studio-btn-export');
    const importTrigger = document.getElementById('studio-btn-import-trigger');
    const fileInput = document.getElementById('studio-file-input');
    const resetBtn = document.getElementById('studio-btn-reset');
    const tabBtns = document.querySelectorAll('.studio-tab-btn');
    const themeCards = document.querySelectorAll('.theme-card-option');

    if (!modal) return;

    // Populates inputs with active config
    const populateFields = () => {
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
      };

      setVal('studio-groom-name', this.config.groomName);
      setVal('studio-bride-name', this.config.brideName);
      setVal('studio-groom-parents', this.config.groomParents);
      setVal('studio-bride-parents', this.config.brideParents);
      setVal('studio-hashtag', this.config.weddingHashtag);
      setVal('studio-tagline', this.config.weddingTagline);

      const ev = this.config.events || {};
      if (ev.mehndi) {
        setVal('studio-mehndi-date', ev.mehndi.dateStr);
        setVal('studio-mehndi-time', ev.mehndi.time);
        setVal('studio-mehndi-venue', ev.mehndi.venue);
        setVal('studio-mehndi-dress', ev.mehndi.dressCode);
      }
      if (ev.baraat) {
        setVal('studio-baraat-date', ev.baraat.dateStr);
        setVal('studio-baraat-time', ev.baraat.time);
        setVal('studio-baraat-venue', ev.baraat.venue);
        setVal('studio-baraat-dress', ev.baraat.dressCode);
      }
      if (ev.walima) {
        setVal('studio-walima-date', ev.walima.dateStr);
        setVal('studio-walima-time', ev.walima.time);
        setVal('studio-walima-venue', ev.walima.venue);
        setVal('studio-walima-dress', ev.walima.dressCode);
      }

      const es = this.config.eSalami || {};
      setVal('studio-raast-id', es.raastId);
      setVal('studio-raast-title', es.raastTitle);
      setVal('studio-wallet-no', es.walletNo);
      setVal('studio-wallet-title', es.walletTitle);
      setVal('studio-bank-iban', es.bankIban);
      setVal('studio-bank-title', es.bankTitle);

      const ag = this.config.agency || {};
      setVal('studio-agency-name', ag.agencyName);
      setVal('studio-agency-whatsapp', ag.agencyWhatsapp);
      setVal('studio-agency-badge-toggle', ag.badge);

      // Highlight active theme
      const currentTheme = this.config.theme || 'theme-crimson';
      themeCards.forEach(c => {
        c.classList.toggle('active', c.dataset.themeId === currentTheme);
      });
    };

    // Open Modal Function
    this.openAgencyStudio = () => {
      populateFields();
      modal.classList.add('active');
      if (window.royalAudio) window.royalAudio.playBell();
    };

    const closeModal = () => modal.classList.remove('active');
    this.closeAgencyStudio = closeModal;

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAgencyStudio();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Tab Switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetTabId = btn.dataset.tab;
        document.querySelectorAll('.studio-tab-pane').forEach(p => {
          p.classList.toggle('active', p.id === targetTabId);
        });
        if (window.royalAudio) window.royalAudio.playBell();
      });
    });

    // Theme Cards Click (Live Instant Preview)
    themeCards.forEach(card => {
      card.addEventListener('click', () => {
        themeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const themeId = card.dataset.themeId;
        this.config.theme = themeId;
        document.body.className = document.body.className.replace(/\btheme-\w+/g, '').trim();
        document.body.classList.add(themeId);
        if (window.royalAudio) window.royalAudio.playBell();
      });
    });

    // Save & Apply Live Button
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const getVal = (id, fallback) => {
          const el = document.getElementById(id);
          return el ? el.value.trim() : fallback;
        };

        const updated = {
          groomName: getVal('studio-groom-name', this.config.groomName),
          brideName: getVal('studio-bride-name', this.config.brideName),
          groomParents: getVal('studio-groom-parents', this.config.groomParents),
          brideParents: getVal('studio-bride-parents', this.config.brideParents),
          weddingHashtag: getVal('studio-hashtag', this.config.weddingHashtag),
          weddingTagline: getVal('studio-tagline', this.config.weddingTagline),
          theme: this.config.theme || 'theme-crimson',
          events: {
            ...this.config.events,
            mehndi: {
              ...this.config.events.mehndi,
              dateStr: getVal('studio-mehndi-date', this.config.events.mehndi.dateStr),
              time: getVal('studio-mehndi-time', this.config.events.mehndi.time),
              venue: getVal('studio-mehndi-venue', this.config.events.mehndi.venue),
              dressCode: getVal('studio-mehndi-dress', this.config.events.mehndi.dressCode)
            },
            baraat: {
              ...this.config.events.baraat,
              dateStr: getVal('studio-baraat-date', this.config.events.baraat.dateStr),
              time: getVal('studio-baraat-time', this.config.events.baraat.time),
              venue: getVal('studio-baraat-venue', this.config.events.baraat.venue),
              dressCode: getVal('studio-baraat-dress', this.config.events.baraat.dressCode)
            },
            walima: {
              ...this.config.events.walima,
              dateStr: getVal('studio-walima-date', this.config.events.walima.dateStr),
              time: getVal('studio-walima-time', this.config.events.walima.time),
              venue: getVal('studio-walima-venue', this.config.events.walima.venue),
              dressCode: getVal('studio-walima-dress', this.config.events.walima.dressCode)
            }
          },
          eSalami: {
            ...this.config.eSalami,
            raastId: getVal('studio-raast-id', this.config.eSalami.raastId),
            raastTitle: getVal('studio-raast-title', this.config.eSalami.raastTitle),
            walletNo: getVal('studio-wallet-no', this.config.eSalami.walletNo),
            walletTitle: getVal('studio-wallet-title', this.config.eSalami.walletTitle),
            bankIban: getVal('studio-bank-iban', this.config.eSalami.bankIban),
            bankTitle: getVal('studio-bank-title', this.config.eSalami.bankTitle)
          },
          agency: {
            ...this.config.agency,
            agencyName: getVal('studio-agency-name', this.config.agency.agencyName),
            agencyWhatsapp: getVal('studio-agency-whatsapp', this.config.agency.agencyWhatsapp),
            badge: getVal('studio-agency-badge-toggle', this.config.agency.badge)
          }
        };

        this.saveConfig(updated);
        this.updateSideContent();
        closeModal();

        if (window.royalAudio) {
          window.royalAudio.playCelebrationChime();
        }
        alert("✨ Client configuration saved & applied live! Ready for client delivery.");
      });
    }

    // 1-Click Export to JSON File
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.config, null, 2));
        const downloadAnchor = document.createElement('a');
        const fileName = `client-config-${(this.config.groomName.split(' ')[0] || 'groom')}-${(this.config.brideName.split(' ')[0] || 'bride')}.json`.toLowerCase();
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        if (window.royalAudio) window.royalAudio.playBell();
      });
    }

    // 1-Click Import from JSON File
    if (importTrigger && fileInput) {
      importTrigger.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedConfig = JSON.parse(event.target.result);
            this.saveConfig(importedConfig);
            this.updateSideContent();
            populateFields();
            closeModal();

            if (window.royalAudio) window.royalAudio.playCelebrationChime();
            alert("🎉 Client config loaded successfully! The website is now customized for this client.");
          } catch (err) {
            alert("⚠️ Invalid JSON file format. Please check the file.");
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset to Demo Button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Restore original Hamza & Ayesha demo configuration?")) {
          localStorage.removeItem('pak_royal_wedding_config');
          this.config = { ...DEFAULT_CONFIG };
          this.applyConfig();
          this.updateSideContent();
          populateFields();
          closeModal();
          if (window.royalAudio) window.royalAudio.playCelebrationChime();
        }
      });
    }

    // WhatsApp Invitation Message Generator
    const genBtn = document.getElementById('studio-btn-generate-wa');
    const copyWaBtn = document.getElementById('studio-btn-copy-wa');
    const testWaBtn = document.getElementById('studio-btn-test-wa');
    const outputEl = document.getElementById('studio-gen-output');

    if (genBtn && outputEl) {
      genBtn.addEventListener('click', () => {
        const guestName = (document.getElementById('studio-gen-guest-name').value || 'معزز مہمانِ خاص').trim();
        const side = document.getElementById('studio-gen-side').value;
        const currentUrl = window.location.origin + window.location.pathname;
        const personalUrl = `${currentUrl}?guest=${encodeURIComponent(guestName)}&side=${side}`;

        const msg = 
`بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ✨
السلام علیکم!

محترم و مکرم جناب / محترمہ: *${guestName}*

اللہ تعالیٰ کے فضل و کرم سے *${this.config.groomName}* اور *${this.config.brideName}* کی شادی مبارک کا شاہی دعوت نامہ پیشِ خدمت ہے:

👑 *شاہی 3D ڈیجیٹل دعوت نامہ (Royal Dawat-Nama):*
👉 ${personalUrl}

✨ کارڈ کھولیں، مہر توڑیں، اور 24K گولڈ کو سکریچ کر کے تاریخ معلوم کریں!
ہمیں آپ کی پرخلوص شرکت اور دعاؤں کا شدت سے انتظار رہے گا۔

منجانب:
${side === 'groom' ? this.config.groomParents : side === 'bride' ? this.config.brideParents : `${this.config.groomParents} & ${this.config.brideParents}`}`;

        outputEl.value = msg;
        if (window.royalAudio) window.royalAudio.playBell();
      });

      if (copyWaBtn) {
        copyWaBtn.addEventListener('click', () => {
          if (!outputEl.value) {
            genBtn.click();
          }
          navigator.clipboard.writeText(outputEl.value).then(() => {
            const orig = copyWaBtn.innerHTML;
            copyWaBtn.innerHTML = 'کاپی ہو گیا! ✓';
            setTimeout(() => { copyWaBtn.innerHTML = orig; }, 2000);
            if (window.royalAudio) window.royalAudio.playBell();
          });
        });
      }

      if (testWaBtn) {
        testWaBtn.addEventListener('click', () => {
          if (!outputEl.value) {
            genBtn.click();
          }
          window.open(`https://wa.me/?text=${encodeURIComponent(outputEl.value)}`, '_blank');
        });
      }
    }
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

  // Step-by-Step Royal Guide & Interactive Guidelines Controller
  initRoyalGuide() {
    const steps = [
      { id: 'step-envelope', stepNum: 1, label: 'مہر توڑیں (Open Envelope)', msg: 'Oopar 3D Envelope par bani <strong>Wax Seal (مہر)</strong> par tap karein taakay Shahi Dawat-nama khulay!' },
      { id: 'step-personalize', stepNum: 2, label: 'نام درج کریں (Personalize)', msg: 'Apna ya apnay khandan ka naam likhein taakay aap kay naam ka makhsoos dawat-nama generate ho sake!' },
      { id: 'step-perspective', stepNum: 3, label: 'خاندان منتخب کریں (Family Side)', msg: "'لڑکے والے' ya 'لڑکی والے' select karein taakay dawat-nama unkay hisaab say update ho!" },
      { id: 'step-scratch', stepNum: 4, label: 'تاریخ معلوم کریں (Scratch Card)', msg: '24K Gold foil ko ungli ya mouse say rub/scratch karein aur wedding date reveal karein!' },
      { id: 'step-events', stepNum: 5, label: 'تینوں تقریبات (Ceremonies)', msg: 'Mehndi, Baraat aur Walima kay timings, venues, dress codes aur maps check karein!' },
      { id: 'step-dholak', stepNum: 6, label: 'شادی ڈھولک (Shadi Dholak)', msg: "'Luddi' ya 'Bhangra' dhol beat on karein aur drum heads par tap karein!" },
      { id: 'step-joota', stepNum: 7, label: 'جوتا چھپائی (Bargaining Fun)', msg: 'Slider drag karein aur Saaliyan vs Dulhay kay Dost kay mazahiya dialogues dekhein!' },
      { id: 'step-duas', stepNum: 8, label: 'مبارکباد اور دعا (Duas Wall)', msg: 'Dulha aur Dulhan kay liye apni Dua & Mubarakbaad WhatsApp pr send karein!' },
      { id: 'step-gallery', stepNum: 9, label: 'شاہی گیلری (Lookbook Gallery)', msg: 'Shahi tasweerein dekhein aur har taqreeb kay dress code colors check karein!' },
      { id: 'step-shagun', stepNum: 10, label: 'ای-سلامی (Digital Shagun)', msg: 'Overseas aur door kay mehmaan yahan say ba-asani salami aur shagun bhej saktay hain!' }
    ];

    let currentStepIdx = 0;

    const toast = document.getElementById('smart-guide-toast');
    const toastStep = document.getElementById('guide-toast-step');
    const toastMsg = document.getElementById('guide-toast-msg');
    const nextBtn = document.getElementById('guide-next-btn');
    const closeBtn = document.getElementById('guide-close-btn');
    const reopenPill = document.getElementById('guide-reopen-pill');
    const chips = document.querySelectorAll('.guide-step-chip');

    const updateGuideUI = (idx) => {
      currentStepIdx = Math.max(0, Math.min(steps.length - 1, idx));
      const s = steps[currentStepIdx];

      if (toastStep) toastStep.textContent = `Step ${s.stepNum} of ${steps.length} • ${s.label}`;
      if (toastMsg) toastMsg.innerHTML = s.msg;

      chips.forEach((c) => {
        c.classList.toggle('active-step', c.dataset.target === s.id);
      });

      // Auto scroll chip into view in guide bar
      const activeChip = document.querySelector(`.guide-step-chip[data-target="${s.id}"]`);
      if (activeChip) {
        activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }

      if (nextBtn) {
        if (currentStepIdx === steps.length - 1) {
          nextBtn.innerHTML = '<span>Complete</span> 🎉';
        } else {
          nextBtn.innerHTML = `<span>Step ${currentStepIdx + 2}</span> ➔`;
        }
      }
    };

    const scrollToStep = (idx) => {
      currentStepIdx = idx;
      const s = steps[idx];
      const targetEl = document.getElementById(s.id);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        targetEl.classList.remove('section-highlighted');
        void targetEl.offsetWidth; // trigger reflow
        targetEl.classList.add('section-highlighted');
      }
      updateGuideUI(idx);
    };

    // Chip clicks
    chips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = chip.dataset.target;
        const stepIdx = steps.findIndex(s => s.id === targetId);
        if (stepIdx !== -1) {
          scrollToStep(stepIdx);
          if (window.royalAudio) window.royalAudio.playBell();
        }
      });
    });

    // Next step button
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextIdx = (currentStepIdx + 1) % steps.length;
        scrollToStep(nextIdx);
        if (window.royalAudio) window.royalAudio.playBell();
      });
    }

    // Close & Reopen Toast
    if (closeBtn && toast && reopenPill) {
      closeBtn.addEventListener('click', () => {
        toast.classList.add('minimized');
        reopenPill.classList.add('visible');
      });

      reopenPill.addEventListener('click', () => {
        toast.classList.remove('minimized');
        reopenPill.classList.remove('visible');
        if (window.royalAudio) window.royalAudio.playBell();
      });
    }

    // Scroll spy: auto detect active section in view
    let isThrottled = false;
    window.addEventListener('scroll', () => {
      if (isThrottled) return;
      isThrottled = true;
      setTimeout(() => { isThrottled = false; }, 150);

      const scrollPos = window.scrollY + 220;
      for (let i = steps.length - 1; i >= 0; i--) {
        const el = document.getElementById(steps[i].id);
        if (el && el.offsetTop <= scrollPos) {
          if (currentStepIdx !== i) {
            updateGuideUI(i);
          }
          break;
        }
      }
    });

    // Auto advance when envelope is opened
    const waxSeal = document.getElementById('envelope-wax-seal');
    if (waxSeal) {
      waxSeal.addEventListener('click', () => {
        const pointer = document.getElementById('wax-bouncing-pointer');
        if (pointer) pointer.style.display = 'none';
        setTimeout(() => {
          updateGuideUI(1);
        }, 1200);
      });
    }

    // Auto advance when scratch card is revealed
    const oldReveal = this.scratchCard && this.scratchCard.onReveal;
    if (this.scratchCard) {
      this.scratchCard.onReveal = () => {
        if (typeof oldReveal === 'function') oldReveal();
        setTimeout(() => {
          updateGuideUI(4);
        }, 800);
      };
    }
  }
}

// Global App bootstrap
window.weddingApp = new RoyalWeddingApp();

