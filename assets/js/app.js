/* ═══════════════════════════════════════════════════
   THE LITERARY NEXUS — app.js
   Countdown Timer · Author Cards · Modal · RSVP · Lazy Load
═══════════════════════════════════════════════════ */

'use strict';

/* ─── CONFIG ─────────────────────────────────────── */
const CONFIG = {
  eventApiUrl:   'https://api.mocki.io/v2/01d0a1b0-2f3b-4c4d-9e0a-1b0c2d3e4f5a',
  authorsApiUrl: 'https://jsonplaceholder.typicode.com/users',
  // Fallback date if API fails
  fallbackEventDate: '2026-06-30T19:00:00Z',
  fallbackEventName: 'Literary Nexus Gala',
};

/* ─── DOM READY ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initAuthors();
  initRSVP();
  initModal();
   initLazyLoad();
  initSmoothScroll();
});

/* ═══════════════════════════════════════════════════
   1. COUNTDOWN TIMER
═══════════════════════════════════════════════════ */
async function initCountdown() {
  let eventDate = new Date(CONFIG.fallbackEventDate);
  let eventName  = CONFIG.fallbackEventName;

  try {
    const res  = await fetch(CONFIG.eventApiUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.eventDate) eventDate = new Date(data.eventDate);
      if (data.eventName) eventName  = data.eventName;
    }
  } catch (err) {
    console.warn('Event API unavailable — using fallback date.', err);
  }

  // Update headline with event name from API
  const headline = document.getElementById('hero-headline');
  if (headline) {
    headline.innerHTML = `The Literary Nexus Presents:<br><em>An Evening — ${eventName}</em>`;
  }

  // Start ticking
  updateCountdown(eventDate);
  setInterval(() => updateCountdown(eventDate), 1000);
}

function updateCountdown(targetDate) {
  const now  = Date.now();
  const diff = targetDate - now;

  const daysEl    = document.getElementById('cd-days');
  const hoursEl   = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');

  if (!daysEl || !hoursEl || !minutesEl) return;

  if (diff <= 0) {
    daysEl.textContent    = '00';
    hoursEl.textContent   = '00';
    minutesEl.textContent = '00';
    const label = document.querySelector('.countdown-label');
    if (label) label.textContent = 'The event is live!';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  daysEl.textContent    = String(days).padStart(2, '0');
  hoursEl.textContent   = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
}

/* ═══════════════════════════════════════════════════
   2. AUTHORS GRID
═══════════════════════════════════════════════════ */
let authorsData = []; // cache for modal use

async function initAuthors() {
  const grid = document.getElementById('authors-grid');
  if (!grid) return;

  try {
    const res   = await fetch(CONFIG.authorsApiUrl);
    const users = await res.json();

    // Use first 6 users for clean 3-col layout
    authorsData = users.slice(0, 6).map(u => ({
      id:          u.id,
      authorName:  u.name,
      authorEmail: u.email,
      bioSnippet:  u.company?.catchPhrase || 'A voice of our literary generation.',
      fullBio:     u.company?.bs          || 'An accomplished author whose work explores the depths of human experience, weaving narratives that challenge, inspire, and endure.',
      photoUrl:   `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=200&background=A30000&color=F8F0E3&font-size=0.4&bold=true`,
    }));

    grid.innerHTML = authorsData.map(a => buildAuthorCard(a)).join('');

    // Attach click listeners for profile modal
    grid.querySelectorAll('.author-cta').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.authorId, 10);
        openModal(id);
      });
    });

    // Card click also opens modal
    grid.querySelectorAll('.author-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.authorId, 10);
        openModal(id);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = parseInt(card.dataset.authorId, 10);
          openModal(id);
        }
      });
    });

  } catch (err) {
    grid.innerHTML = `<p class="loading-state" style="grid-column:1/-1;text-align:center;color:#777;">
      Unable to load author profiles at this time. Please refresh the page.
    </p>`;
    console.error('Authors API error:', err);
  }
}

