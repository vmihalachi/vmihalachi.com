import "./style.css";

// Hold the hero entrance until the fonts have loaded, but never for more than a moment.
const startHero = () => document.documentElement.classList.add("fonts-ready");
void document.fonts.ready.then(startHero);
setTimeout(startHero, 1000);

document.querySelector("#year").textContent = new Date().getFullYear();

const microsoftStart = new Date(2019, 11);
const now = new Date();
const microsoftYears =
  now.getFullYear() -
  microsoftStart.getFullYear() -
  (now.getMonth() < microsoftStart.getMonth() ? 1 : 0);

document.querySelector("#microsoft-experience").textContent = `${microsoftYears}+`;
document.querySelector("#professional-experience").textContent = `${microsoftYears + 3}+`;

// Reveal a section once its top is a little way into the screen. A share of the
// section's height would leave tall sections blank for a long scroll on phones.
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
  { rootMargin: "0px 0px -12% 0px" },
);

document
  .querySelectorAll("section:not(.hero), .interest-card")
  .forEach((element) => observer.observe(element));

// The page takes the color (--tone) of whichever section crosses the middle of the
// screen, so each project is read in its own app's light and the rest on paper.
const toneObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach(
      ({ target, isIntersecting }) =>
        isIntersecting &&
        document.body.style.setProperty(
          "--room",
          getComputedStyle(target).getPropertyValue("--tone"),
        ),
    ),
  { rootMargin: "-50% 0px -49% 0px" },
);

document
  .querySelectorAll("main > section:not(.projects), .side-project")
  .forEach((element) => toneObserver.observe(element));

// The project drawings play each time one comes into view, and reset once it has
// left the screen completely, so the reset is never seen.
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// mybackhurts: the card starts on rep 6 of 10 and finishes the set.
function finishSet(art) {
  const count = art.querySelector(".mbh-count b");
  const reps = [...art.querySelectorAll(".mbh-reps li")];
  const shin = art.querySelector(".sq-shin");
  const show = (done) => {
    count.textContent = done;
    reps.forEach((rep, i) => rep.classList.toggle("is-done", i < done));
  };
  let done = 6;
  const countRep = (event) => {
    if (event.animationName !== "sq-shin") return;
    done += 1;
    show(done);
  };
  shin.addEventListener("animationiteration", countRep);
  shin.addEventListener("animationend", countRep);
  art.classList.add("is-counting");
  return () => {
    shin.removeEventListener("animationiteration", countRep);
    shin.removeEventListener("animationend", countRep);
    art.classList.remove("is-counting");
    show(6);
  };
}

// sunnysays: Sunny says each line, then dozes off.
function chatter(art) {
  const lines = [...art.querySelectorAll(".sunny-bubble span")];
  const timers = [];
  const say = (index) => {
    lines.forEach((line, i) => line.classList.toggle("is-current", i === index));
    art.classList.add("is-talking");
    const talking = 45 * lines[index].textContent.length;
    timers.push(setTimeout(() => art.classList.remove("is-talking"), talking));
  };
  lines.forEach((_, index) => timers.push(setTimeout(() => say(index), index * 4800)));
  timers.push(setTimeout(() => art.classList.add("is-asleep"), lines.length * 4800));
  return () => {
    timers.forEach(clearTimeout);
    art.classList.remove("is-talking", "is-asleep");
    lines.forEach((line, i) => line.classList.toggle("is-current", i === 0));
  };
}

// Deskling is CSS only: it plays when .is-visible is added and resets when it's removed.
const plays = { "mbh-art": finishSet, "sunny-art": chatter };
const resets = new Map();

const artObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach(
      ({ target, isIntersecting, intersectionRatio, intersectionRect, rootBounds }) => {
        // Mostly in view, or filling most of a short screen
        const inView =
          intersectionRatio >= 0.6 || intersectionRect.height >= rootBounds.height * 0.6;
        if (inView && !resets.has(target)) {
          target.classList.add("is-visible");
          const play = plays[[...target.classList].find((name) => name in plays)];
          resets.set(target, reduceMotion ? undefined : play?.(target));
        } else if (!isIntersecting && resets.has(target) && !reduceMotion) {
          resets.get(target)?.();
          resets.delete(target);
          target.classList.remove("is-visible");
        }
      },
    ),
  { threshold: [0, 0.3, 0.6] },
);

document.querySelectorAll(".project-art").forEach((art) => artObserver.observe(art));
