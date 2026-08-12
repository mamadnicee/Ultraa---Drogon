gsap.registerPlugin(ScrollTrigger);

/* =========================
   HERO
========================= */

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


/* =========================
   CARD FLIP
========================= */

document.querySelectorAll(".card-flip").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
    card.classList.toggle("card-expanded");
  });
});


/* =========================
   CHART FLIP
========================= */

document.querySelectorAll(".chart-flip").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});


/* =========================
   SDXL FLIP
========================= */

document.querySelectorAll(".sdxl-flip").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});


/* =========================
   GRADIENT TITLES
========================= */

document.querySelectorAll(".gradient-text").forEach(title => {
  title.style.background =
    "linear-gradient(90deg,#ff6a00,#ff00aa,#00e0ff,#ff6a00)";

  title.style.backgroundSize = "300% 300%";
  title.style.webkitBackgroundClip = "text";
  title.style.webkitTextFillColor = "transparent";
});


/* =========================
   IMAGE PROTECTION
========================= */

document.querySelectorAll("img").forEach(img => {

  img.setAttribute("draggable", "false");

  img.style.userSelect = "none";
  img.style.webkitUserSelect = "none";
  img.style.webkitTouchCallout = "none";

  img.addEventListener("contextmenu", e => {
    e.preventDefault();
  });

});


/* =========================
   CUSTOM CURSOR
========================= */

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


/* =========================
   SECTION REVEAL
========================= */

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


/* =========================
   SVG FLOAT
========================= */

gsap.utils.toArray(".section-orb").forEach((orb, i) => {

  gsap.to(orb, {

    y: 10,
    repeat: -1,
    yoyo: true,
    duration: 3 + i * 0.4,
    ease: "sine.inOut"

  });

});
