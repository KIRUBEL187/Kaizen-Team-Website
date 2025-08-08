/* script.js
   - Horizontal scroll + snap navigation
   - GSAP animations & ScrollTrigger per panel
   - Three.js hero shader (animated waves)
   - Accessible controls + contact form mock
*/

/* Ensure script runs after DOM & deferred libs loaded */
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Query elements ---------- */
  const scroller = document.getElementById('scroller');
  const panels = Array.from(document.querySelectorAll('.panel'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsNav = document.getElementById('dotsNav');
  const yearEl = document.getElementById('year');
  const playToneBtn = document.getElementById('playTone');

  yearEl.textContent = new Date().getFullYear();

  /* ---------- Build dots nav ---------- */
  panels.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to section ${i + 1}`);
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

  /* ---------- Scroll utility using GSAP ScrollToPlugin ---------- */
  function scrollToPanel(index) {
    const x = panels[index].offsetLeft;
    gsap.to(scroller, { scrollTo: { x }, duration: 0.9, ease: "power3.inOut" });
  }

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

  /* Determine current panel by center coordinate */
  function getCurrentPanelIndex() {
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    return panels.findIndex(p => (p.offsetLeft <= center && (p.offsetLeft + p.offsetWidth) > center));
  }

  /* Update active dot on scroll, throttled via requestAnimationFrame */
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
  }, { passive: true });

  /* Keyboard nav */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });

  /* Wheel snap after short delay for better experience */
  let wheelTimeout;
  scroller.addEventListener('wheel', () => {
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      const idx = getCurrentPanelIndex();
      scrollToPanel(idx);
    }, 160);
  }, { passive: true });

  /* ---------- GSAP entrance animations for panels ---------- */
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  panels.forEach((panel, i) => {
    const elems = panel.querySelectorAll('.panel-inner > * , .panel-inner');
    gsap.fromTo(elems, {
      autoAlpha: 0,
      y: 28,
      rotateX: 6
    }, {
      autoAlpha: 1,
      y: 0,
      rotateX: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.06,
      scrollTrigger: {
        trigger: panel,
        scroller: scroller,
        start: 'left center',
        end: 'left center',
        onEnter: () => setActiveDot(i),
        onEnterBack: () => setActiveDot(i)
      }
    });
  });

  /* ---------- Contact form mock ---------- */
  const form = document.querySelector('.contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('input,textarea,button');
    gsap.to(inputs, { autoAlpha: 0.5, duration: 0.2 });
    setTimeout(() => {
      alert('Thanks — this is a demo. Hook the form to your API or email service.');
      gsap.to(inputs, { autoAlpha: 1, duration: 0.2 });
      form.reset();
    }, 700);
  });

  /* ---------- Accessibility: keyboard on dot buttons ---------- */
  dotButtons.forEach(b => b.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); b.click();
    }
  }));

  /* initial active dot */
  setTimeout(() => setActiveDot(0), 200);

  /* ---------- Simple tone button (demo of interaction) ---------- */
  playToneBtn && playToneBtn.addEventListener('click', () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 220;
      g.gain.value = 0.0001;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      gsap.to(g.gain, { value: 0.05, duration: 0.08, yoyo: true, repeat: 1, onComplete: ()=> { o.stop(); ctx.close(); }});
    } catch (e) { /* ignore audio errors */ }
  });

  /* ---------- Three.js hero background (animated wave shader) ---------- */
  (function initThreeHero() {
    const container = document.getElementById('webgl-hero');
    if (!container || !window.THREE) return;

    // Respect reduced-motion preference: skip heavy animation if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Set a static fallback background color/image
      container.style.background = 'linear-gradient(180deg, rgba(41,100,142,0.16), rgba(9,20,33,0.12))';
      return;
    }

    // Basic three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 8, 24);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Simple directional light + ambient
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7);
    scene.add(dir);

    // Plane geometry for water effect
    const geometry = new THREE.PlaneGeometry(40, 18, 160, 80);

    // Shader material (vertex displacement + nice color gradient)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0x16364a) }, // deep bluish
        uColorB: { value: new THREE.Color(0x2f6b8d) }, // accent
        uLight: { value: new THREE.Vector3(5, 10, 7) },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;
        // Simple pseudo-random
        float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }

        void main() {
          vUv = uv;
          vec3 pos = position;
          // combine sin waves with varying frequencies & noise
          float freq1 = 0.8;
          float freq2 = 1.6;
          float amp1 = 0.6;
          float amp2 = 0.35;
          float wave = sin((pos.x + uTime * 0.6) * freq1) * amp1
                     + sin((pos.y * 0.7 + uTime * 0.9) * freq2) * amp2;
          // add small random jitter
          wave += (rand(uv * 100.0) - 0.5) * 0.03;
          pos.z += wave;
          vWave = wave;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;

        void main() {
          // gradient based on vertical uv with slight time shift for shimmer
          float g = smoothstep(0.0, 1.0, vUv.y + vWave * 0.08 + sin(uTime * 0.3) * 0.01);
          vec3 col = mix(uColorA, uColorB, g);
          // rim light to give depth
          float rim = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 2.0) * 0.2;
          col += rim * 0.08;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: false,
      side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2.6;
    plane.position.y = -4;
    scene.add(plane);

    // Add a subtle floating "ship silhouette" plane: simple textured quad (use placeholder)
    // For performance and simplicity we draw a dark translucent shape (no external texture)
    const shipGeom = new THREE.PlaneGeometry(6, 3.2, 1, 1);
    const shipMat = new THREE.MeshBasicMaterial({ color: 0x071723, transparent: true, opacity: 0.85 });
    const ship = new THREE.Mesh(shipGeom, shipMat);
    ship.position.set(-6, 0.5, 2.1);
    ship.rotation.x = -0.1;
    scene.add(ship);

    // Resize handling
    function resize() {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', resize);

    // subtle camera movement on pointer for parallax
    let pointer = { x: 0, y: 0 };
    container.addEventListener('pointermove', (e) => {
      const r = container.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width * 2 - 1;
      pointer.y = (e.clientY - r.top) / r.height * 2 - 1;
    });

    // animation loop
    const clock = new THREE.Clock();
    let rafId;
    function animate() {
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;
      // animate ship bobbing slightly
      ship.position.y = Math.sin(t * 0.9) * 0.18 + 0.6;
      ship.rotation.z = Math.sin(t * 0.4) * 0.02;
      // subtle camera parallax reaction
      gsap.to(camera.position, { x: pointer.x * 2.2, y: 8 + pointer.y * 1.2, duration: 0.9, ease: 'power1.out' });
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }
    animate();

    // cleanup if page unloads (helpful in SPA context)
    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
    });
  })();

  /* ---------- Done ---------- */
});
