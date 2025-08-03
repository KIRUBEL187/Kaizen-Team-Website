(() => {
  const container = document.getElementById('mountain-container');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x16232e);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1,1000);
  camera.position.set(0,1.5,4);

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0x777777);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xe7d067, 1);
  dir.position.set(5,10,7); scene.add(dir);

  const geom = new THREE.ConeGeometry(1.4,2.2,6);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xe7d067, metalness:0.8, roughness:0.25,
    emissive: 0x22302a, emissiveIntensity:0.5
  });
  const mountain = new THREE.Mesh(geom, mat);
  mountain.rotation.x = Math.PI/15;
  scene.add(mountain);

  window.addEventListener('resize', ()=> {
    const w=container.clientWidth, h=container.clientHeight;
    renderer.setSize(w,h);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  });

  function animate(){
    requestAnimationFrame(animate);
    mountain.rotation.y += 0.004;
    mountain.rotation.x = Math.sin(Date.now()*0.001)*0.04 + Math.PI/15;
    renderer.render(scene, camera);
  }
  animate();
})();

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold:0.1 });
  sections.forEach(s=>observer.observe(s));
});
