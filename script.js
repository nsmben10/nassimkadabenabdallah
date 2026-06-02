/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   Interactions : Curseur, Navbar, Typing, Scroll Reveal,
                  Stats Counter, Skill Bars, Project Filter, Form
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────────────────
// 1. INITIALISATION : attendre le chargement complet du DOM
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavbar();
  initMobileMenu();
  initTypingEffect();
  initScrollReveal();
  initScrollSpy();
  initStatCounters();
  initSkillBars();
  initProjectFilters();
  initFormValidation();
  initBackToTop();
  initCurrentYear();
});

// ─────────────────────────────────────────────────────────────
// 2. CURSEUR PERSONNALISÉ
// ─────────────────────────────────────────────────────────────
function initCustomCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  // Seulement sur les appareils avec souris
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let raf;

  // Suivi de la position de la souris (dot suit immédiatement)
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Le ring suit avec un léger décalage (effet inertiel)
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }

  animateRing();

  // Agrandir le ring sur les éléments interactifs
  const interactives = document.querySelectorAll('a, button, .skill-card, .project-card, .filter-btn, input, textarea');

  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // Masquer si la souris quitte la fenêtre
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

// ─────────────────────────────────────────────────────────────
// 3. NAVBAR — effet glassmorphism au scroll
// ─────────────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Vérification initiale
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// 4. MENU MOBILE — hamburger toggle
// ─────────────────────────────────────────────────────────────
function initMobileMenu() {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  // Ouvrir / fermer le menu
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen.toString());
    // Bloquer le scroll du body quand le menu est ouvert
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fermer le menu en cliquant sur un lien
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Fermer avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 5. EFFET DE FRAPPE (TYPING EFFECT)
// ─────────────────────────────────────────────────────────────
function initTypingEffect() {
  const typingEl = document.getElementById('typingText');
  if (!typingEl) return;

  // Liste des textes à taper en rotation
  const phrases = [
    'Développeur Full-Stack',
    'Architecte Cloud',
    'Passionné d\'IA',
    'Automatisation Python',
    'Créateur d\'expériences web',
  ];

  let phraseIndex  = 0; // Index de la phrase courante
  let charIndex    = 0; // Index du caractère courant
  let isDeleting   = false;
  let isPaused     = false;

  // Délais en millisecondes
  const TYPING_SPEED   = 80;   // Vitesse de frappe
  const DELETING_SPEED = 45;   // Vitesse d'effacement
  const PAUSE_END      = 1800; // Pause en fin de phrase
  const PAUSE_START    = 400;  // Pause avant de retaper

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isPaused) return; // Sécurité : ne pas accumuler les timeouts

    if (!isDeleting) {
      // Mode frappe : ajouter un caractère
      typingEl.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        // Phrase terminée : pause puis effacement
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          type();
        }, PAUSE_END);
        return;
      }
    } else {
      // Mode effacement : retirer un caractère
      typingEl.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Effacement terminé : passer à la phrase suivante
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          type();
        }, PAUSE_START);
        return;
      }
    }

    // Légère variation aléatoire pour un effet naturel
    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED + Math.random() * 40;
    setTimeout(type, speed);
  }

  // Démarrer avec un court délai pour laisser la page charger
  setTimeout(type, 800);
}

// ─────────────────────────────────────────────────────────────
// 6. SCROLL REVEAL — IntersectionObserver
// ─────────────────────────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Ajouter des délais en cascade aux enfants directs des grilles
  document.querySelectorAll('.skills-grid, .projects-grid, .contact-links').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Déclencher les animations liées si besoin
          triggerAnimations(entry.target);
          // Se désabonner une fois visible (pas besoin de re-animer)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,         // 10% de l'élément visible
      rootMargin: '0px 0px -60px 0px', // Déclencher un peu avant la fin
    }
  );

  elements.forEach(el => observer.observe(el));
}

// Déclencher les animations contextuelles lors du reveal
function triggerAnimations(el) {
  // Barres de compétences
  if (el.classList.contains('skill-card')) {
    animateSkillBar(el);
  }

  // Compteurs de stats
  if (el.classList.contains('hero-stats')) {
    animateCounters();
  }
}

// ─────────────────────────────────────────────────────────────
// 7. SCROLL SPY — Mettre en surbrillance le lien nav actif
// ─────────────────────────────────────────────────────────────
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          navLinks.forEach(link => {
            const href = link.getAttribute('href').slice(1); // retirer le #
            link.classList.toggle('active', href === id);
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px', // Zone centrale de l'écran
    }
  );

  sections.forEach(section => observer.observe(section));
}

// ─────────────────────────────────────────────────────────────
// 8. COMPTEURS DE STATISTIQUES — Animation des nombres
// ─────────────────────────────────────────────────────────────
let countersAnimated = false;

function initStatCounters() {
  // Le déclenchement réel se fait via le ScrollReveal (triggerAnimations)
  // Cette fonction est appelée manuellement si la section Hero est visible au chargement
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;

  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    animateCounters();
  }
}

function animateCounters() {
  if (countersAnimated) return; // Ne pas re-lancer si déjà fait
  countersAnimated = true;

  const counters = document.querySelectorAll('.stat-number[data-target]');

  counters.forEach(counter => {
    const target   = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const startTime = performance.now();
    const startVal  = 0;

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(startVal + (target - startVal) * eased);

      counter.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target; // Valeur finale exacte
      }
    }

    requestAnimationFrame(update);
  });
}

// ─────────────────────────────────────────────────────────────
// 9. BARRES DE COMPÉTENCES — Animation de remplissage
// ─────────────────────────────────────────────────────────────
function initSkillBars() {
  // Les barres sont animées lors du reveal de chaque .skill-card
}

