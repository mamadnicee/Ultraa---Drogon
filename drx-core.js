(() => {
  const container = document.getElementById("drx-core");

  if (!container || typeof THREE === "undefined") return;

  // =========================
  // SCENE
  // =========================

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 0.2, 7);

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

  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.zIndex = "1";
  renderer.domElement.style.pointerEvents = "auto";

  container.prepend(renderer.domElement);

  // =========================
  // LIGHTING
  // =========================

  scene.add(
    new THREE.AmbientLight(0xffffff, 1.2)
  );

  const cyanLight = new THREE.PointLight(
    0x00e0ff,
    6,
    12
  );

  cyanLight.position.set(3, 2, 4);
  scene.add(cyanLight);

  const pinkLight = new THREE.PointLight(
    0xff00aa,
    5,
    10
  );

  pinkLight.position.set(-3, -1, 3);
  scene.add(pinkLight);

  const orangeLight = new THREE.PointLight(
    0xff6a00,
    4,
    9
  );

  orangeLight.position.set(0, -3, 2);
  scene.add(orangeLight);

  // =========================
  // MODEL
  // =========================

  const loader = new THREE.GLTFLoader();

  let model = null;
  let modelScale = 1;
  let baseY = 0;
let baseRotationY = 0;

  loader.load(
    "models/drx-core.glb",

    (gltf) => {

      model = gltf.scene;

      model.traverse((object) => {

        if (!object.isMesh) return;

        object.castShadow = true;
        object.receiveShadow = true;

        if (object.material) {

          object.material.metalness =
            object.material.metalness ?? 0.75;

          object.material.roughness =
            object.material.roughness ?? 0.25;
        }
      });

      // =========================
      // AUTO SCALE
      // =========================

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

      const scale =
        3.1 / maxSize;

      model.scale.setScalar(scale);
      modelScale = scale;

      // Center model

      const center =
        new THREE.Vector3();

      box.getCenter(center);

      model.position.sub(
        center.multiplyScalar(scale)
      );

      model.position.y = 0;

baseY = model.position.y;
baseRotationY = model.rotation.y;

scene.add(model);
    },

    undefined,

    (error) => {
      console.error(
        "DRX CORE MODEL ERROR:",
        error
      );
    }
  );

  // =========================
// GALAXY — DEEP SPACE
// =========================

const particleCount = 1800;

const positions = new Float32Array(
  particleCount * 3
);

for (let i = 0; i < particleCount; i++) {

  const radius =
    1.8 + Math.pow(Math.random(), 0.65) * 6;

  const angle =
    Math.random() * Math.PI * 2;

  const spiral =
    angle + radius * 0.55;

  const spread =
    (Math.random() - 0.5) *
    (0.35 + radius * 0.12);

  positions[i * 3] =
    Math.cos(spiral) * radius;

  positions[i * 3 + 1] =
    spread;

  positions[i * 3 + 2] =
    Math.sin(spiral) * radius;
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

    color: 0x9eeaff,

    size: 0.035,

    transparent: true,

    opacity: 0.72,

    depthWrite: false,

    blending: THREE.AdditiveBlending
  });

const galaxy =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  );

scene.add(galaxy);

  // =========================
  // MOUSE / TOUCH
  // =========================

  let targetX = 0;
  let targetY = 0;

  container.addEventListener(
    "pointermove",
    (event) => {

      const rect =
        container.getBoundingClientRect();

      targetX =
        ((event.clientX - rect.left) /
          rect.width - 0.5) * 2;

      targetY =
        ((event.clientY - rect.top) /
          rect.height - 0.5) * 2;
    }
  );

  // =========================
  // BUTTONS
  // =========================

  const buttons =
    document.querySelectorAll(
      "[data-core-target]"
    );

  buttons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const mode =
          button.dataset.coreTarget;

        activateMode(mode);
      }
    );
  });

  function activateMode(mode) {

    if (mode === "gpu") {

      cyanLight.intensity = 7;
      pinkLight.intensity = 1.5;

      galaxy.material.color.set(
        0x00e0ff
      );
    }

    if (mode === "ai") {

      cyanLight.intensity = 2;
      pinkLight.intensity = 7;

      galaxy.material.color.set(
        0xff4fd8
      );
    }

    if (mode === "formula") {

      cyanLight.intensity = 2;
      orangeLight.intensity = 7;

      galaxy.material.color.set(
        0xff8a00
      );
    }

    if (mode === "visuals") {

      cyanLight.intensity = 5;
      pinkLight.intensity = 5;
      orangeLight.intensity = 4;

      galaxy.material.color.set(
        0xffffff
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


  // =========================
  // DRX CORE MODEL
  // =========================

  if (model) {

    // Smooth cinematic rotation
    model.rotation.y =
      baseRotationY +
      time * 0.16;


    // Mouse / touch parallax

    const targetRotX =
      targetY * 0.18;

    const targetRotZ =
      targetX * 0.12;

    model.rotation.x +=
      (targetRotX -
        model.rotation.x) * 0.035;

    model.rotation.z +=
      (targetRotZ -
        model.rotation.z) * 0.035;


    // Floating in space

    const floatY =
      Math.sin(time * 1.15) * 0.16;

    const floatX =
      Math.sin(time * 0.7) * 0.025;

    model.position.y =
      baseY + floatY;

    model.position.x =
      floatX;


    // Breathing scale

    const pulse =
      1 +
      Math.sin(time * 1.4) * 0.025;

    model.scale.setScalar(
      modelScale * pulse
    );
  }


  // =========================
  // GALAXY MOTION
  // =========================

  galaxy.rotation.y =
    time * 0.025;

  galaxy.rotation.z =
    time * 0.008;


  // =========================
  // CINEMATIC LIGHT MOVEMENT
  // =========================

  cyanLight.position.x =
    Math.sin(time * 0.7) * 4;

  cyanLight.position.y =
    Math.cos(time * 0.5) * 2;

  pinkLight.position.x =
    Math.cos(time * 0.6) * 4;

  pinkLight.position.y =
    Math.sin(time * 0.8) * 2;


  // =========================
  // LIGHT BREATHING
  // =========================


  // =========================
  // RENDER
  // =========================

  renderer.render(
    scene,
    camera
  );
}

animate();

})();