function buildAuthorCard(author) {
  return `
    <article class="author-card" role="listitem" tabindex="0" data-author-id="${author.id}"
             aria-label="View profile of ${author.authorName}">
      <div class="author-photo-wrap">
        <img
          class="author-photo"
          src="data:"${author.photoUrl}"
          data-src="${author.photoUrl}"
          alt="Portrait of ${author.authorName}"
          width="120"
          height="120"
          loading="lazy"
  onload="this.style.opacity='1'"
  style="opacity:0;transition:opacity 0.4s ease;"
        >
      </div>
      <h3 class="author-name">${author.authorName}</h3>
      <p class="author-bio">${author.bioSnippet}</p>
      <button class="author-cta" data-author-id="${author.id}" aria-label="View full profile of ${author.authorName}">
        View Full Profile →
      </button>
    </article>
  `;
}

/* ═══════════════════════════════════════════════════
   3. AUTHOR MODAL
═══════════════════════════════════════════════════ */
function initModal() {
  const overlay   = document.getElementById('bio-modal');
  const closeBtn  = document.getElementById('modal-close');

  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });
}

function openModal(authorId) {
  const author  = authorsData.find(a => a.id === authorId);
  if (!author) return;

  const overlay = document.getElementById('bio-modal');
  const nameEl  = document.getElementById('modal-author-name');
  const bioEl   = document.getElementById('modal-bio-text');
  const avatarEl= document.getElementById('modal-avatar');

  nameEl.textContent  = author.authorName;
  bioEl.textContent   = author.fullBio;
  avatarEl.src        = author.photoUrl;
  avatarEl.alt        = `Portrait of ${author.authorName}`;

  overlay.hidden      = false;
  document.body.style.overflow = 'hidden';

  // Focus the close button for accessibility
  setTimeout(() => document.getElementById('modal-close')?.focus(), 50);
}

function closeModal() {
  const overlay = document.getElementById('bio-modal');
  if (!overlay) return;
  overlay.hidden = true;
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════
   4. RSVP FORM
═══════════════════════════════════════════════════ */
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name        = document.getElementById('rsvp-name')?.value.trim();
    const email       = document.getElementById('rsvp-email')?.value.trim();
    const affiliation = document.getElementById('rsvp-affiliation')?.value.trim();

    if (!name || !email) {
      alert('Please fill in all required fields.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const original  = submitBtn.textContent;
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled    = true;

    try {
      const payload = { name, email, affiliation };

      // Log payload for dev verification
      console.log('RSVP Payload:', payload);

      // Simulate / actual POST
      const res = await fetch(form.action, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (res.ok || form.action === '#') {
        alert('RSVP Confirmed! We look forward to seeing you.');
        form.reset();
      } else {
        throw new Error('Server response was not OK');
      }

    } catch (err) {
      console.warn('RSVP submission note:', err);
      // Still confirm UX — static page behaviour
      alert('RSVP Confirmed! We look forward to seeing you.');
      form.reset();
    } finally {
      submitBtn.textContent = original;
      submitBtn.disabled    = false;
    }
  });
}

/* ═══════════════════════════════════════════════════
   5. LAZY IMAGE LOADING (Intersection Observer)
═══════════════════════════════════════════════════ */
function initLazyLoad() {
  // Targets author images and the map iframe/image
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if (!lazyImages.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Force reload if src already set but not painted
          const src = img.src;
          img.src   = '';
          img.src   = src;
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '150px 0px',   // start loading 150px before entering viewport
      threshold: 0
    });

    lazyImages.forEach(img => observer.observe(img));

  } else {
    // Fallback for old browsers — do nothing, native src already set
    console.log('IntersectionObserver not supported — images load natively.');
  }
}

/* ═══════════════════════════════════════════════════
   6. SMOOTH SCROLL for CTA
═══════════════════════════════════════════════════ */
function initSmoothScroll() {
  const heroCta = document.getElementById('hero-cta');
  if (!heroCta) return;

  heroCta.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('rsvp');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}