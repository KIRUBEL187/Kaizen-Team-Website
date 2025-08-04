
let current = 0;
const sections = document.querySelectorAll(".section");

function show(index) {
  const container = document.querySelector("main");
  container.style.transform = `translateX(-${index * 100}vw)`;
}
document.body.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) current++;
  else current--;
  current = Math.max(0, Math.min(sections.length - 1, current));
  show(current);
});
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
