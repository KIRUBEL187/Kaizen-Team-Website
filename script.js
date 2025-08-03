
let currentSection = 0;
const sections = document.querySelectorAll(".section");

function showSection(index) {
    sections.forEach((section, i) => {
        section.style.transform = `translateX(${(i - index) * 100}vw)`;
    });
}

document.body.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) currentSection++;
    else currentSection--;
    currentSection = Math.max(0, Math.min(sections.length - 1, currentSection));
    showSection(currentSection);
});

document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});
