
// 3D Mountain Rotation
(() => {
  const container = document.getElementById('mountain-container');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x666666);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xf5d76e, 1);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  const geometry = new THREE.ConeGeometry(1.2, 2, 5);
  const material = new THREE.MeshStandardMaterial({
    color: 0xf5d76e,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x332b0a,
    emissiveIntensity: 0.4,
  });

  const mountain = new THREE.Mesh(geometry, material);
  mountain.rotation.x = Math.PI / 20;
  scene.add(mountain);

  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  function animate() {
    requestAnimationFrame(animate);
    mountain.rotation.y += 0.005;
    mountain.rotation.x = Math.sin(Date.now() * 0.001) * 0.05 + Math.PI / 20;
    renderer.render(scene, camera);
  }
  animate();
})();

// Fade-in Animation on Scroll
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => observer.observe(section));
});
