// Advanced 3D Scene Engine (Three.js) for Royal Pakistani Wedding
// Features: 3D Interlocking Golden Rings, Falling Rose & Jasmine Petals,
// 3D Swaying Mughal Lantern with Dynamic Lighting, and 3D Card Tilt

class Royal3DScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.petals = [];
    this.sparks = null;
    this.lanternGroup = null;
    this.lanternLight = null;
    this.ringsGroup = null;
    this.diamondLight = null;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.clock = new THREE.Clock();

    this.init();
    this.init3DCardTilt();
    this.initEnvelopeInteraction();
  }

  init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 36);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff3e0, 1.4);
    this.scene.add(ambientLight);

    const mainGoldLight = new THREE.PointLight(0xffdf73, 2.8, 80);
    mainGoldLight.position.set(0, 15, 12);
    this.scene.add(mainGoldLight);

    const rubyRimLight = new THREE.PointLight(0x9e1b32, 2.2, 70);
    rubyRimLight.position.set(-25, -12, 10);
    this.scene.add(rubyRimLight);

    const emeraldLight = new THREE.PointLight(0x1e7e65, 1.8, 60);
    emeraldLight.position.set(25, -15, 8);
    this.scene.add(emeraldLight);

    // Add 3D Objects
    this.createInterlockingRings();
    this.createFallingPetals();
    this.createGoldenSparksField();
    this.createMughalLantern();

    // Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.targetMouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });

    this.animate();
  }

  // 3D Interlocking Golden Wedding Rings with Diamond Sparkle
  createInterlockingRings() {
    this.ringsGroup = new THREE.Group();

    // Shiny 24K Gold Material
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffdf73,
      metalness: 0.95,
      roughness: 0.15
    });

    // Ring 1 (Groom's Band)
    const ring1Geo = new THREE.TorusGeometry(3.0, 0.38, 24, 64);
    const ring1 = new THREE.Mesh(ring1Geo, goldMat);
    ring1.rotation.x = Math.PI / 3;
    ring1.position.x = -1.4;
    this.ringsGroup.add(ring1);

    // Ring 2 (Bride's Diamond Solitaire Band)
    const ring2Geo = new THREE.TorusGeometry(2.7, 0.32, 24, 64);
    const ring2 = new THREE.Mesh(ring2Geo, goldMat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 5;
    ring2.position.x = 1.4;
    this.ringsGroup.add(ring2);

    // Sparkling Brilliant Cut Solitaire Diamond on Bride's Ring
    const diamondGeo = new THREE.OctahedronGeometry(0.7, 2);
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 2.4, // Diamond index of refraction
      reflectivity: 0.9
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.set(1.4, 2.7, 0.5);
    diamond.scale.set(0.9, 1.2, 0.9);
    this.ringsGroup.add(diamond);

    // Diamond Sparkle Light
    this.diamondLight = new THREE.PointLight(0xffffff, 2.5, 12);
    this.diamondLight.position.set(1.4, 3.2, 1.2);
    this.ringsGroup.add(this.diamondLight);

    // Position rings in 3D background behind Hero title
    this.ringsGroup.position.set(0, 1.5, -8);
    this.ringsGroup.scale.set(0.95, 0.95, 0.95);
    this.scene.add(this.ringsGroup);
  }

  // 3D Realistic Curved Rose & Jasmine Petals
  createFallingPetals() {
    const petalCount = 75;
    const colors = [
      0x9e1b32, // Deep Red Rose
      0x781428, // Crimson Velvet
      0xb81d3d, // Vibrant Rose
      0xfffdf5, // White Jasmine (Motia)
      0xfff5cc  // Cream Jasmine
    ];

    // Elegant curved leaf petal geometry
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.7, 0.9, 0, 1.8);
    shape.quadraticCurveTo(-0.7, 0.9, 0, 0);
    const geometry = new THREE.ShapeGeometry(shape, 12);

    for (let i = 0; i < petalCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const material = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide,
        roughness: 0.35,
        metalness: 0.05,
        transparent: true,
        opacity: 0.9
      });

      const mesh = new THREE.Mesh(geometry, material);
      const s = 0.5 + Math.random() * 0.7;
      mesh.scale.set(s, s, s);

      mesh.position.set(
        (Math.random() - 0.5) * 65,
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 35
      );

      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      mesh.userData = {
        speedY: 0.04 + Math.random() * 0.07,
        speedX: (Math.random() - 0.5) * 0.025,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        swayAmp: 0.03 + Math.random() * 0.035,
        swayPhase: Math.random() * Math.PI * 2
      };

      this.scene.add(mesh);
      this.petals.push(mesh);
    }
  }

  createGoldenSparksField() {
    const sparkCount = 250;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 75;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 65;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 45;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Radial golden particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 245, 200, 1)');
    grad.addColorStop(0.35, 'rgba(212, 175, 55, 0.85)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.PointsMaterial({
      color: 0xffe680,
      size: 1.35,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.sparks = new THREE.Points(geometry, material);
    this.scene.add(this.sparks);
  }

  createMughalLantern() {
    this.lanternGroup = new THREE.Group();

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.25,
      wireframe: true
    });

    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xaa771c,
      metalness: 0.85,
      roughness: 0.3
    });

    // Octagonal Lattice Cage
    const cageGeo = new THREE.CylinderGeometry(1.8, 2.4, 4.8, 8, 1, true);
    const cage = new THREE.Mesh(cageGeo, goldMat);
    this.lanternGroup.add(cage);

    // Mughal Dome Cap
    const domeGeo = new THREE.ConeGeometry(2.5, 2.0, 8);
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 3.3;
    this.lanternGroup.add(dome);

    // Inverted Bottom Finial
    const bottomGeo = new THREE.ConeGeometry(1.7, 1.4, 8);
    const bottom = new THREE.Mesh(bottomGeo, domeMat);
    bottom.rotation.x = Math.PI;
    bottom.position.y = -3.0;
    this.lanternGroup.add(bottom);

    // Glowing Inner Candle Core
    const flameGeo = new THREE.SphereGeometry(1.0, 16, 16);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffe082,
      transparent: true,
      opacity: 0.95
    });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    this.lanternGroup.add(flame);

    // Dynamic flickering candle point light
    this.lanternLight = new THREE.PointLight(0xffbd38, 3.8, 35);
    this.lanternGroup.add(this.lanternLight);

    // Position top right
    this.lanternGroup.position.set(19, 11, -4);
    this.lanternGroup.scale.set(1.3, 1.3, 1.3);
    this.scene.add(this.lanternGroup);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Mouse easing
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Camera subtle 3D parallax
    this.camera.position.x = this.mouseX * 3.5;
    this.camera.position.y = this.mouseY * 2.5;
    this.camera.lookAt(0, 0, 0);

    // Animate Interlocking Wedding Rings
    if (this.ringsGroup) {
      this.ringsGroup.rotation.y = elapsedTime * 0.35 + this.mouseX * 0.4;
      this.ringsGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15 + this.mouseY * 0.3;
      if (this.diamondLight) {
        this.diamondLight.intensity = 2.0 + Math.sin(elapsedTime * 8) * 1.0;
      }
    }

    // Animate Petals
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.position.y -= p.userData.speedY;
      p.position.x += Math.sin(elapsedTime * 1.8 + p.userData.swayPhase) * p.userData.swayAmp + p.userData.speedX;

      p.rotation.x += p.userData.rotSpeedX;
      p.rotation.y += p.userData.rotSpeedY;
      p.rotation.z += p.userData.rotSpeedZ;

      if (p.position.y < -30) {
        p.position.y = 30;
        p.position.x = (Math.random() - 0.5) * 65;
      }
    }

    // Animate Sparks
    if (this.sparks) {
      const positions = this.sparks.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.05;
        if (positions[i] > 32) {
          positions[i] = -32;
        }
      }
      this.sparks.geometry.attributes.position.needsUpdate = true;
      this.sparks.rotation.y = elapsedTime * 0.03;
    }

    // Animate Lantern
    if (this.lanternGroup) {
      this.lanternGroup.rotation.z = Math.sin(elapsedTime * 1.6) * 0.1 + this.mouseX * 0.12;
      this.lanternGroup.rotation.y = elapsedTime * 0.4;
      if (this.lanternLight) {
        this.lanternLight.intensity = 3.5 + Math.sin(elapsedTime * 7) * 0.8;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  // 3D Card Hover & Touch Tilt
  init3DCardTilt() {
    const cards = document.querySelectorAll('[data-3d-tilt]');

    cards.forEach((card) => {
      const handleMove = (e) => {
        const rect = card.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        if (!clientX || !clientY) return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        const glare = card.querySelector('.card-glare');
        if (glare) {
          const gx = (x / rect.width) * 100;
          const gy = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 235, 140, 0.35) 0%, rgba(255, 255, 255, 0) 65%)`;
          glare.style.opacity = '1';
        }
      };

      const handleLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        const glare = card.querySelector('.card-glare');
        if (glare) glare.style.opacity = '0';
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);
      card.addEventListener('touchmove', handleMove, { passive: true });
      card.addEventListener('touchend', handleLeave);
    });
  }

  // 3D Royal Wax Seal & Envelope Interaction
  initEnvelopeInteraction() {
    const envelope = document.getElementById('royal-3d-envelope');
    const waxSeal = document.getElementById('envelope-wax-seal');
    const openBtn = document.getElementById('open-envelope-btn');

    if (!envelope || !waxSeal) return;

    const triggerOpen = () => {
      if (envelope.classList.contains('opened')) return;

      // Play wax seal crack + paper sound
      if (window.royalAudio) {
        window.royalAudio.playEnvelopeOpenSound();
      }

      envelope.classList.add('opened');

      // Auto start traditional wedding music smoothly
      if (window.royalAudio && !window.royalAudio.isPlaying) {
        setTimeout(() => window.royalAudio.playMusic(), 600);
      }

      // Smooth scroll to revealed invitation card
      setTimeout(() => {
        const cardSection = document.getElementById('invitation-details');
        if (cardSection) {
          cardSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1100);
    };

    waxSeal.addEventListener('click', triggerOpen);
    if (openBtn) openBtn.addEventListener('click', triggerOpen);
  }
}

window.Royal3DScene = Royal3DScene;
window.Wedding3DScene = Royal3DScene; // backward compatibility
