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

  // =========================================================
  // CLEAN PREVIOUS CORE
  // =========================================================

  const oldCanvas = container.querySelector("canvas");

  if (oldCanvas) {
    oldCanvas.remove();
  }

  // =========================================================
  // SCENE
  // =========================================================

  const scene = new THREE.Scene();

  const width = container.clientWidth || 900;
  const height = container.clientHeight || 460;

  const camera = new THREE.PerspectiveCamera(
    40,
    width / height,
    0.1,
    100
  );

  camera.position.set(0, 0, 7.2);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  renderer.setSize(width, height);

  renderer.outputEncoding =
    THREE.sRGBEncoding;

  renderer.domElement.style.position =
    "absolute";

  renderer.domElement.style.inset =
    "0";

  renderer.domElement.style.width =
    "100%";

  renderer.domElement.style.height =
    "100%";

  renderer.domElement.style.zIndex =
    "1";

  renderer.domElement.style.pointerEvents =
    "none";

  container.insertBefore(
    renderer.domElement,
    container.firstChild
  );

  // =========================================================
  // MASTER CORE
  // =========================================================

  const core = new THREE.Group();

  scene.add(core);

  // =========================================================
  // OUTER ENERGY SHELL
  // =========================================================

  const shellGeometry =
    new THREE.IcosahedronGeometry(
      1.42,
      4
    );

  const shellMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x00e0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });

  const shell =
    new THREE.Mesh(
      shellGeometry,
      shellMaterial
    );

  core.add(shell);

  // =========================================================
  // MAIN CORE
  // =========================================================

  const mainGeometry =
    new THREE.IcosahedronGeometry(
      1.08,
      4
    );

  const mainMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xff00aa,
      wireframe: true,
      transparent: true,
      opacity: 0.82
    });

  const mainCore =
    new THREE.Mesh(
      mainGeometry,
      mainMaterial
    );

  core.add(mainCore);

  // =========================================================
  // INNER REACTOR
  // =========================================================

  const reactorGeometry =
    new THREE.IcosahedronGeometry(
      0.57,
      3
    );

  const reactorMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x00e0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.95
    });

  const reactor =
    new THREE.Mesh(
      reactorGeometry,
      reactorMaterial
    );

  core.add(reactor);

  // =========================================================
  // REACTOR LIGHT
  // =========================================================

  const reactorLightGeometry =
    new THREE.SphereGeometry(
      0.20,
      24,
      24
    );

  const reactorLightMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });

  const reactorLight =
    new THREE.Mesh(
      reactorLightGeometry,
      reactorLightMaterial
    );

  core.add(reactorLight);

  // =========================================================
  // REACTOR HALO
  // =========================================================

  const haloGeometry =
    new THREE.SphereGeometry(
      0.34,
      32,
      32
    );

  const haloMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x00e0ff,
      transparent: true,
      opacity: 0.13,
      wireframe: true
    });

  const halo =
    new THREE.Mesh(
      haloGeometry,
      haloMaterial
    );

  core.add(halo);

  // =========================================================
  // ENERGY SHARDS
  // =========================================================

  const shards =
    new THREE.Group();

  core.add(shards);

  const shardMaterials = [
    new THREE.MeshBasicMaterial({
      color: 0x00e0ff,
      transparent: true,
      opacity: 0.75
    }),

    new THREE.MeshBasicMaterial({
      color: 0xff00aa,
      transparent: true,
      opacity: 0.72
    }),

    new THREE.MeshBasicMaterial({
      color: 0xff6a00,
      transparent: true,
      opacity: 0.72
    })
  ];

  for (let i = 0; i < 28; i++) {

    const geometry =
      new THREE.OctahedronGeometry(
        0.055 +
        Math.random() * 0.075,
        0
      );

    const shard =
      new THREE.Mesh(
        geometry,
        shardMaterials[
          i % shardMaterials.length
        ]
      );

    const angle =
      Math.random() *
      Math.PI *
      2;

    const radius =
      1.45 +
      Math.random() * 0.9;

    shard.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 1.9,
      Math.sin(angle) * radius
    );

    shard.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    shard.userData = {
      angle,
      radius,
      speed:
        0.15 +
        Math.random() * 0.35,

      offset:
        Math.random() *
        Math.PI *
        2
    };

    shards.add(shard);
  }

  // =========================================================
  // PRECISION ORBITAL SYSTEM
  // =========================================================

  const orbitSystem =
    new THREE.Group();

  core.add(orbitSystem);

  const orbitRings = [];

  const orbitConfig = [
    {
      radius: 1.58,
      color: 0x00e0ff,
      rotation: [1.25, 0.25, 0]
    },
    {
      radius: 1.82,
      color: 0xff00aa,
      rotation: [0.55, 0.85, 0.4]
    },
    {
      radius: 2.05,
      color: 0xff6a00,
      rotation: [1.75, -0.45, 0.2]
    }
  ];

  orbitConfig.forEach(
    (config, index) => {

      const geometry =
        new THREE.TorusGeometry(
          config.radius,
          0.009,
          6,
          180,
          Math.PI * 1.42
        );

      const material =
        new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: 0.46
        });

      const ring =
        new THREE.Mesh(
          geometry,
          material
        );

      ring.rotation.set(
        config.rotation[0],
        config.rotation[1],
        config.rotation[2]
      );

      ring.userData.speed =
        0.10 +
        index * 0.055;

      orbitSystem.add(ring);

      orbitRings.push(ring);
    }
  );

  // =========================================================
  // ORBIT NODES
  // =========================================================

  const nodes =
    new THREE.Group();

  core.add(nodes);

  for (let i = 0; i < 9; i++) {

    const nodeGeometry =
      new THREE.SphereGeometry(
        0.035,
        12,
        12
      );

    const nodeMaterial =
      new THREE.MeshBasicMaterial({
        color:
          i % 3 === 0
            ? 0x00e0ff
            : i % 3 === 1
            ? 0xff00aa
            : 0xff6a00,

        transparent: true,
        opacity: 0.85
      });

    const node =
      new THREE.Mesh(
        nodeGeometry,
        nodeMaterial
      );

    const angle =
      (i / 9) *
      Math.PI *
      2;

    const radius =
      1.78;

    node.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 1.7) * 0.65,
      Math.sin(angle) * radius
    );

    node.userData.angle =
      angle;

    node.userData.index =
      i;

    nodes.add(node);
  }

  // =========================================================
  // GALACTIC FIELD
  // =========================================================

  const galaxyCount = 1150;

  const galaxyPositions =
    new Float32Array(
      galaxyCount * 3
    );

  for (
    let i = 0;
    i < galaxyCount;
    i++
  ) {

    const radius =
      2.1 +
      Math.random() * 3.8;

    const angle =
      Math.random() *
      Math.PI *
      2;

    const spiral =
      angle +
      radius * 0.82;

    const thickness =
      (Math.random() - 0.5) *
      (0.35 + radius * 0.12);

    galaxyPositions[
      i * 3
    ] =
      Math.cos(spiral) *
        radius +
      thickness;

    galaxyPositions[
      i * 3 + 1
    ] =
      (Math.random() - 0.5) *
      2.1;

    galaxyPositions[
      i * 3 + 2
    ] =
      Math.sin(spiral) *
        radius +
      thickness;
  }

  const galaxyGeometry =
    new THREE.BufferGeometry();

  galaxyGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      galaxyPositions,
      3
    )
  );

  const galaxyMaterial =
    new THREE.PointsMaterial({
      color: 0x00e0ff,
      size: 0.026,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });

  const galaxy =
    new THREE.Points(
      galaxyGeometry,
      galaxyMaterial
    );

  scene.add(galaxy);

  // =========================================================
  // INNER PARTICLE CLOUD
  // =========================================================

  const innerCount = 220;

  const innerPositions =
    new Float32Array(
      innerCount * 3
    );

  for (
    let i = 0;
    i < innerCount;
    i++
  ) {

    const radius =
      0.7 +
      Math.random() * 1.1;

    const theta =
      Math.random() *
      Math.PI *
      2;

    const phi =
      Math.acos(
        2 * Math.random() - 1
      );

    innerPositions[i * 3] =
      radius *
      Math.sin(phi) *
      Math.cos(theta);

    innerPositions[i * 3 + 1] =
      radius *
      Math.sin(phi) *
      Math.sin(theta);

    innerPositions[i * 3 + 2] =
      radius *
      Math.cos(phi);
  }

  const innerGeometry =
    new THREE.BufferGeometry();

  innerGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      innerPositions,
      3
    )
  );

  const innerMaterial =
    new THREE.PointsMaterial({
      color: 0xff00aa,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });

  const innerParticles =
    new THREE.Points(
      innerGeometry,
      innerMaterial
    );

  core.add(innerParticles);

  // =========================================================
  // POINTER
  // =========================================================

  let pointerX = 0;
  let pointerY = 0;

  let targetPointerX = 0;
  let targetPointerY = 0;

  function updatePointer(
    x,
    y
  ) {

    const rect =
      container.getBoundingClientRect();

    targetPointerX =
      (
        (x - rect.left) /
        rect.width -
        0.5
      ) * 2;

    targetPointerY =
      (
        (y - rect.top) /
        rect.height -
        0.5
      ) * 2;
  }

  container.addEventListener(
    "pointermove",
    event => {

      updatePointer(
        event.clientX,
        event.clientY
      );

    }
  );

  container.addEventListener(
    "pointerleave",
    () => {

      targetPointerX = 0;
      targetPointerY = 0;

    }
  );

  // =========================================================
  // BUTTONS
  // =========================================================

  const buttons =
    document.querySelectorAll(
      "[data-core-target]"
    );

  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const mode =
            button.dataset.coreTarget;

          activateMode(mode);

          buttons.forEach(
            b =>
              b.classList.remove(
                "active"
              )
          );

          button.classList.add(
            "active"
          );

        }
      );

    }
  );

  // =========================================================
  // MODE SYSTEM
  // =========================================================

  function activateMode(mode) {

    if (mode === "gpu") {

      mainMaterial.color.set(
        0x00e0ff
      );

      reactorMaterial.color.set(
        0x00ffff
      );

      shellMaterial.color.set(
        0x00e0ff
      );

      galaxyMaterial.color.set(
        0x00e0ff
      );

      innerMaterial.color.set(
        0x00ffff
      );

      haloMaterial.color.set(
        0x00e0ff
      );

      reactorLightMaterial.color.set(
        0xffffff
      );

    }

    if (mode === "ai") {

      mainMaterial.color.set(
        0xff00aa
      );

      reactorMaterial.color.set(
        0xb388ff
      );

      shellMaterial.color.set(
        0xff00aa
      );

      galaxyMaterial.color.set(
        0xff00aa
      );

      innerMaterial.color.set(
        0xb388ff
      );

      haloMaterial.color.set(
        0xff00aa
      );

      reactorLightMaterial.color.set(
        0xffd9ff
      );

    }

    if (mode === "formula") {

      mainMaterial.color.set(
        0xff6a00
      );

      reactorMaterial.color.set(
        0xffaa00
      );

      shellMaterial.color.set(
        0xff6a00
      );

      galaxyMaterial.color.set(
        0xff6a00
      );

      innerMaterial.color.set(
        0xffaa00
      );

      haloMaterial.color.set(
        0xff6a00
      );

      reactorLightMaterial.color.set(
        0xffffdd
      );

    }

    if (mode === "visuals") {

      mainMaterial.color.set(
        0xff00aa
      );

      reactorMaterial.color.set(
        0x00e0ff
      );

      shellMaterial.color.set(
        0xff00aa
      );

      galaxyMaterial.color.set(
        0x00e0ff
      );

      innerMaterial.color.set(
        0xff00aa
      );

      haloMaterial.color.set(
        0x00e0ff
      );

      reactorLightMaterial.color.set(
        0xffffff
      );

    }
  }

  // =========================================================
  // RESIZE
  // =========================================================

  function resize() {

    const w =
      container.clientWidth;

    const h =
      container.clientHeight;

    if (!w || !h) {
      return;
    }

    camera.aspect =
      w / h;

    camera.updateProjectionMatrix();

    renderer.setSize(
      w,
      h
    );

  }

  window.addEventListener(
    "resize",
    resize
  );

  resize();

  // =========================================================
  // ANIMATION
  // =========================================================

  const clock =
    new THREE.Clock();

  function animate() {

    requestAnimationFrame(
      animate
    );

    const time =
      clock.getElapsedTime();

    // -------------------------------------------------------
    // POINTER SMOOTHING
    // -------------------------------------------------------

    pointerX +=
      (
        targetPointerX -
        pointerX
      ) * 0.045;

    pointerY +=
      (
        targetPointerY -
        pointerY
      ) * 0.045;

    // -------------------------------------------------------
    // CORE ROTATION
    // -------------------------------------------------------

    mainCore.rotation.x =
      time * 0.14;

    mainCore.rotation.y =
      time * 0.22;

    reactor.rotation.x =
      -time * 0.38;

    reactor.rotation.y =
      time * 0.55;

    shell.rotation.x =
      time * 0.035;

    shell.rotation.y =
      -time * 0.05;

    // -------------------------------------------------------
    // INNER PARTICLES
    // -------------------------------------------------------

    innerParticles.rotation.y =
      time * 0.28;

    innerParticles.rotation.x =
      time * 0.11;

    // -------------------------------------------------------
    // GALAXY
    // -------------------------------------------------------

    galaxy.rotation.y =
      time * 0.014;

    galaxy.rotation.x =
      Math.sin(time * 0.12) *
      0.035;

    // -------------------------------------------------------
    // ORBIT SYSTEM
    // -------------------------------------------------------

    orbitSystem.rotation.y =
      time * 0.075;

    orbitSystem.rotation.x =
      Math.sin(time * 0.3) *
      0.06;

    orbitRings.forEach(
      (ring, index) => {

        ring.rotation.z =
          time *
          (
            ring.userData.speed
          );

      }
    );

    // -------------------------------------------------------
    // NODES
    // -------------------------------------------------------

    nodes.rotation.y =
      time * 0.12;

    nodes.children.forEach(
      node => {

        const angle =
          node.userData.angle +
          time * 0.22;

        node.position.x =
          Math.cos(angle) *
          1.78;

        node.position.z =
          Math.sin(angle) *
          1.78;

        node.position.y =
          Math.sin(
            angle * 2 +
            time
          ) *
          0.42;

      }
    );

    // -------------------------------------------------------
    // SHARDS
    // -------------------------------------------------------

    shards.rotation.y =
      time * 0.13;

    shards.children.forEach(
      shard => {

        const data =
          shard.userData;

        const angle =
          data.angle +
          time *
          data.speed;

        const radius =
          data.radius +
          Math.sin(
            time * 1.2 +
            data.offset
          ) *
          0.08;

        shard.position.x =
          Math.cos(angle) *
          radius;

        shard.position.z =
          Math.sin(angle) *
          radius;

        shard.position.y =
          Math.sin(
            time * 1.4 +
            data.offset
          ) *
          0.9;

        shard.rotation.x +=
          0.012;

        shard.rotation.y +=
          0.018;

      }
    );

    // -------------------------------------------------------
    // REACTOR PULSE
    // -------------------------------------------------------

    const pulse =
      1 +
      Math.sin(time * 2.4) *
      0.055;

    reactor.scale.set(
      pulse,
      pulse,
      pulse
    );

    const lightPulse =
      0.82 +
      Math.sin(time * 3.4) *
      0.18;

    reactorLight.scale.set(
      lightPulse,
      lightPulse,
      lightPulse
    );

    halo.scale.set(
      1 +
      lightPulse * 0.18,
      1 +
      lightPulse * 0.18,
      1 +
      lightPulse * 0.18
    );

    reactorLightMaterial.opacity =
      lightPulse;

    // -------------------------------------------------------
    // MOUSE / TOUCH PARALLAX
    // -------------------------------------------------------

    core.rotation.y +=
      (
        pointerX * 0.42 -
        core.rotation.y
      ) * 0.035;

    core.rotation.x +=
      (
        -pointerY * 0.28 -
        core.rotation.x
      ) * 0.035;

    galaxy.position.x +=
      (
        pointerX * 0.16 -
        galaxy.position.x
      ) * 0.012;

    galaxy.position.y +=
      (
        -pointerY * 0.10 -
        galaxy.position.y
      ) * 0.012;

    // -------------------------------------------------------
    // FINAL RENDER
    // -------------------------------------------------------

    renderer.render(
      scene,
      camera
    );

  }

  // =========================================================
  // DEFAULT MODE
  // =========================================================

  activateMode("visuals");

  animate();

})();
