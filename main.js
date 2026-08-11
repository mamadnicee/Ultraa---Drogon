gsap.registerPlugin(ScrollTrigger);

/* ========================= HERO ========================= */

gsap.from("#logoText", {
  y: 100,
  opacity: 0,
  duration: 1.4,
  ease: "power4.out"
});

gsap.from(".subtitle", {
  y: 50,
  opacity: 0,
  duration: 1.2,
  delay: 0.25,
  ease: "power3.out"
});

gsap.to(".hero", {
  y: 8,
  repeat: -1,
  yoyo: true,
  duration: 4,
  ease: "sine.inOut"
});


/* ========================= CARDS ========================= */

gsap.utils.toArray(".card").forEach((card, i) => {

  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%"
    },
    y: 70,
    opacity: 0,
    duration: 1,
    delay: i * 0.12,
    ease: "power3.out"
  });

  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(card, {
      max: 5,
      speed: 400,
      glare: true,
      "max-glare": 0.25,
      scale: 1.03
    });
  }

});


/* ========================= GRADIENT TITLES ========================= */

document.querySelectorAll(".gradient-text").forEach(title => {

  title.style.background =
    "linear-gradient(90deg,#ff6a00,#ff00aa,#00e0ff,#ff6a00)";

  title.style.backgroundSize = "300% 300%";

  title.style.webkitBackgroundClip = "text";
  title.style.webkitTextFillColor = "transparent";

});


/* ========================= PREVIEW PROTECTION ========================= */

document.querySelectorAll("img").forEach(img => {

  img.setAttribute("draggable", "false");

  img.addEventListener("contextmenu", event => {
    event.preventDefault();
  });

});


/* ========================= IMAGE SELECTION PROTECTION ========================= */

document.querySelectorAll("img").forEach(img => {

  img.style.userSelect = "none";
  img.style.webkitUserSelect = "none";
  img.style.webkitTouchCallout = "none";

});


/* ========================= CUSTOM CURSOR ========================= */

if (!("ontouchstart" in window)) {

  const cursor = document.createElement("div");

  cursor.className = "cursor";

  document.body.appendChild(cursor);

  document.addEventListener("mousemove", event => {

    gsap.to(cursor, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.08,
      ease: "power1.out"
    });

  });

}


/* ========================= SECTION REVEAL ========================= */

gsap.utils.toArray(
  ".nexus-block, .sdxl-card, .chart-box, .performance-card"
).forEach((element, i) => {

  gsap.from(element, {

    scrollTrigger: {
      trigger: element,
      start: "top 88%"
    },

    y: 50,
    opacity: 0,
    duration: 0.9,
    delay: i * 0.05,
    ease: "power3.out"

  });

});


/* ========================= SVG FLOAT ========================= */

gsap.utils.toArray(".section-orb").forEach((orb, i) => {

  gsap.to(orb, {

    y: 10,
    repeat: -1,
    yoyo: true,
    duration: 3 + i * 0.4,
    ease: "sine.inOut"

  });

});
/* =========================
   CARD FLIP ENGINE
========================= */

document.querySelectorAll(".card-flip").forEach(card => {

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

});


/* =========================
   CHART FLIP ENGINE
========================= */

document.querySelectorAll(".chart-flip").forEach(card => {

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

});


/* =========================
   SDXL FLIP ENGINE
========================= */

document.querySelectorAll(".sdxl-flip").forEach(card => {

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

});
