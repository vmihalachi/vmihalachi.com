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

// Mister Pagliacci and the open-source parts are CSS only: they play when .is-visible is
// added and reset when it's removed.
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

// The menu bar: while the hero is on screen, the three apps open their panels in turn,
// left to right. Hovering or focusing an app's glyph opens its panel at any time.
const masthead = document.querySelector(".masthead");
const nav = masthead.querySelector(".nav");
const apps = [...masthead.querySelectorAll(".bar-app")];
const panels = new Map(
  [...masthead.querySelectorAll(".say")].map((panel) => [panel.dataset.app, panel]),
);
// Long enough to read each one: the set of ten, Sunny's line, the clown's beat and line
const turns = { mybackhurts: 4600, sunnysays: 4200, pagliacci: 5600 };
// The first panel waits until the hero has been read for a while
const firstTurn = 6000;

// Hang each panel under its glyph, the notch on the glyph's center, inside the bar's margins.
function hangPanels() {
  const style = getComputedStyle(nav);
  const bounds = nav.getBoundingClientRect();
  const start = bounds.left + parseFloat(style.paddingLeft);
  const end = bounds.right - parseFloat(style.paddingRight);
  apps.forEach((app) => {
    const panel = panels.get(app.dataset.app);
    const glyph = app.getBoundingClientRect();
    const center = glyph.left + glyph.width / 2;
    const left = Math.max(
      start,
      Math.min(center - panel.offsetWidth + 28, end - panel.offsetWidth),
    );
    panel.style.setProperty("--say-x", `${left}px`);
    panel.style.setProperty("--say-notch", `${center - left}px`);
  });
}

let turn = -1;
let timer;
let heroInView = false;
let hovered = false;

// With reduced motion the bar opens Sunny's panel (the template's data-say) and leaves it there
function nextTurn() {
  if (reduceMotion) turn = Math.max(turn, 0);
  else {
    turn = (turn + 1) % apps.length;
    const app = apps[turn].dataset.app;
    masthead.dataset.say = app;
    timer = setTimeout(nextTurn, turns[app]);
  }
  masthead.classList.add("is-saying");
}

// No panel opens until the first turn: turn stays -1 until then
function update() {
  clearTimeout(timer);
  masthead.classList.toggle("is-saying", hovered || (heroInView && turn >= 0));
  if (heroInView && !hovered) timer = setTimeout(nextTurn, turn < 0 ? firstTurn : 0);
}

apps.forEach((app, index) => {
  const open = () => {
    hovered = true;
    turn = index;
    masthead.dataset.say = app.dataset.app;
    update();
  };
  const close = () => {
    hovered = false;
    // Pick the cycle up after this app, once its panel has had its full turn
    clearTimeout(timer);
    masthead.classList.toggle("is-saying", heroInView && turn >= 0);
    if (heroInView && !reduceMotion) timer = setTimeout(nextTurn, turns[app.dataset.app]);
  };
  app.addEventListener("pointerenter", open);
  app.addEventListener("pointerleave", close);
  // Keyboard focus only: a tap focuses the glyph too, and that would keep its panel open
  app.addEventListener("focus", () => {
    if (app.matches(":focus-visible")) open();
  });
  app.addEventListener("blur", close);
});

new IntersectionObserver(
  ([entry]) => {
    heroInView = entry.isIntersecting;
    update();
  },
  { threshold: 0.5 },
).observe(document.querySelector(".hero"));

hangPanels();
void document.fonts.ready.then(hangPanels);
addEventListener("resize", hangPanels);
