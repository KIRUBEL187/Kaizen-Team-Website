
let currentIndex = 0;
const sections = document.querySelectorAll('.mountain-slide');
const seasonColors = ['#3CB371', '#FFD700', '#FF8C00', '#87CEEB']; // spring, summer, autumn, winter
let seasonIndex = 0;

function updateSeason() {
  seasonIndex = (seasonIndex + 1) % seasonColors.length;
  document.body.style.background = seasonColors[seasonIndex];
}

function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    sections[index].scrollIntoView({ behavior: 'smooth' });
    currentIndex = index;
    updateSeason();
    animateMountain(index);
  }
}

function animateMountain(index) {
  const mountain = document.querySelector('.mountain-background');
  if (mountain) {
    mountain.style.transform = `rotateY(${index * 90}deg)`;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    scrollToSection(currentIndex + 1);
  } else if (e.key === 'ArrowLeft') {
    scrollToSection(currentIndex - 1);
  }
});

document.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    scrollToSection(currentIndex + 1);
  } else if (e.deltaY < 0) {
    scrollToSection(currentIndex - 1);
  }
});

document.getElementById("toggle-mode").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
