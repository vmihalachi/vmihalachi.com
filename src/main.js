import "./style.css";

document.querySelector("#year").textContent = new Date().getFullYear();

const microsoftStart = new Date(2019, 11);
const now = new Date();
const microsoftYears =
  now.getFullYear() -
  microsoftStart.getFullYear() -
  (now.getMonth() < microsoftStart.getMonth() ? 1 : 0);

document.querySelector("#microsoft-experience").textContent = `${microsoftYears}+`;
document.querySelector("#professional-experience").textContent = `${microsoftYears + 3}+`;

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
  { threshold: 0.14 },
);

document
  .querySelectorAll("section:not(.hero), .interest-card")
  .forEach((element) => observer.observe(element));
