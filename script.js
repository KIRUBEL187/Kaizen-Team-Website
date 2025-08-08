/* script.js
   - horizontal nav
   - GSAP entrance animations
   - dots navigation
   - basic form submit mock
*/

document.addEventListener('DOMContentLoaded', () => {
  const scroller = document.getElementById('scroller');
  const panels = Array.from(document.querySelectorAll('.panel'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsNav = document.getElementById('dotsNav');
  const yearEl = document.getElementById('year');

  yearEl.textContent = new Date().getFullYear();

  // Build nav dots
  panels.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = ''; btn.setAttribute('aria-label', `Go to section ${i+1}`);
    btn.dataset.index = i;
    btn.addEventListener('click', () => scrollToPanel(i));
    dotsNav.appendChild(btn);
  });

  const dotButtons = Array.from(dotsNav.children);

  function setActiveDot(index) {
    dotButtons.forEach(d => d.classList.remove('is-active'));
    const btn = dotButtons[index];
    if (btn) btn.classList.add('is-active');
  }

  // Smooth scroll to panel index
  function scrollToPanel(index) {
    const x = panels[index].offsetLeft;
    gsap.to(scroller, {scrollTo: {x}, duration: 0.9, ease: "power3.inOut"});
  }

  // Prev / Next handlers
  function clampIndex(idx) {
    return Math.max(0, Math.min(panels.length - 1, idx));
  }
  prevBtn.addEventListener('click', () => {
    const idx = clampIndex(getCurrentPanelIndex() - 1);
    scrollToPanel(idx);
  });
  nextBtn.addEventListener('click', () => {
    const idx = clampIndex(getCurrentPanelIndex() + 1);
    scrollToPanel(idx);
  });

  // Determine current panel by center position
  function getCurrentPanelIndex() {
    const center = scroller.scrollLeft + scroller.clientWidth/2;
    return panels.findIndex(p => {
      return (p.offsetLeft <= center && (p.offsetLeft + p.offsetWidth) > center);
    });
  }

  // Update active dot on scroll (throttled)
  let ticking = false;
  scroller.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const idx = getCurrentPanelIndex();
        if (idx >= 0) setActiveDot(idx);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Keyboard nav
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });

  // Touch / wheel directional smoothing (optional improvement)
  let wheelTimeout;
  scroller.addEventListener('wheel', (e) => {
    // when user uses wheel, allow natural scroll but snap after short delay
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      const idx = getCurrentPanelIndex();
      scrollToPanel(idx);
    }, 150);
  }, {passive:true});

  // GSAP entrance animations for each panel when it gets close to center
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  panels.forEach((panel, i) => {
    // simple staggered fade/translate animation for children
    const elements = panel.querySelectorAll('.panel-inner > * , .panel-inner');
    gsap.fromTo(elements, {
      autoAlpha: 0,
      y: 30,
      rotateX: 6
    }, {
      autoAlpha: 1,
      y: 0,
      rotateX: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: panel,
        scroller: scroller,
        start: 'left+=10 center',
        end: 'left center',
        onEnter: () => setActiveDot(i),
        onEnterBack: () => setActiveDot(i)
      }
    });
  });

  // Basic contact form handler (mock)
  const form = document.querySelector('.contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    // simple mock feedback
    gsap.to(form.querySelectorAll('input,textarea,button'), {autoAlpha:0.4, duration:0.2});
    setTimeout(()=> {
      alert('Thanks! Message simulated as sent. Replace this handler with your API.');
      gsap.to(form.querySelectorAll('input,textarea,button'), {autoAlpha:1, duration:0.2});
      form.reset();
    }, 600);
  });

  // initial active dot
  setTimeout(()=> setActiveDot(0), 300);

  // Accessibility: focus management when using dots
  dotButtons.forEach(b => b.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); b.click();
    }
  }));
});
