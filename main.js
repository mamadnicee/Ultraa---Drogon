gsap.registerPlugin(ScrollTrigger);

gsap.from(".brand", { y: 150, opacity: 0, duration: 1.5, ease: "power4.out" });
gsap.from(".subtitle", { y: 80, opacity: 0, duration: 1.5, delay: 0.3, ease: "power4.out" });

gsap.utils.toArray(".card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: "top 85%" },
    y: 100, opacity: 0, delay: i*0.2, duration: 1.2, ease: "power3.out"
  });
  VanillaTilt.init(card, { max: 12, speed: 500, glare: true, "max-glare": 0.35, scale:1.05 });
});

gsap.to(".hero", { y: 10, repeat: -1, yoyo: true, ease: "sine.inOut", duration:4 });

if (!('ontouchstart' in window)) {
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  document.body.appendChild(cursor);
  document.addEventListener("mousemove", e => {
    gsap.to(cursor, { x:e.clientX, y:e.clientY, duration:0.1, ease:"power1.out" });
  });
}
