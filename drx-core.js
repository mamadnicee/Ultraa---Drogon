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
// DRX DEEP SPACE ENVIRONMENT
// =========================

// ---------- NEBULA TEXTURE ----------

function createNebulaTexture() {

  const canvas =
    document.createElement("canvas");

  canvas.width = 512;
  canvas.height = 512;

  const ctx =
    canvas.getContext("2d");

  const gradient =
    ctx.createRadialGradient(
      256, 256, 0,
      256, 256, 256
    );

  gradient.addColorStop(
    0,
    "rgba(0,224,255,0.20)"
  );

  gradient.addColorStop(
    0.25,
    "rgba(40,80,255,0.12)"
  );

  gradient.addColorStop(
    0.55,
    "rgba(255,0,170,0.07)"
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  return new THREE.CanvasTexture(canvas);
}


// ---------- NEBULA ----------

const nebulaTexture =
  createNebulaTexture();

const nebulaGroup =
  new THREE.Group();

scene.add(nebulaGroup);


function createNebula(
  x,
  y,
  z,
  scale,
  opacity,
  rotation
) {

  const material =
    new THREE.SpriteMaterial({

      map: nebulaTexture,

      color: 0x5d8cff,

      transparent: true,

      opacity: opacity,

      depthWrite: false,

      blending:
        THREE.AdditiveBlending
    });

  const sprite =
    new THREE.Sprite(material);

  sprite.position.set(
    x,
    y,
    z
  );

  sprite.scale.set(
    scale,
    scale,
    1
  );

  sprite.material.rotation =
    rotation;

  nebulaGroup.add(sprite);

  return sprite;
}


const nebula1 =
  createNebula(
    -2.5,
    0.5,
    -2,
    5.5,
    0.38,
    0.2
  );

const nebula2 =
  createNebula(
    2.5,
    -0.4,
    -3,
    5,
    0.30,
    -0.5
  );

const nebula3 =
  createNebula(
    0,
    1.8,
    -4,
    4,
    0.22,
    0.8
  );
  // =========================
// DRX CORE GLOW
// =========================

const glowMaterial =
  new THREE.SpriteMaterial({
    map: nebulaTexture,
    color: 0x00e0ff,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

const coreGlow =
  new THREE.Sprite(glowMaterial);

coreGlow.position.set(
  0,
  0,
  -1.8
);

coreGlow.scale.set(
  3.8,
  3.8,
  1
);

scene.add(coreGlow);

// =========================
// REAL STAR FIELD
// =========================

function createStarLayer(count, minRadius, maxRadius, size, opacity) {

  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {

    const radius =
      minRadius +
      Math.random() * (maxRadius - minRadius);

    const angle =
      Math.random() * Math.PI * 2;

    positions[i * 3] =
      Math.cos(angle) * radius;

    positions[i * 3 + 1] =
      (Math.random() - 0.5) * 6;

    positions[i * 3 + 2] =
      Math.sin(angle) * radius;
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const material =
    new THREE.PointsMaterial({

      color: 0xffffff,

      size: size,

      transparent: true,

      opacity: opacity,

      depthWrite: false,

      blending: THREE.AdditiveBlending
    });

  return new THREE.Points(
    geometry,
    material
  );
}

const farStars =
  createStarLayer(1400, 5, 14, 0.035, 0.65);

const midStars =
  createStarLayer(700, 3.5, 9, 0.055, 0.8);

const nearStars =
  createStarLayer(250, 2.5, 6, 0.085, 1);

scene.add(
  farStars,
  midStars,
  nearStars
);

// ---------- GALAXY CORE DUST ----------

const particleCount =
  1200;

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
    2.2 +
    Math.pow(
      Math.random(),
      0.65
    ) * 5;

  const angle =
    Math.random() *
    Math.PI * 2;

  const spiral =
    angle +
    radius * 0.55;

  const spread =
    (Math.random() - 0.5) *
    (0.4 + radius * 0.12);

  positions[i * 3] =
    Math.cos(spiral) *
    radius;

  positions[i * 3 + 1] =
    spread;

  positions[i * 3 + 2] =
    Math.sin(spiral) *
    radius;
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

    size: 0.032,

    transparent: true,

    opacity: 0.75,

    depthWrite: false,

    blending:
      THREE.AdditiveBlending
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
// SPACE PARALLAX
// =========================
  
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
// DEEP SPACE MOTION
// =========================

farStars.rotation.y =
  time * 0.004;

farStars.rotation.z =
  time * 0.001;

midStars.rotation.y =
  -time * 0.009;

midStars.rotation.z =
  time * 0.003;

nearStars.rotation.y =
  time * 0.018;

nearStars.rotation.z =
  -time * 0.006;

// =========================
// PARALLAX RETURN
// =========================

farStars.position.x +=
  (targetX * 0.12 - farStars.position.x) * 0.02;

farStars.position.y +=
  (-targetY * 0.08 - farStars.position.y) * 0.02;

midStars.position.x +=
  (targetX * 0.25 - midStars.position.x) * 0.025;

midStars.position.y +=
  (-targetY * 0.16 - midStars.position.y) * 0.025;

nearStars.position.x +=
  (targetX * 0.45 - nearStars.position.x) * 0.035;

nearStars.position.y +=
  (-targetY * 0.28 - nearStars.position.y) * 0.035;
  
  
// Nebula breathing

nebulaGroup.rotation.y =
  time * 0.006;

nebulaGroup.rotation.z =
  Math.sin(time * 0.08) * 0.04;

nebula1.material.opacity =
  0.30 +
  Math.sin(time * 0.35) * 0.06;

nebula2.material.opacity =
  0.24 +
  Math.cos(time * 0.28) * 0.05;

nebula3.material.opacity =
  0.18 +
  Math.sin(time * 0.22) * 0.04;

// =========================
// CORE GLOW MOTION
// =========================

coreGlow.material.opacity =
  0.22 +
  Math.sin(time * 1.2) * 0.07;

coreGlow.scale.set(
  3.7 + Math.sin(time * 0.9) * 0.15,
  3.7 + Math.sin(time * 0.9) * 0.15,
  1
);

coreGlow.material.color.setHSL(
  0.52 + Math.sin(time * 0.15) * 0.04,
  1,
  0.55
);

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
