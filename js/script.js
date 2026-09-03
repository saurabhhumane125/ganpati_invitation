/**
 * महाराष्ट्रीयन घरगुती बाप्पा आमंत्रण - परस्परसंवादी अनुभव
 * Royal Mobile-First Maharashtrian Ganpati Digital Invitation
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const doorOverlay = document.getElementById('doorOverlay');
  const openDoorBtn = document.getElementById('openDoorBtn');
  const replayDoorBtn = document.getElementById('replayDoorBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundStatusText = document.getElementById('soundStatusText');
  const showerPetalsBtn = document.getElementById('showerPetalsBtn');
  const petalShowerBtn = document.getElementById('petalShowerBtn');
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');
  const shareInviteBtn = document.getElementById('shareInviteBtn');
  const toastNotification = document.getElementById('toastNotification');
  const familyScrollContainer = document.getElementById('familyScrollContainer');
  const familyDots = document.getElementById('familyDots');
  const petalCanvas = document.getElementById('petalCanvas');

  // ==========================================================================
  // 1. SACRED TEMPLE CHIME & SOUND SYSTEM (Web Audio API)
  // ==========================================================================
  let audioCtx = null;
  let isSoundEnabled = false;
  let ambientOscillators = [];
  let ambientGain = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  /**
   * Synthesize a rich brass temple bell chime (घंटेचा नाद)
   */
  function playTempleBell() {
    initAudioContext();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const masterBellGain = audioCtx.createGain();
    masterBellGain.gain.setValueAtTime(0.7, now);
    masterBellGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
    masterBellGain.connect(audioCtx.destination);

    // Harmonic bell partials (natural brass bell spectrum)
    const bellFrequencies = [
      { freq: 587.33, gain: 0.5 },  // D5
      { freq: 880.00, gain: 0.4 },  // A5
      { freq: 1174.66, gain: 0.3 }, // D6
      { freq: 1567.98, gain: 0.2 }, // G6
      { freq: 2093.00, gain: 0.15 } // C7
    ];

    bellFrequencies.forEach(({ freq, gain }) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(gain, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(oscGain);
      oscGain.connect(masterBellGain);

      osc.start(now);
      osc.stop(now + 3.2);
    });

    // Animate bell icon in UI
    const bellIcon = soundToggleBtn.querySelector('.bell-icon');
    if (bellIcon) {
      bellIcon.classList.add('ringing');
      setTimeout(() => bellIcon.classList.remove('ringing'), 2500);
    }
  }

  /**
   * Ambient Devotional Drone (सौम्य तानपुरा / संथ नाद)
   */
  function startAmbientDrone() {
    initAudioContext();
    if (!audioCtx) return;

    stopAmbientDrone();

    ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 2.0);
    ambientGain.connect(audioCtx.destination);

    // Warm Tanpura base frequencies in D
    const droneFreqs = [146.83, 220.00, 293.66]; // D3, A3, D4

    droneFreqs.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.connect(ambientGain);
      osc.start();
      ambientOscillators.push(osc);
    });

    isSoundEnabled = true;
    soundStatusText.textContent = 'चालू';
    soundToggleBtn.classList.add('active');
  }

  function stopAmbientDrone() {
    if (ambientGain && audioCtx) {
      ambientGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        ambientOscillators.forEach((osc) => {
          try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        ambientOscillators = [];
        ambientGain = null;
      }, 900);
    }
    isSoundEnabled = false;
    soundStatusText.textContent = 'ध्वनी';
    soundToggleBtn.classList.remove('active');
  }

  soundToggleBtn.addEventListener('click', () => {
    if (isSoundEnabled) {
      stopAmbientDrone();
      showToast('ध्वनी बंद केला');
    } else {
      startAmbientDrone();
      playTempleBell();
      showToast('मंगल ध्वनी चालू केला');
    }
  });

  // ==========================================================================
  // 2. HERO / 3D ROYAL GATE OPENING LOGIC (राजेशाही निमंत्रण कवाड उघडणे)
  // ==========================================================================
  function openDoor() {
    initAudioContext();
    playTempleBell();

    // Trigger door opening CSS animation
    doorOverlay.classList.add('doors-opened');

    // Make floating controls visible inside the website container
    const floatingControls = document.getElementById('floatingControls');
    if (floatingControls) {
      floatingControls.classList.add('is-visible');
    }

    // Make revealSection immediately visible without delay
    const revealSection = document.getElementById('revealSection');
    if (revealSection) {
      revealSection.style.opacity = '1';
      revealSection.style.transform = 'translateY(0)';
    }

    // Launch celebratory flower shower for EXACTLY 3 SECONDS
    triggerPetalBurst(35, 3000);

    // After animation finishes, smoothly focus the reveal section
    setTimeout(() => {
      if (revealSection) {
        revealSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  }

  function replayDoor() {
    doorOverlay.classList.remove('doors-opened');
    const floatingControls = document.getElementById('floatingControls');
    if (floatingControls) {
      floatingControls.classList.remove('is-visible');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('दार पुन्हा बंद झाले आहे. उघडण्यासाठी स्पर्श करा!');
  }

  if (openDoorBtn) {
    openDoorBtn.addEventListener('click', openDoor);
  }

  if (replayDoorBtn) {
    replayDoorBtn.addEventListener('click', replayDoor);
  }

  // ==========================================================================
  // 3. FALLING MARIGOLD PETALS SYSTEM (ONLY 3 SECONDS ON DEMAND)
  // ==========================================================================
  const ctx = petalCanvas.getContext('2d');
  let petals = [];
  let petalAnimationId = null;
  let isShowering = false;
  let showerStartTime = 0;
  let showerDurationMs = 3000;

  function resizeCanvas() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Petal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * petalCanvas.width;
      this.y = -20 - Math.random() * 40;
      this.size = 10 + Math.random() * 14;
      this.speedY = 2.0 + Math.random() * 2.8;
      this.speedX = (Math.random() - 0.5) * 1.8;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 3;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.02 + Math.random() * 0.03;

      // Royal Festive Marigold & Rose Palette
      const colors = [
        '#E67E22', // Marigold Orange
        '#F39C12', // Rich Saffron Gold
        '#F1C40F', // Bright Festive Yellow
        '#D35400', // Deep Saffron
        '#A91D22'  // Royal Kumkum Crimson
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = 0.85 + Math.random() * 0.15;
    }

    update(fadeMultiplier = 1.0) {
      this.swayAngle += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.swayAngle) * 1.4;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.currentOpacity = this.opacity * fadeMultiplier;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.currentOpacity);
      ctx.fillStyle = this.color;

      // Realistic curved petal
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size * 0.5, -this.size * 0.8, -this.size * 0.8, this.size * 0.8, 0, this.size);
      ctx.bezierCurveTo(this.size * 0.8, this.size * 0.8, this.size * 0.5, -this.size * 0.8, 0, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  function runPetalAnimation(timestamp) {
    if (!showerStartTime) showerStartTime = timestamp;
    const elapsed = timestamp - showerStartTime;

    ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);

    // Calculate fade-out during the last 800ms of the 3-second duration
    let fade = 1.0;
    if (elapsed > showerDurationMs - 800) {
      fade = Math.max(0, (showerDurationMs - elapsed) / 800);
    }

    petals.forEach((p) => {
      p.update(fade);
      p.draw();
    });

    if (elapsed < showerDurationMs) {
      petalAnimationId = requestAnimationFrame(runPetalAnimation);
    } else {
      // 3 seconds elapsed: STOP and clean up completely
      ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
      petals = [];
      isShowering = false;
      cancelAnimationFrame(petalAnimationId);
      petalAnimationId = null;
    }
  }

  function triggerPetalBurst(count = 35, duration = 3000) {
    if (isShowering) {
      cancelAnimationFrame(petalAnimationId);
    }
    isShowering = true;
    showerDurationMs = duration;
    showerStartTime = 0;
    petals = [];

    for (let i = 0; i < count; i++) {
      petals.push(new Petal());
    }

    petalAnimationId = requestAnimationFrame(runPetalAnimation);
  }

  if (showerPetalsBtn) {
    showerPetalsBtn.addEventListener('click', () => {
      triggerPetalBurst(35, 3000);
      showToast('🌸 बाप्पांच्या चरणी पुष्पवृष्टी!');
    });
  }
  if (petalShowerBtn) {
    petalShowerBtn.addEventListener('click', () => {
      triggerPetalBurst(40, 3000);
      showToast('🌸 बाप्पांच्या चरणी पुष्पवृष्टी!');
    });
  }

  // ==========================================================================
  // 4. HORIZONTAL FAMILY CAROUSEL SCROLL INDICATORS
  // ==========================================================================
  if (familyScrollContainer && familyDots) {
    const dots = familyDots.querySelectorAll('.dot');
    const cards = familyScrollContainer.querySelectorAll('.family-card');

    familyScrollContainer.addEventListener('scroll', () => {
      const scrollLeft = familyScrollContainer.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 16;
      const activeIndex = Math.round(scrollLeft / cardWidth);

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 16;
        familyScrollContainer.scrollTo({
          left: index * cardWidth,
          behavior: 'smooth'
        });
      });
    });
  }

  // ==========================================================================
  // 5. ADD TO CALENDAR (.ICS FILE GENERATION)
  // ==========================================================================
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Joshi Parivar//Ganpati Invitation//MR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'SUMMARY:बाप्पांचे आगमन व गणपती स्थापना - जोशी परिवार',
        'DESCRIPTION:श्री गणेशाय नमः! जोशी परिवारातर्फे बाप्पांच्या आगमनाचा मंगल सोहळा व महाप्रसाद. आपले सहकुटुंब स्वागत आहे.',
        'LOCATION:जोशी निवास, रानडे रोड, शिवाजी पार्कजवळ, दादर (पश्चिम), मुंबई - ४०००२८',
        'DTSTART:20260914T023000Z',
        'DTEND:20260914T083000Z',
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT2H',
        'ACTION:DISPLAY',
        'DESCRIPTION:बाप्पांच्या आगमनाची आठवण',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Ganpati_Aagman_Joshi_Parivar.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('📅 आमंत्रण आपल्या कॅलेंडरमध्ये जोडले गेले!');
    });
  }

  // ==========================================================================
  // 6. SHARE INVITATION (Web Share API & WhatsApp)
  // ==========================================================================
  if (shareInviteBtn) {
    shareInviteBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'बाप्पांच्या आगमनाचा सोहळा | सस्नेह आमंत्रण - जोशी परिवार',
        text: '॥ श्री गणेशाय नमः ॥\n\nबाप्पांच्या आगमनाच्या या मंगल सोहळ्यासाठी आपण सहकुटुंब उपस्थित राहून बाप्पांचे आशीर्वाद घ्यावेत, ही नम्र विनंती.\n\nदिनांक: १४ सप्टेंबर २०२६, सकाळी ८:०० वाजता\nस्थळ: जोशी निवास, दादर, मुंबई.\n\nसस्नेह, जोशी परिवार 🙏',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          showToast('आमंत्रण यशस्वीपणे शेअर केले!');
        } catch (err) {
          // Cancelled
        }
      } else {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          shareData.text + '\n' + shareData.url
        )}`;
        window.open(whatsappUrl, '_blank');
        showToast('व्हॉट्सॲपवर निमंत्रण उघडले जात आहे!');
      }
    });
  }

  // ==========================================================================
  // 7. TOAST NOTIFICATION HELPER
  // ==========================================================================
  let toastTimer = null;
  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3000);
  }

  // ==========================================================================
  // 8. INTERSECTION OBSERVER FOR LIGHT INTERACTIVE SCROLL ANIMATIONS
  // ==========================================================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Target all content sections and cards for subtle interactive entrance
  const animatableElements = document.querySelectorAll(
    '.invitation-section:not(#revealSection), .detail-card, .family-card, .memory-card, .aarti-content-card, .prasad-card, .location-card, .final-card'
  );

  animatableElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1), transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)';
    revealObserver.observe(el);
  });
});