function animateSkillBar(card) {
  const fill = card.querySelector('.level-fill');
  if (!fill) return;

  const targetWidth = fill.getAttribute('data-width');
  if (targetWidth) {
    // Petit délai pour que la carte soit bien visible
    setTimeout(() => {
      fill.style.width = targetWidth + '%';
    }, 200);
  }
}

// ─────────────────────────────────────────────────────────────
// 10. FILTRES DE PROJETS — Animation de filtrage
// ─────────────────────────────────────────────────────────────
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Mettre à jour les boutons actifs
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Animer l'apparition / disparition des cartes
      projectCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          // Animation d'entrée avec délai en cascade
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95) translateY(16px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, index * 60);
        } else {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 250);
        }
      });
    });
  });
}

// ─────────────────────────────────────────────────────────────
// 11. VALIDATION ET SOUMISSION DU FORMULAIRE
// ─────────────────────────────────────────────────────────────
function initFormValidation() {
  const inputs = document.querySelectorAll('.form-input');

  // Validation en temps réel (au blur)
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) {
        validateField(input);
      }
    });
  });
}

// Valider un champ individuel
function validateField(input) {
  const errorEl = document.getElementById(input.id + 'Error');
  let errorMsg = '';
  const val = input.value.trim();

  if (input.required && !val) {
    errorMsg = 'Ce champ est obligatoire.';
  } else if (input.type === 'email' && val) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      errorMsg = 'Veuillez entrer une adresse e-mail valide.';
    }
  } else if (input.id === 'name' && val && val.length < 2) {
    errorMsg = 'Le nom doit contenir au moins 2 caractères.';
  } else if (input.id === 'message' && val && val.length < 10) {
    errorMsg = 'Le message doit contenir au moins 10 caractères.';
  }

  if (errorMsg) {
    input.classList.add('invalid');
    input.style.borderColor = '#ff6b6b';
    if (errorEl) errorEl.textContent = errorMsg;
    return false;
  } else {
    input.classList.remove('invalid');
    input.style.borderColor = '';
    if (val) {
      input.style.borderColor = 'rgba(74, 222, 128, 0.5)'; // Vert de validation
    }
    if (errorEl) errorEl.textContent = '';
    return true;
  }
}

// Soumission du formulaire (appelée depuis le HTML via onclick)
function handleFormSubmit() {
  const fields = ['name', 'email', 'subject', 'message'];
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitBtnText');
  const successMsg = document.getElementById('formSuccess');

  let isValid = true;

  // Valider tous les champs
  fields.forEach(id => {
    const input = document.getElementById(id);
    if (input && !validateField(input)) {
      isValid = false;
    }
  });

  if (!isValid) {
    // Secouer le bouton pour indiquer l'erreur
    submitBtn.style.animation = 'shake 0.5s ease';
    setTimeout(() => { submitBtn.style.animation = ''; }, 500);
    return;
  }

  // Simuler l'envoi (état de chargement)
  submitBtn.disabled = true;
  submitText.textContent = 'Envoi en cours…';
  submitBtn.style.opacity = '0.7';

  // Simulation d'un appel API (remplacer par un vrai fetch)
  setTimeout(() => {
    submitBtn.disabled = false;
    submitText.textContent = 'Envoyer le message';
    submitBtn.style.opacity = '1';

    // Afficher le message de succès
    if (successMsg) {
      successMsg.classList.add('show');
      // Vider le formulaire
      fields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.value = '';
          input.style.borderColor = '';
        }
      });
      // Masquer le message après 5 secondes
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }
  }, 1800);
}

// ─────────────────────────────────────────────────────────────
// 12. BOUTON RETOUR EN HAUT
// ─────────────────────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─────────────────────────────────────────────────────────────
// 13. ANNÉE COURANTE DANS LE FOOTER
// ─────────────────────────────────────────────────────────────
function initCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

// ─────────────────────────────────────────────────────────────
// 14. STYLES D'ANIMATION ADDITIONNELS (injectés via JS)
// ─────────────────────────────────────────────────────────────
(function injectAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Animation de tremblement pour la validation de formulaire */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 50%, 90% { transform: translateX(-6px); }
      30%, 70% { transform: translateX(6px); }
    }

    /* Transition personnalisée pour les inputs invalides */
    .form-input.invalid {
      animation: shake 0.4s ease;
    }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────────────────────────
// 15. MICRO-INTERACTIONS — Effet de ripple sur les boutons
// ─────────────────────────────────────────────────────────────
(function initRippleEffect() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    // Créer l'élément de ripple
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out;
      pointer-events: none;
    `;

    // S'assurer que le bouton est en position relative
    if (getComputedStyle(btn).position === 'static') {
      btn.style.position = 'relative';
    }
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    // Nettoyer après l'animation
    setTimeout(() => ripple.remove(), 600);
  });

  // Injecter le keyframe du ripple
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────────────────────────
// 16. PARALLAXE LÉGÈRE SUR LES ORBES DU HERO
// ─────────────────────────────────────────────────────────────
(function initOrbParallax() {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  if (!orb1 || !orb2) return;

  // Seulement sur desktop (pas de mousemove sur mobile)
  if (window.matchMedia('(hover: none)').matches) return;

  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (ticking) return;

    requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 à 1
      const dy = (e.clientY - cy) / cy; // -1 à 1

      orb1.style.transform = `translate(${dx * 30}px, ${dy * 20}px)`;
      orb2.style.transform = `translate(${-dx * 20}px, ${-dy * 15}px)`;

      ticking = false;
    });

    ticking = true;
  });
})();
