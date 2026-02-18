gsap.registerPlugin(ScrollTrigger);

gsap.from("#logoText", { y: 150, opacity: 0, duration: 1.5, ease: "power4.out" });
gsap.from(".subtitle", { y: 80, opacity: 0, duration: 1.5, delay: 0.3, ease: "power4.out" });

gsap.utils.toArray(".card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: "top 85%" },
    y: 100, opacity: 0, delay: i*0.2, duration: 1.2, ease: "power3.out"
  });
});

gsap.to(".hero", { y: 10, repeat: -1, yoyo: true, ease: "sine.inOut", duration:4 });

/* =========================
   EXCLUSIVE MODE SCRIPT
========================= */

function openExclusive(images, startIndex=0) {

  const modal = document.createElement("div");
  modal.className = "exclusive-modal";

  const closeBtn = document.createElement("div");
  closeBtn.className = "exclusive-close";
  closeBtn.innerHTML = "×";
  modal.appendChild(closeBtn);

  const track = document.createElement("div");
  track.className = "exclusive-track";

  images.forEach(src => {
    const card = document.createElement("div");
    card.className = "exclusive-card";
    const img = document.createElement("img");
    img.src = src;
    card.appendChild(img);
    track.appendChild(card);
  });

  modal.appendChild(track);
  document.body.appendChild(modal);

  let current = startIndex;
  update();

  function update() {
    const cards = document.querySelectorAll(".exclusive-card");
    cards.forEach((c,i)=>{
      c.classList.remove("active");
      if(i === current) c.classList.add("active");
    });
    track.style.transform = `translateX(calc(50vw - ${current * 360}px - 180px))`;
  }

  modal.addEventListener("wheel", e=>{
    if(e.deltaY > 0 && current < images.length-1) current++;
    if(e.deltaY < 0 && current > 0) current--;
    update();
  });

  closeBtn.onclick = ()=> modal.remove();
}
