gsap.registerPlugin(ScrollTrigger);

/* =========================
   HERO ANIMATION
========================= */
gsap.from(".brand", { 
  y: 150, 
  opacity: 0, 
  duration: 1.5, 
  ease: "power4.out" 
});

gsap.from(".subtitle", { 
  y: 80, 
  opacity: 0, 
  duration: 1.5, 
  delay: 0.3, 
  ease: "power4.out" 
});

/* =========================
   CARDS SCROLL + TILT + GRADIENT TEXT
========================= */
gsap.utils.toArray(".card").forEach((card, i) => {

  // Scroll Animation
  gsap.from(card, {
    scrollTrigger: { 
      trigger: card, 
      start: "top 85%" 
    },
    y: 100, 
    opacity: 0, 
    delay: i * 0.2, 
    duration: 1.2, 
    ease: "power3.out"
  });

  // Vanilla Tilt
  VanillaTilt.init(card, { 
    max: 12, 
    speed: 500, 
    glare: true, 
    "max-glare": 0.35, 
    scale: 1.05 
  });

  // Gradient Animated Text on h3/h2
  const headings = card.querySelectorAll(".gradient-text");
  headings.forEach(h => {
    h.style.background = "linear-gradient(90deg, #ff6a00, #ff00aa, #00e0ff, #ff6a00)";
    h.style.backgroundSize = "300% 300%";
    h.style.webkitBackgroundClip = "text";
    h.style.webkitTextFillColor = "transparent";
    h.style.animation = "logoFlow 6s linear infinite";
  });

});

/* =========================
   HERO FLOAT LOOP
========================= */
gsap.to(".hero", { 
  y: 10, 
  repeat: -1, 
  yoyo: true, 
  ease: "sine.inOut", 
  duration: 4 
});

/* =========================
   CUSTOM CURSOR (DESKTOP ONLY)
========================= */
if (!('ontouchstart' in window)) {
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", e => {
    gsap.to(cursor, { 
      x: e.clientX, 
      y: e.clientY, 
      duration: 0.1, 
      ease: "power1.out" 
    });
  });
}

/* =========================
   DISABLE RIGHT CLICK + LONG PRESS ON GALLERY IMAGES
========================= */
document.querySelectorAll(".scroll-container img").forEach(img => {

  img.setAttribute("draggable", "false");
  img.addEventListener("contextmenu", e => e.preventDefault());
  img.addEventListener("touchstart", e => e.preventDefault(), { passive: false });

});

/* =========================
   SUBTLE GIF-LIKE MOTION FOR ALL IMAGES
========================= */
document.querySelectorAll(".scroll-container img").forEach(img => {
  img.style.animation = "subtleGif 5s ease-in-out infinite alternate";
});
