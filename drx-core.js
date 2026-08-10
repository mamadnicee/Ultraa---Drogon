(() => {
  const container = document.getElementById("drx-core");

  if (!container) {
    console.error("DRX CORE: container not found.");
    return;
  }

  if (typeof THREE === "undefined") {
    console.error("DRX CORE: Three.js not loaded.");
    return;
  }

  if (typeof THREE.GLTFLoader === "undefined") {
    console.error("DRX CORE: GLTFLoader not loaded.");
    return;
  }

  // ==========================================
  // SCENE
  // ==========================================

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    40,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 0.4, 6.5);

  // ==========================================
  // RENDERER
  // ==========================================

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.8)
  );

  renderer.setSize(
    container.clientWidth,
    container.clientHeight
  );

  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.zIndex = "1";
  renderer.domElement.style.pointerEvents = "auto";

  container.appendChild(renderer.domElement);

  // ==========================================
  // LIGHTING
  // ==========================================

  const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.1
  );

  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(
    0x00e0ff,
    8,
    10
  );

  cyanLight.position.set(3, 2, 4);

  scene.add(cyanLight);

  const pinkLight = new THREE.PointLight(
    0xff00aa,
    7,
    10
  );

  pinkLight.position.set(-3, 1, 2);

  scene.add(pinkLight);

  const orangeLight = new THREE.PointLight(
    0xff6a00,
    6,
    9
  );

  orangeLight.position.set(0, -3, 2);

  scene.add(orangeLight);

  // ==========================================
  // GLB MODEL
  // ==========================================

  const loader = new THREE.GLTFLoader();

  let model = null;

  loader.load(
    "/models/drx-core.glb",

    (gltf) => {

      model = gltf.scene;

      // --------------------------
      // NORMALIZE MODEL SIZE
      // --------------------------

      const box =
        new THREE.Box3().setFromObject(model);

      const size = new THREE.Vector3();

      box.getSize(size);

      const maxSize =
        Math.max(
          size.x,
          size.y,
          size.z
        );

      const targetSize = 3.2;

      const scale =
        targetSize / maxSize;

      model.scale.setScalar(scale);

      // --------------------------
      // CENTER MODEL
      // --------------------------

      const centeredBox =
        new THREE.Box3().setFromObject(model);

      const center =
        centeredBox.getCenter(
          new THREE.Vector3()
        );

      model.position.sub(center);

      // --------------------------
      // MATERIAL SETTINGS
      // --------------------------

      model.traverse((child) => {

        if (!child.isMesh) return;

        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {

          child.material.needsUpdate = true;

          if (
            child.material.metalness !== undefined
          ) {
            child.material.metalness = 0.7;
          }

          if (
            child.material.roughness !== undefined
          ) {
            child.material.roughness = 0.28;
          }

        }

      });

      scene.add(model);

      console.log(
        "DRX CORE: GLB loaded successfully."
      );
    },

    (progress) => {

      if (
        progress.total > 0
      ) {

        const percent =
          (
            progress.loaded /
            progress.total
          ) * 100;

        console.log(
          `DRX CORE: ${percent.toFixed(0)}%`
        );

      }

    },

    (error) => {

      console.error(
        "DRX CORE: GLB loading failed.",
        error
      );

    }
  );

  // ==========================================
  // GALAXY PARTICLES
  // ==========================================

  const particleCount = 900;

  const positions =
    new Float32Array(
      particleCount * 3
    );

  for (
    let i = 0;
    i < particleCount;
    i++
  ) {

    const radius =
      2.5 +
      Math.random() * 4.5;

    const theta =
      Math.random() *
      Math.PI *
      2;

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
      size: 0.018,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });

  const particles =
    new THREE.Points(
      particleGeometry,
      particleMaterial
    );

  scene.add(particles);

  // ==========================================
  // INTERACTION
  // ==========================================

  let targetRotationX = 0;
  let targetRotationY = 0;

  let currentRotationX = 0;
  let currentRotationY = 0;

  let pointerDown = false;

  let lastX = 0;
  let lastY = 0;

  container.addEventListener(
    "pointerdown",
    (event) => {

      pointerDown = true;

      lastX = event.clientX;
      lastY = event.clientY;

    }
  );

  window.addEventListener(
    "pointerup",
    () => {

      pointerDown = false;

    }
  );

  container.addEventListener(
    "pointermove",
    (event) => {

      if (!pointerDown) return;
      if (!model) return;

      const deltaX =
        event.clientX - lastX;

      const deltaY =
        event.clientY - lastY;

      targetRotationY +=
        deltaX * 0.008;

      targetRotationX +=
        deltaY * 0.005;

      targetRotationX =
        Math.max(
          -0.8,
          Math.min(
            0.8,
            targetRotationX
          )
        );

      lastX = event.clientX;
      lastY = event.clientY;

    }
  );

  // ==========================================
  // BUTTON MODES
  // ==========================================

  const buttons =
    document.querySelectorAll(
      "[data-core-target]"
    );

  buttons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        activateMode(
          button.dataset.coreTarget
        );

      }
    );

  });

  function activateMode(mode) {

    if (mode === "gpu") {

      cyanLight.color.set(
        0x00e0ff
      );

      pinkLight.color.set(
        0x0066ff
      );

      orangeLight.color.set(
        0x00ffff
      );

      particleMaterial.color.set(
        0x00e0ff
      );

    }

    if (mode === "ai") {

      cyanLight.color.set(
        0xff00aa
      );

      pinkLight.color.set(
        0xb388ff
      );

      orangeLight.color.set(
        0xff00aa
      );

      particleMaterial.color.set(
        0xff00aa
      );

    }

    if (mode === "formula") {

      cyanLight.color.set(
        0xff6a00
      );

      pinkLight.color.set(
        0xff3300
      );

      orangeLight.color.set(
        0xffaa00
      );

      particleMaterial.color.set(
        0xff6a00
      );

    }

    if (mode === "visuals") {

      cyanLight.color.set(
        0x00e0ff
      );

      pinkLight.color.set(
        0xff00aa
      );

      orangeLight.color.set(
        0x00e0ff
      );

      particleMaterial.color.set(
        0x00e0ff
      );

    }

  }

  // ==========================================
  // RESIZE
  // ==========================================

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

  // ==========================================
  // ANIMATION
  // ==========================================

  const clock =
    new THREE.Clock();

  function animate() {

    requestAnimationFrame(
      animate
    );

    const time =
      clock.getElapsedTime();

    // --------------------------
    // MODEL
    // --------------------------

    if (model) {

      currentRotationY +=
        (
          targetRotationY -
          currentRotationY
        ) * 0.08;

      currentRotationX +=
        (
          targetRotationX -
          currentRotationX
        ) * 0.08;

      model.rotation.y =
        currentRotationY +
        Math.sin(time * 0.45) * 0.035;

      model.rotation.x =
        currentRotationX;

      // subtle floating

      model.position.y =
        Math.sin(time * 0.9) * 0.06;

    }

    // --------------------------
    // GALAXY
    // --------------------------

    particles.rotation.y =
      time * 0.018;

    particles.rotation.x =
      time * 0.006;

    // --------------------------
    // LIGHT MOTION
    // --------------------------

    cyanLight.position.x =
      Math.sin(time * 0.7) * 3;

    cyanLight.position.z =
      Math.cos(time * 0.7) * 3;

    pinkLight.position.x =
      Math.cos(time * 0.5) * 3;

    pinkLight.position.z =
      Math.sin(time * 0.5) * 3;

    // --------------------------
    // RENDER
    // --------------------------

    renderer.render(
      scene,
      camera
    );

  }

  animate();

})();
