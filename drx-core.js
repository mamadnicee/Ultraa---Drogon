(() => {
  const container = document.getElementById("drx-core");

  if (!container) {
    console.error("DRX CORE: #drx-core not found.");
    return;
  }

  if (typeof THREE === "undefined") {
    console.error("DRX CORE: Three.js is not loaded.");
    return;
  }

  // =========================
  // SCENE
  // =========================

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  renderer.setSize(
    container.clientWidth,
    container.clientHeight
  );

  renderer.outputEncoding = THREE.sRGBEncoding;

  container.insertBefore(
    renderer.domElement,
    container.firstChild
  );

  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.zIndex = "0";
  renderer.domElement.style.pointerEvents = "none";

  // =========================
  // DRX CORE OBJECT
  // =========================

  const core = new THREE.Group();
  scene.add(core);

  // Main sphere

  const sphereGeometry = new THREE.IcosahedronGeometry(
    1.25,
    3
  );

  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00aa,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });

  const sphere = new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
  );

  core.add(sphere);

  // =========================
  // INNER ENERGY CORE
  // =========================

  const innerGeometry =
    new THREE.IcosahedronGeometry(0.65, 2);

  const innerMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x00e0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });

  const innerCore = new THREE.Mesh(
    innerGeometry,
    innerMaterial
  );

  core.add(innerCore);

  // =========================
  // ORBIT RINGS
  // =========================

  const rings = [];

  const ringColors = [
    0xff6a00,
    0xff00aa,
    0x00e0ff
  ];

  for (let i = 0; i < 3; i++) {

    const geometry =
      new THREE.TorusGeometry(
        1.65 + i * 0.28,
        0.012,
        8,
        128
      );

    const material =
      new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.8
      });

    const ring =
      new THREE.Mesh(geometry, material);

    ring.rotation.x =
      Math.PI / 2 + i * 0.45;

    ring.rotation.y =
      i * 0.6;

    core.add(ring);

    rings.push(ring);
  }

  // =========================
  // PARTICLES
  // =========================

  const particleCount = 450;

  const positions =
    new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {

    const radius =
      2.0 + Math.random() * 2.5;

    const theta =
      Math.random() * Math.PI * 2;

    const phi =
      Math.acos(
        2 * Math.random() - 1
      );

    positions[i * 3] =
      radius *
      Math.sin(phi) *
      Math.cos(theta);

    positions[i * 3 + 1] =
      radius *
      Math.sin(phi) *
      Math.sin(theta);

    positions[i * 3 + 2] =
      radius *
      Math.cos(phi);
  }

  const particleGeometry =
    new THREE.BufferGeometry();

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  const particleMaterial =
    new THREE.PointsMaterial({
      color: 0x00e0ff,
      size: 0.025,
      transparent: true,
      opacity: 0.75
    });

  const particles =
    new THREE.Points(
      particleGeometry,
      particleMaterial
    );

  scene.add(particles);

  // =========================
  // MOUSE INTERACTION
  // =========================

  let mouseX = 0;
  let mouseY = 0;

  container.addEventListener(
    "pointermove",
    (event) => {

      const rect =
        container.getBoundingClientRect();

      mouseX =
        ((event.clientX - rect.left) /
          rect.width - 0.5) * 2;

      mouseY =
        ((event.clientY - rect.top) /
          rect.height - 0.5) * 2;
    }
  );

  // =========================
  // BUTTON SYSTEM
  // =========================

  const buttons =
    document.querySelectorAll(
      "[data-core-target]"
    );

  buttons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const target =
          button.dataset.coreTarget;

        activateMode(target);
      }
    );
  });

  function activateMode(mode) {

    if (mode === "gpu") {

      sphereMaterial.color.set(
        0x00e0ff
      );

      innerMaterial.color.set(
        0x00ffff
      );

      particleMaterial.color.set(
        0x00e0ff
      );

    }

    if (mode === "ai") {

      sphereMaterial.color.set(
        0xff00aa
      );

      innerMaterial.color.set(
        0xb388ff
      );

      particleMaterial.color.set(
        0xff00aa
      );

    }

    if (mode === "formula") {

      sphereMaterial.color.set(
        0xff6a00
      );

      innerMaterial.color.set(
        0xffaa00
      );

      particleMaterial.color.set(
        0xff6a00
      );

    }

    if (mode === "visuals") {

      sphereMaterial.color.set(
        0xff00aa
      );

      innerMaterial.color.set(
        0x00e0ff
      );

      particleMaterial.color.set(
        0x00e0ff
      );
    }
  }

  // =========================
  // RESIZE
  // =========================

  function resize() {

    const width =
      container.clientWidth;

    const height =
      container.clientHeight;

    if (!width || !height) return;

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height
    );
  }

  window.addEventListener(
    "resize",
    resize
  );

  resize();

  // =========================
  // ANIMATION
  // =========================

  const clock =
    new THREE.Clock();

  function animate() {

    requestAnimationFrame(
      animate
    );

    const time =
      clock.getElapsedTime();

    sphere.rotation.x =
      time * 0.18;

    sphere.rotation.y =
      time * 0.28;

    innerCore.rotation.x =
      -time * 0.35;

    innerCore.rotation.y =
      time * 0.45;

    rings.forEach(
      (ring, index) => {

        ring.rotation.z =
          time *
          (0.25 + index * 0.12);

        ring.rotation.x +=
          Math.sin(time * 0.3) *
          0.001;
      }
    );

    particles.rotation.y =
      time * 0.025;

    particles.rotation.x =
      time * 0.012;

    // Mouse movement

    core.rotation.y +=
      (mouseX * 0.35 -
        core.rotation.y) * 0.025;

    core.rotation.x +=
      (-mouseY * 0.25 -
        core.rotation.x) * 0.025;

    // Breathing effect

    const scale =
      1 +
      Math.sin(time * 1.5) *
      0.025;

    core.scale.set(
      scale,
      scale,
      scale
    );

    renderer.render(
      scene,
      camera
    );
  }

  animate();

})();
