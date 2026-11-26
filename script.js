/* ==========================================================================
   SPIDER-MAN x JAPANESE ANIME INTERACTIVE SCRIPTS
   Portfolio for V. Chelladurai (Mount Zion College of Engineering)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 2. Active Link on Scroll
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 180) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // 3. Web Audio SFX (Pure Web Audio API - zero external audio assets)
  let audioCtx = null;
  let sfxEnabled = true;
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Spidey "THWIP!" Web Shoot Sound
  function playThwipSound() {
    if (!sfxEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.16);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.16);

      gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.16);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) { }
  }

  // Heroic Synth Chime
  function playAnimeBeamSound() {
    if (!sfxEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.26);
    } catch (e) { }
  }

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      sfxToggleBtn.classList.toggle('active', sfxEnabled);
      const text = sfxToggleBtn.querySelector('.sfx-state');
      if (text) text.textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
      if (sfxEnabled) {
        initAudioContext();
        playAnimeBeamSound();
      }
    });
  }

  // Attach sounds to all buttons & links
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-contact-top, .panel-link-btn, .contact-item-link, .btn-submit-signal, .gallery-filter-btn').forEach(el => {
    el.addEventListener('click', () => {
      playThwipSound();
    });
  });

  // 4. Interactive Spider-Web Network Canvas
  const canvas = document.getElementById('spider-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 25), 45);

    class WebParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#ff0055' : '#00f0ff';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new WebParticle());
    }

    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function animateWeb() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 0, 85, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.45 * (1 - mdist / mouse.radius)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateWeb);
    }

    animateWeb();
  }

  // 5. Toast Notification System
  function showToast(msg) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // 6. Contact Form Dispatch
  const contactForm = document.getElementById('spiderContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      playThwipSound();

      const name = document.getElementById('senderName')?.value || 'Friend';
      const msg = document.getElementById('senderMessage')?.value || '';

      const whatsappUrl = `https://api.whatsapp.com/send?phone=916380591016&text=${encodeURIComponent(`Hi Chelladurai, I am ${name}. ${msg}`)}`;

      showToast(`🕸️ Web Signal Transmitted! Connecting to Chelladurai...`);

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    });
  }

  // ==========================================================================
  // 7. HERO PROFILE CARD MULTIVERSE SLIDER & SWIPE CONTROLS
  // ==========================================================================
  const heroSlider = document.getElementById('heroPhotoSlider');
  const heroSlides = Array.from(document.querySelectorAll('#heroPhotoSlider .profile-slide'));
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  const heroDotsContainer = document.getElementById('heroSliderDots');
  const heroMangaTag = document.getElementById('heroCardMangaTag');
  const heroPowerTag = document.getElementById('heroCardPowerTag');
  const heroSfxBubble = document.getElementById('heroComicSfxBubble');
  const heroStatSubText = document.getElementById('heroStatSubText');

  let currentHeroSlideIndex = 0;

  // Initialize pagination dots
  if (heroDotsContainer && heroSlides.length > 0) {
    heroDotsContainer.innerHTML = '';
    heroSlides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('title', `Shift to photo ${i + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        switchHeroSlide(i, i > currentHeroSlideIndex ? 'next' : 'prev');
      });
      heroDotsContainer.appendChild(dot);
    });
  }

  function switchHeroSlide(targetIndex, direction = 'next') {
    if (heroSlides.length === 0) return;
    currentHeroSlideIndex = (targetIndex + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, idx) => {
      slide.classList.remove('active', 'slide-in-right', 'slide-in-left');
      if (idx === currentHeroSlideIndex) {
        slide.classList.add('active');
        slide.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');

        // Update card meta tags
        const tag = slide.getAttribute('data-tag') || 'SSR // HERO';
        const power = slide.getAttribute('data-power') || 'POWER: 9999+';
        const sfx = slide.getAttribute('data-sfx') || '* THWIP! *';
        const status = slide.getAttribute('data-status') || 'MECH OVERDRIVE';

        if (heroMangaTag) heroMangaTag.textContent = tag;
        if (heroPowerTag) heroPowerTag.textContent = power;
        if (heroSfxBubble) heroSfxBubble.textContent = sfx;
        if (heroStatSubText) heroStatSubText.textContent = status;
      }
    });

    // Update Dots
    if (heroDotsContainer) {
      const dots = heroDotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentHeroSlideIndex);
      });
    }

    playThwipSound();
  }

  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      switchHeroSlide(currentHeroSlideIndex - 1, 'prev');
    });
  }

  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      switchHeroSlide(currentHeroSlideIndex + 1, 'next');
    });
  }

  // Touch Swipe on Hero Slider
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  if (heroSlider) {
    heroSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleHeroSwipe();
    }, { passive: true });

    // Mouse drag swipe for desktop
    let isMouseDown = false;
    let mouseStartX = 0;

    heroSlider.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
      heroSlider.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      heroSlider.style.cursor = 'grab';
      const deltaX = e.clientX - mouseStartX;
      if (deltaX < -35) {
        switchHeroSlide(currentHeroSlideIndex + 1, 'next');
      } else if (deltaX > 35) {
        switchHeroSlide(currentHeroSlideIndex - 1, 'prev');
      }
    });
  }

  function handleHeroSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX < 0) {
        // Swiped Left -> Next Photo
        switchHeroSlide(currentHeroSlideIndex + 1, 'next');
      } else {
        // Swiped Right -> Prev Photo
        switchHeroSlide(currentHeroSlideIndex - 1, 'prev');
      }
    }
  }
});
