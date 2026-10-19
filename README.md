# 👑 Royal Pakistani Wedding Invitation Website (دعوت نامہ)

A luxurious, interactive Pakistani Wedding Invitation website featuring 3D falling rose petals, ambient Shehnai & Sitar music, perspective switching for **Groom's Side (لڑکے والے)** & **Bride's Side (لڑکی والے)**, a realistic **Gold Foil Scratch Card** that reveals the wedding date with celebratory confetti, a live countdown clock, calendar sync, and interactive RSVP to WhatsApp with a guest blessings wall.

---

## ✨ Key Features

1. **3D WebGL Atmosphere (Three.js)**:
   - Falling red rose petals (*Gulaab*) and white jasmine (*Motia*).
   - Floating golden embers and a 3D ornate Mughal lantern (*Fanoos*) that reacts to mouse/touch.
   - Interactive 3D Card Tilt with realistic specular glare reflection.

2. **Dual-Perspective Family Switcher**:
   - Guests can switch between:
     - **لڑکے والے (Groom's Family)**: Customized welcoming message from Groom's parents.
     - **لڑکی والے (Bride's Family)**: Customized welcoming message from Bride's parents.
     - **مشترکہ دعوت (Combined)**: Celebrates the union of both families.
   - Direct sharing URLs:
     - `https://your-domain.netlify.app/?side=groom` (Opens Groom's view)
     - `https://your-domain.netlify.app/?side=bride` (Opens Bride's view)

3. **Interactive Gold Foil Scratch Card**:
   - Rub with finger or mouse cursor to scratch away the 24K gold Mughal foil.
   - Realistic scratch sounds generated via Web Audio API.
   - Live percentage counter. At 45%+, triggers a grand celebration with royal chime and confetti fireworks!

4. **3 Core Pakistani Wedding Ceremonies**:
   - **رسمِ حنا (Mehndi & Sangeet)**: Yellow & Teal themes, dress code, venue map, and Add-to-Calendar.
   - **بارات و رخصتی (Grand Baraat)**: Crimson & Zari Gold royal theme.
   - **دعوتِ ولیمہ (Walima Reception)**: Velvet Navy & Champagne Gold theme.

5. **RSVP & WhatsApp Integration**:
   - Relatives can confirm attendance, guest count, and write Duas.
   - Automatically pre-formats an Urdu/English message and opens WhatsApp with 1 tap.
   - Saves wishes to the interactive **Digital Blessings Wall**.

6. **Audio Soundscape**:
   - Floating music player featuring traditional ambient Shehnai and Sitar Raag Yaman synthesizers with play/mute controls.

7. **Instant In-Browser Customizer**:
   - Tap the `⚙️ Edit Invite Details` button on the bottom left to change Bride & Groom names, parents' names, dates, venues, or WhatsApp number without writing any code!

---

## 🚀 How to Deploy on Netlify (100% Free & Takes 1 Minute)

This website is completely self-contained with zero build dependencies (`HTML5`, `CSS3`, `Vanilla JS`, `Three.js`).

### Option 1: Netlify Drop (Easiest - Drag & Drop)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop) (login or create a free Netlify account).
2. Drag and drop this entire `Invite` folder into the upload box on Netlify.
3. Within 5 seconds, Netlify will give you a live URL (e.g. `https://hamza-ayesha-wedding.netlify.app`)!
4. You can change the domain name in Netlify's *Site Settings -> Change site name*.

### Option 2: Deploy with GitHub / Git
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Royal Pakistani Wedding Invitation"
   git remote add origin https://github.com/your-username/wedding-invite.git
   git push -u origin main
   ```
2. In Netlify dashboard, click **Add new site > Import an existing project > GitHub**.
3. Select your repository.
4. Leave build settings default (`publish directory: .` or blank).
5. Click **Deploy Site**!

---

## 📱 How to Deploy on Vercel or GitHub Pages
- **Vercel**: Run `npx vercel` in this folder or import repo on vercel.com.
- **GitHub Pages**: Go to repo *Settings -> Pages -> Deploy from branch 'main' -> root (/) -> Save*.

---

## 🎨 File Structure

```
Invite/
├── index.html               # Main Royal Wedding Invitation Page
├── netlify.toml             # Netlify configuration & security headers
├── README.md                # Documentation & Deployment guide
└── assets/
    ├── css/
    │   └── style.css        # Master royal Pakistani design system & animations
    ├── js/
    │   ├── app.js           # State, perspective switcher, countdown, RSVP & customizer
    │   ├── audio.js         # Web Audio API Shehnai/Sitar ambient synth & SFX
    │   ├── scratch-card.js  # HTML5 Canvas gold scratch-off physics & confetti
    │   └── three-scene.js   # Three.js 3D petals, golden embers & card tilt
    └── images/
        ├── hero_couple.jpg  # Royal Pakistani bride & groom in Mughal courtyard
        ├── mehndi_night.jpg # Festive Mehndi dhol, marigolds & decor
        ├── baraat_stage.jpg # Crimson & gold royal Baraat stage
        ├── walima_reception.jpg # Sophisticated Walima stage
        └── gold_foil.jpg    # Embossed Mughal 24K gold foil texture
```

---

*بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ*
