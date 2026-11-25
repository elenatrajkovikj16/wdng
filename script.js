const gate = document.querySelector("#invitationGate");
const openButton = document.querySelector("#openInvitation");
const siteShell = document.querySelector("#siteShell");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealSite() {
  gate.classList.add("is-leaving");
  siteShell.classList.add("is-visible");
  siteShell.setAttribute("aria-hidden", "false");
  document.body.classList.remove("invitation-locked");

  window.setTimeout(() => {
    gate.hidden = true;
    document.querySelector(".hero .eyebrow")?.classList.add("is-visible");
    document.querySelectorAll(".hero-title .reveal, .hero-meta").forEach((element, index) => {
      window.setTimeout(() => element.classList.add("is-visible"), index * 130);
    });
  }, reduceMotion ? 0 : 700);
}

openButton.addEventListener("click", () => {
  openButton.disabled = true;
  gate.classList.add("is-opening");
  window.setTimeout(revealSite, reduceMotion ? 50 : 2350);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  if (!element.closest(".hero")) revealObserver.observe(element);
});

const weddingDate = new Date("2027-10-09T19:30:00+02:00").getTime();
const countdownFields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

function updateCountdown() {
  const remaining = Math.max(0, weddingDate - Date.now());
  const day = 86_400_000;
  const hour = 3_600_000;
  const minute = 60_000;

  countdownFields.days.textContent = String(Math.floor(remaining / day)).padStart(3, "0");
  countdownFields.hours.textContent = String(Math.floor((remaining % day) / hour)).padStart(2, "0");
  countdownFields.minutes.textContent = String(Math.floor((remaining % hour) / minute)).padStart(2, "0");
  countdownFields.seconds.textContent = String(Math.floor((remaining % minute) / 1000)).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

if (!reduceMotion) {
  const parallaxItems = [...document.querySelectorAll(".parallax")];
  let ticking = false;

  function updateParallax() {
    const viewportCenter = window.innerHeight / 2;
    parallaxItems.forEach((item) => {
      const rect = item.parentElement.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - viewportCenter) * Number(item.dataset.speed || 0);
      item.style.translate = `0 ${offset}px`;
    });
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true },
  );
}

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const glintLayer = document.querySelector("#cursorGlints");
let lastGlint = 0;

if (finePointer.matches && !reduceMotion) {
  window.addEventListener(
    "pointermove",
    (event) => {
      const now = performance.now();
      if (now - lastGlint < 70 || Math.random() > 0.7) return;
      lastGlint = now;

      const glint = document.createElement("i");
      glint.className = "cursor-glint";
      const drift = (Math.random() - 0.5) * 12;
      glint.style.left = `${event.clientX + drift}px`;
      glint.style.top = `${event.clientY + drift}px`;
      glint.style.opacity = String(0.45 + Math.random() * 0.35);
      glintLayer.append(glint);
      glint.addEventListener("animationend", () => glint.remove(), { once: true });
    },
    { passive: true },
  );
}
