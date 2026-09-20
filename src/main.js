import './style.css'

document.querySelector('#year').textContent = new Date().getFullYear()

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
  { threshold: 0.14 },
)

document.querySelectorAll('section:not(.hero), .interest-card').forEach((element) => observer.observe(element))