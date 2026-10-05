/**
 * TINTIN & SNOWY (MILOU) INTERACTIVE PORTFOLIO ENGINE
 * Nguyễn Thị Ngoan • Đại Học Ngoại Thương (FTU)
 */

(function () {
  'use strict';

  // State Management
  const state = {
    soundEnabled: true,
    currentRegionIndex: 0,
    isTourActive: false,
    regions: [
      {
        id: 'vung-namdinh',
        name: 'Trạm 1: Nam Định',
        mapCoords: { top: '72%', left: '24%' },
        quote: 'Gâu! Đây là quê hương Nam Định hiền hòa của cô chủ Ngoan! Đất học truyền thống!',
        sfx: ['GÂU GÂU!', 'WOOF! WOOF!', 'OUAH! OUAH!']
      },
      {
        id: 'vung-ftu',
        name: 'Trạm 2: ĐH Ngoại Thương (FTU)',
        mapCoords: { top: '48%', left: '47%' },
        quote: 'Gâu gâu! Học viện Ngoại Thương Chùa Láng! Cô chủ là sinh viên năm 3 chuyên ngành Tiếng Trung thương mại, GPA 3.62!',
        sfx: ['GÂU GÂU!', 'FTU WOOF!', 'WOUAH!']
      },
      {
        id: 'vung-hsk6',
        name: 'Trạm 3: Đỉnh HSK 6 & HSKK CC',
        mapCoords: { top: '32%', left: '71%' },
        quote: 'Gâu gâu! Nền tảng Hán ngữ HSK 6 & HSKK Cao Cấp! Cô chủ luôn chăm chỉ và nỗ lực học tập!',
        sfx: ['WOOF!', 'HSK6 GÂU!', 'WOUAH WOUAH!']
      },
      {
        id: 'vung-contact',
        name: 'Trạm 4: Bưu Cục Viễn Thông',
        mapCoords: { top: '62%', left: '83%' },
        quote: 'Gâu gâu gâu! Bưu điện viễn thông! Hãy gửi điện tín hoặc kết nối Zalo 0357296623 với cô chủ nhé!',
        sfx: ['TÍN HIỆU GÂU!', 'WOOF WOOF!', 'GÂU!']
      }
    ]
  };

  // Audio Context for Web Audio API Procedural Dog Bark
  let audioCtx = null;

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
   * Synthesize a lively, canine dog bark using Web Audio API
   * Generates a warm, authentic terrier bark (Snowy / Milou)
   */
  function synthesizeDogBark(barkType = 'double') {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) {
      playAudioTag(barkType);
      return;
    }

    try {
      const now = audioCtx.currentTime;

      function playSingleBark(startTime, basePitch, duration) {
        const osc = audioCtx.createOscillator();
        const oscHarmonic = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        // Waveform & Pitch drop
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(basePitch, startTime);
        osc.frequency.exponentialRampToValueAtTime(basePitch * 0.45, startTime + duration);

        oscHarmonic.type = 'triangle';
        oscHarmonic.frequency.setValueAtTime(basePitch * 1.8, startTime);
        oscHarmonic.frequency.exponentialRampToValueAtTime(basePitch * 0.8, startTime + duration);

        // Canine throat resonance filter (Bandpass)
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(750, startTime);
        filter.Q.setValueAtTime(2.5, startTime);

        // Amplitude envelope: explosive attack, snappy decay
        gainNode.gain.setValueAtTime(0.001, startTime);
        gainNode.gain.linearRampToValueAtTime(0.35, startTime + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        oscHarmonic.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(startTime);
        oscHarmonic.start(startTime);
        osc.stop(startTime + duration);
        oscHarmonic.stop(startTime + duration);
      }

      if (barkType === 'single') {
        playSingleBark(now, 480, 0.18);
      } else if (barkType === 'happy') {
        playSingleBark(now, 520, 0.14);
        playSingleBark(now + 0.12, 580, 0.16);
        playSingleBark(now + 0.28, 620, 0.20);
      } else {
        // Standard double bark: "Woof! Woof!" / "Gâu! Gâu!"
        playSingleBark(now, 460, 0.16);
        playSingleBark(now + 0.13, 500, 0.20);
      }
    } catch (e) {
      console.warn('Web Audio synthesis error, fallback to audio element:', e);
      playAudioTag(barkType);
    }
  }

  /**
   * Fallback to pre-rendered HTML5 Audio files
   */
  function playAudioTag(type) {
    if (!state.soundEnabled) return;
    let audioElem = document.getElementById('audio-bark-double');
    if (type === 'single') {
      audioElem = document.getElementById('audio-bark-single') || audioElem;
    } else if (type === 'happy') {
      audioElem = document.getElementById('audio-bark-yip') || audioElem;
    }
    if (audioElem) {
      audioElem.currentTime = 0;
      audioElem.play().catch(() => {});
    }
  }

  /**
   * Trigger Bark Sound + Animated Comic Bubble Onomatopoeia
   */
  function triggerBark(barkType = 'double', customText = null) {
    if (!state.soundEnabled) return;
    synthesizeDogBark(barkType);

    // Comic speech visualizer
    const bubble = document.getElementById('bark-bubble-fx');
    const bubbleText = document.getElementById('bark-text');
    if (bubble && bubbleText) {
      const texts = customText ? [customText] : ['GÂU GÂU!', 'WOOF! WOOF!', 'WOUAH!', 'ĂNG GÂU!'];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      bubbleText.textContent = randomText;

      bubble.classList.remove('show');
      void bubble.offsetWidth; // Trigger reflow
      bubble.classList.add('show');

      clearTimeout(bubble._timer);
      bubble._timer = setTimeout(() => {
        bubble.classList.remove('show');
      }, 1400);
    }

    // Snowy mascot jumping animation
    const mascot = document.getElementById('snowy-guide-mascot');
    if (mascot) {
      mascot.style.transform = 'scale(1.25) rotate(-8deg)';
      setTimeout(() => {
        mascot.style.transform = '';
      }, 350);
    }
  }

  /**
   * Move Snowy's pin on the Adventure Map and update state
   */
  function setSnowyMapPosition(regionIndex) {
    const region = state.regions[regionIndex];
    if (!region) return;

    state.currentRegionIndex = regionIndex;

    // 1. Move Snowy marker on map
    const snowyMarker = document.getElementById('snowy-map-avatar');
    const snowyBubbleText = document.getElementById('snowy-avatar-bubble-text');
    if (snowyMarker) {
      snowyMarker.style.top = region.mapCoords.top;
      snowyMarker.style.left = region.mapCoords.left;
    }
    if (snowyBubbleText) {
      snowyBubbleText.textContent = `Gâu! Đang ở ${region.name}!`;
    }

    // 2. Highlight map pins
    document.querySelectorAll('.map-pin').forEach(pin => {
      pin.classList.remove('active');
      if (pin.getAttribute('data-target') === region.id) {
        pin.classList.add('active');
      }
    });

    // 3. Highlight station cards
    document.querySelectorAll('.station-card').forEach(card => {
      card.classList.remove('active');
      if (card.getAttribute('data-target') === region.id) {
        card.classList.add('active');
      }
    });

    // 4. Update Snowy Companion Speech Bubble
    const speechText = document.getElementById('snowy-speech-text');
    if (speechText) {
      speechText.textContent = region.quote;
    }
  }

  /**
   * Navigate to a region with barking sound and smooth scrolling
   */
  function navigateToRegion(regionIndex, shouldScroll = true) {
    const region = state.regions[regionIndex];
    if (!region) return;

    initAudioContext();
    triggerBark('double', region.sfx[0]);
    setSnowyMapPosition(regionIndex);

    if (shouldScroll) {
      const targetElement = document.getElementById(region.id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  /**
   * Start sequential Snowy tour
   */
  function startSnowyTour() {
    initAudioContext();
    triggerBark('happy', 'KHỞI HÀNH! GÂU GÂU!');
    navigateToRegion(0, true);
    showToast('🐾 Milou (Snowy) đang dẫn đường bạn đến Trạm 1: Nam Định!');
  }

  /**
   * Toast notification helper
   */
  function showToast(message) {
    const toast = document.getElementById('comic-toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.remove('hidden');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => {
        toast.classList.add('hidden');
      }, 3000);
    }
  }

  /**
   * Copy to clipboard helper
   */
  function copyTextToClipboard(text, successMsg) {
    initAudioContext();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        triggerBark('single', 'ĐÃ SAO CHÉP!');
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      triggerBark('single', 'ĐÃ SAO CHÉP!');
      showToast(successMsg);
    } catch (err) {
      showToast(`Thông tin: ${text}`);
    }
    document.body.removeChild(tempInput);
  }

  // ==========================================================================
  // INITIALIZATION & EVENT LISTENERS
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Sound Toggle Button
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    const soundLabel = document.getElementById('sound-label');

    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        initAudioContext();
        state.soundEnabled = !state.soundEnabled;
        if (state.soundEnabled) {
          soundIcon.textContent = '🔊';
          soundLabel.textContent = 'Tiếng Sủa: BẬT';
          triggerBark('single', 'GÂU! ÂM THANH BẬT');
          showToast('🔊 Đã bật âm thanh tiếng sủa của chú chó Snowy!');
        } else {
          soundIcon.textContent = '🔇';
          soundLabel.textContent = 'Tiếng Sủa: TẮT';
          showToast('🔇 Đã tắt âm thanh.');
        }
      });
    }

    // 2. Test Bark Button
    const testBarkBtn = document.getElementById('test-bark-btn');
    if (testBarkBtn) {
      testBarkBtn.addEventListener('click', () => {
        initAudioContext();
        triggerBark('double', 'GÂU GÂU! 🐕');
      });
    }

    // 3. Snowy Mascot Clicks
    const mascot = document.getElementById('snowy-guide-mascot');
    if (mascot) {
      mascot.addEventListener('click', () => {
        initAudioContext();
        const cuteQuotes = [
          'Gâu gâu! Em là Milou đây, cô chủ Ngoan là sinh viên năm 3 Ngoại Thương FTU!',
          'Ẳng gâu! Bấm vào các trạm trên bản đồ để em dẫn đường nha!',
          'Gâu! Chuyên ngành Tiếng Trung thương mại FTU rất thú vị ạ!',
          'Gâu gâu! Cô chủ có chứng chỉ HSK6 và HSKK CC, luôn sẵn sàng học hỏi kinh nghiệm mới!',
          'Gâu gâu! Zalo cô chủ là 0357296623, kết nối với cô chủ nhé!'
        ];
        const randomQuote = cuteQuotes[Math.floor(Math.random() * cuteQuotes.length)];
        const speechText = document.getElementById('snowy-speech-text');
        if (speechText) {
          speechText.textContent = randomQuote;
        }
        triggerBark('happy');
      });
    }

    // 4. Snowy Companion Bubble Buttons
    const bubbleWalkBtn = document.getElementById('snowy-bubble-walk-btn');
    if (bubbleWalkBtn) {
      bubbleWalkBtn.addEventListener('click', () => {
        const nextIndex = (state.currentRegionIndex + 1) % state.regions.length;
        navigateToRegion(nextIndex, true);
      });
    }

    const bubbleBarkBtn = document.getElementById('snowy-bubble-bark-btn');
    if (bubbleBarkBtn) {
      bubbleBarkBtn.addEventListener('click', () => {
        initAudioContext();
        triggerBark('double', 'GÂU GÂU GÂU!');
      });
    }

    const closeSpeechBtn = document.getElementById('close-speech-btn');
    const speechBalloon = document.getElementById('snowy-speech-balloon');
    if (closeSpeechBtn && speechBalloon) {
      closeSpeechBtn.addEventListener('click', () => {
        speechBalloon.style.opacity = '0';
        speechBalloon.style.pointerEvents = 'none';
        setTimeout(() => {
          speechBalloon.style.opacity = '1';
          speechBalloon.style.pointerEvents = 'auto';
        }, 8000);
      });
    }

    // 5. Hero Action Buttons
    const startTourBtn = document.getElementById('start-snowy-tour-btn');
    if (startTourBtn) {
      startTourBtn.addEventListener('click', () => {
        startSnowyTour();
      });
    }

    // 6. Map Pins click
    document.querySelectorAll('.map-pin').forEach(pin => {
      pin.addEventListener('click', () => {
        const targetId = pin.getAttribute('data-target');
        const idx = state.regions.findIndex(r => r.id === targetId);
        if (idx !== -1) {
          navigateToRegion(idx, true);
        }
      });
    });

    // 7. Map Cards click
    document.querySelectorAll('.station-card').forEach(card => {
      card.addEventListener('click', () => {
        const targetId = card.getAttribute('data-target');
        const idx = state.regions.findIndex(r => r.id === targetId);
        if (idx !== -1) {
          navigateToRegion(idx, true);
        }
      });
    });

    // 8. "Tiếp tục đến Trạm tiếp theo" inside chapters
    document.querySelectorAll('.btn-guide-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextId = btn.getAttribute('data-next');
        const idx = state.regions.findIndex(r => r.id === nextId);
        if (idx !== -1) {
          navigateToRegion(idx, true);
        }
      });
    });

    // 9. Copy Zalo Button
    const copyZaloBtn = document.getElementById('copy-zalo-btn');
    if (copyZaloBtn) {
      copyZaloBtn.addEventListener('click', () => {
        copyTextToClipboard('0357296623', '📋 Đã sao chép số Zalo: 0357296623 vào bộ nhớ tạm!');
      });
    }

    // 10. Copy Gmail Button
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        copyTextToClipboard('ngoanngoan0357@gmail.com', '📋 Đã sao chép Gmail: ngoanngoan0357@gmail.com vào bộ nhớ tạm!');
      });
    }

    // 11. Interactive Telegram Form Submit
    const telegramForm = document.getElementById('telegram-form');
    const telegramSuccess = document.getElementById('telegram-success-msg');
    if (telegramForm) {
      telegramForm.addEventListener('submit', (e) => {
        e.preventDefault();
        initAudioContext();
        triggerBark('happy', 'ĐÃ PHÁT ĐIỆN TÍN! GÂU!');
        if (telegramSuccess) {
          telegramSuccess.classList.remove('hidden');
          telegramSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        showToast('⚡ Bức điện tín đã được mã hóa và gửi thành công!');
        telegramForm.reset();
      });
    }

    // 12. IntersectionObserver to update active navigation & map position as user scrolls
    const navLinks = document.querySelectorAll('.nav-link');
    const observedSections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;

          // Update header nav active link
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            }
          });

          // If the section is one of our 4 exploration regions, sync the map
          const regionIdx = state.regions.findIndex(r => r.id === currentId);
          if (regionIdx !== -1 && regionIdx !== state.currentRegionIndex) {
            setSnowyMapPosition(regionIdx);
          }
        }
      });
    }, {
      root: null,
      threshold: 0.35
    });

    observedSections.forEach(sec => observer.observe(sec));

    // Initialize Snowy default position
    setSnowyMapPosition(0);

    // Initial warm welcome bark on first user interaction
    const handleFirstInteraction = () => {
      initAudioContext();
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
  });

})();
