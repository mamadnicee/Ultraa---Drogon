gsap.registerPlugin(ScrollTrigger);

/* ========================= HERO ANIMATION ========================= */
gsap.from(".hero h1", { 
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

/* ========================= CARDS SCROLL + TILT + GRADIENT TEXT ========================= */
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

  // Gradient Animated Text on h3
  const h3 = card.querySelector(".gradient-text");
  if(h3){
    h3.style.background = "linear-gradient(90deg, #ff6a00, #ff00aa, #00e0ff, #ff6a00)";
    h3.style.backgroundSize = "300% 300%";
    h3.style.webkitBackgroundClip = "text";
    h3.style.webkitTextFillColor = "transparent";
    h3.style.animation = "logoFlow 6s linear infinite";
  }

});

/* ========================= HERO FLOAT LOOP ========================= */
gsap.to(".hero", { 
  y: 10, 
  repeat: -1, 
  yoyo: true, 
  ease: "sine.inOut", 
  duration: 4 
});

/* ========================= CUSTOM CURSOR (DESKTOP ONLY) ========================= */
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

/* ========================= DISABLE RIGHT CLICK + LONG PRESS ON GALLERY IMAGES ========================= */
document.querySelectorAll(".scroll-container img").forEach(img => {
  img.setAttribute("draggable", "false");

  img.addEventListener("contextmenu", e => e.preventDefault());
  img.addEventListener("touchstart", e => e.preventDefault(), { passive: false });
});

/* ========================= SUBTLE GIF-LIKE MOTION FOR ALL IMAGES ========================= */
const images = document.querySelectorAll(".scroll-container img");
images.forEach(img => {
  img.style.animation = "subtleGif 5s ease-in-out infinite alternate";
});

/* ========================= NEON VAULT STREAM SPECIFIC ========================= */
const neonVaultContainer = document.querySelector("#neonVaultStream .scroll-container");
if(neonVaultContainer){
  const vaultImages = neonVaultContainer.querySelectorAll("img");
  vaultImages.forEach((img, i) => {
    gsap.to(img, {
      y: "random(-4,4)",
      x: "random(-3,3)",
      rotation: "random(-1,1)",
      repeat: -1,
      yoyo: true,
      duration: 3 + Math.random() * 2,
      ease: "sine.inOut",
      delay: i * 0.1
    });
  });
}

/* ========================= PREMIUM VISUAL STORE 6 FOLDERS + RECTANGLE FIELD ========================= */
const pvsCards = document.querySelectorAll(".gallery-scroll");
pvsCards.forEach((card, i) => {
  const scrollContainer = card.querySelector(".scroll-container");
  if(scrollContainer){
    let isDown = false, startX, scrollLeft;

    scrollContainer.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    });
    scrollContainer.addEventListener('mouseleave', () => isDown = false);
    scrollContainer.addEventListener('mouseup', () => isDown = false);
    scrollContainer.addEventListener('mousemove', e => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    });
  }
});

/* ========================= CLICK TO REVEAL RECTANGLE FIELD UNDER PREMIUM VISUAL STORE ========================= */
const pvsTrigger = document.querySelector("#premiumVisualStoreCard");
const pvsExtraField = document.querySelector("#neonVaultStream"); // این فیلد مستطیلی
if(pvsTrigger && pvsExtraField){
  pvsExtraField.style.display = "none";
  pvsTrigger.addEventListener("click", () => {
    pvsExtraField.style.display = "block";
    pvsExtraField.scrollIntoView({ behavior: "smooth" });
  });
}
