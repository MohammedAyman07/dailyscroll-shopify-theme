/**
 * DAILYSCROLL3D — Three.js Hyper-Realistic 3D Orb
 * Matches the reference: massive glossy black chrome sphere
 * with city building reflections, mouse-reactive lighting,
 * gentle idle animation, and scroll parallax.
 */

(function() {
  'use strict';

  const container = document.getElementById('orbContainer');
  const canvas    = document.getElementById('orbCanvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  // ── RENDERER ─────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = false;

  function setSize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // ── SCENE / CAMERA ────────────────────────────────────────
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  // ── PROCEDURAL ENVIRONMENT (cubemap of city skyline) ─────
  // Build a 512×512 cubemap that simulates a dark city environment
  function buildCityEnvMap() {
    const size = 512;
    const faces = 6; // +X, -X, +Y, -Y, +Z, -Z
    const textures = [];

    for (let f = 0; f < faces; f++) {
      const offscreen = document.createElement('canvas');
      offscreen.width  = size;
      offscreen.height = size;
      const c = offscreen.getContext('2d');

      // Very dark sky background
      c.fillStyle = '#000000';
      c.fillRect(0, 0, size, size);

      // Only draw buildings on side & bottom faces (not top face = sky)
      if (f !== 2) { // face 2 = +Y (top)
        // Subtle dark blue-black gradient sky
        const sky = c.createLinearGradient(0, 0, 0, size);
        sky.addColorStop(0, '#00000a');
        sky.addColorStop(1, '#000000');
        c.fillStyle = sky;
        c.fillRect(0, 0, size, size);

        // Draw building silhouettes — dark buildings slightly lighter than sky
        const numBuildings = 18 + Math.floor(Math.random() * 10);
        const seed = f * 137; // deterministic per face

        for (let b = 0; b < numBuildings; b++) {
          // Deterministic pseudo-random based on face & building index
          const bx   = ((seed * (b + 1) * 73) % size);
          const bw   = 20 + ((seed * (b + 3) * 41) % 50);
          const bh   = 80 + ((seed * (b + 7) * 97) % (size * 0.6));
          const by   = size - bh;

          // Dark building body — very subtly lighter than background
          const alpha = 0.08 + ((seed * (b + 11) * 29) % 8) / 100;
          c.fillStyle = `rgba(30,35,40,${alpha})`;
          c.fillRect(bx - bw / 2, by, bw, bh);

          // Window grid — very faint dots of warm light
          const numWindows = Math.floor(bh / 14);
          for (let w = 0; w < numWindows; w++) {
            if (((seed * (b + 1) * (w + 13) * 53) % 3) < 1) continue; // skip some
            const wx = bx - bw / 2 + 4 + ((seed * w * 7) % (bw - 8));
            const wy = by + 8 + w * 13;
            const wOpacity = 0.04 + ((seed * b * w * 11) % 6) / 100;
            c.fillStyle = `rgba(200,190,140,${wOpacity})`;
            c.fillRect(wx, wy, 3, 5);
          }
        }

        // Faint ground glow
        const groundGlow = c.createLinearGradient(0, size * 0.75, 0, size);
        groundGlow.addColorStop(0, 'rgba(0,0,0,0)');
        groundGlow.addColorStop(1, 'rgba(20,25,10,0.15)');
        c.fillStyle = groundGlow;
        c.fillRect(0, size * 0.75, size, size * 0.25);
      }

      // Convert canvas to THREE.Texture
      const tex = new THREE.CanvasTexture(offscreen);
      tex.encoding = THREE.sRGBEncoding;
      textures.push(tex);
    }

    // Build CubeRenderTarget from textures
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const cubeRT = new THREE.WebGLCubeRenderTarget(size);
    cubeRT.fromEquirectangularTexture(renderer, buildEquirectangularFromFaces(textures, size));

    const envMap = pmrem.fromCubemap(cubeRT.texture).texture;
    pmrem.dispose();
    cubeRT.dispose();
    return envMap;
  }

  // Build a flat equirectangular environment texture with city look
  function buildEquirectangularFromFaces(faces, size) {
    const w = size * 4;
    const h = size * 2;
    const offscreen = document.createElement('canvas');
    offscreen.width  = w;
    offscreen.height = h;
    const c = offscreen.getContext('2d');

    // Very dark sky
    c.fillStyle = '#000000';
    c.fillRect(0, 0, w, h);

    // Subtle dark sky gradient
    const sky = c.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0,   '#00000a');
    sky.addColorStop(0.4, '#000008');
    sky.addColorStop(0.5, '#00000f');
    sky.addColorStop(1,   '#000000');
    c.fillStyle = sky;
    c.fillRect(0, 0, w, h);

    // Draw city on the equator band
    const horizonY = h * 0.52;
    const numBuildings = 80;

    for (let b = 0; b < numBuildings; b++) {
      const bx   = (b / numBuildings) * w;
      const bw   = 20 + ((b * 73 + 17) % 60);
      const bh   = 40 + ((b * 97 + 31) % (h * 0.32));
      const by   = horizonY - bh;

      // Building silhouette — dark, barely visible
      const darkVal = 12 + (b % 8) * 2;
      c.fillStyle = `rgb(${darkVal},${darkVal+2},${darkVal+1})`;
      c.fillRect(bx, by, bw, bh);

      // Subtle building edge highlight (reflective glass)
      c.strokeStyle = `rgba(40,50,40,0.3)`;
      c.lineWidth = 0.5;
      c.strokeRect(bx, by, bw, bh);

      // Windows — very faint warm light
      const rows = Math.floor(bh / 12);
      const cols = Math.floor(bw / 9);
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          if (((b * 17 + r * 13 + col * 7) % 4) < 2) continue;
          const wx = bx + 2 + col * 9;
          const wy = by + 4 + r * 12;
          const wBrightness = 0.03 + ((b + r + col) % 5) * 0.01;
          c.fillStyle = `rgba(220,200,150,${wBrightness})`;
          c.fillRect(wx, wy, 4, 6);
        }
      }
    }

    // Slight lime-green ambient from left (neon sign)
    const neonGlow = c.createRadialGradient(w * 0.15, horizonY, 0, w * 0.15, horizonY, w * 0.2);
    neonGlow.addColorStop(0, 'rgba(180,255,0,0.04)');
    neonGlow.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = neonGlow;
    c.fillRect(0, 0, w, h);

    // Blue-ish neon from right
    const neon2 = c.createRadialGradient(w * 0.75, horizonY, 0, w * 0.75, horizonY, w * 0.18);
    neon2.addColorStop(0, 'rgba(0,100,200,0.04)');
    neon2.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = neon2;
    c.fillRect(0, 0, w, h);

    const tex = new THREE.CanvasTexture(offscreen);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  // ── ENVIRONMENT ───────────────────────────────────────────
  const pmrem   = new THREE.PMREMGenerator(renderer);
  const eqTex   = buildEquirectangularFromFaces([], 512);
  const envMap  = pmrem.fromEquirectangular(eqTex).texture;
  eqTex.dispose();
  pmrem.dispose();
  scene.environment = envMap;

  // ── SPHERE GEOMETRY ───────────────────────────────────────
  // Use icosahedron for slightly faceted look at top (like reference)
  // Combine a smooth lower half with faceted top by using SphereGeometry
  // with flat shading on top caps.
  const geometry = new THREE.SphereGeometry(1.8, 128, 128);

  // ── MATERIAL — ultra-realistic black chrome ──────────────
  const material = new THREE.MeshPhysicalMaterial({
    color:            new THREE.Color(0x050505),   // near-black
    metalness:        1.0,
    roughness:        0.03,                         // almost mirror
    reflectivity:     1.0,
    envMap:           envMap,
    envMapIntensity:  2.5,
    clearcoat:        1.0,
    clearcoatRoughness: 0.01,
  });

  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // ── LIGHTS ───────────────────────────────────────────────
  // Key light — bright white specular (top-right, mimics reference)
  const keyLight = new THREE.PointLight(0xffffff, 4.0, 20);
  keyLight.position.set(3, 4, 3);
  scene.add(keyLight);

  // Fill light — very faint cool ambient from left
  const fillLight = new THREE.PointLight(0x1a2a40, 0.8, 15);
  fillLight.position.set(-4, 0, 2);
  scene.add(fillLight);

  // Lime neon rim — from bottom-left (like the reference's green tint)
  const rimLight = new THREE.PointLight(0xaaff00, 0.6, 12);
  rimLight.position.set(-3, -2, 1);
  scene.add(rimLight);

  // Back-fill — prevents total darkness on back
  const backLight = new THREE.PointLight(0x080808, 0.3, 10);
  backLight.position.set(0, 0, -4);
  scene.add(backLight);

  // Ambient — very subtle
  const ambient = new THREE.AmbientLight(0x050505, 0.5);
  scene.add(ambient);

  // ── MOUSE TRACKING ───────────────────────────────────────
  let mouseNormX = 0;   // -1 to +1
  let mouseNormY = 0;
  let targetNormX = 0;
  let targetNormY = 0;
  let orbOffsetX = 0;
  let orbOffsetY = 0;
  let targetOffsetX = 0;
  let targetOffsetY = 0;
  let isOnHeroSection = true;

  document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth)  * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetNormX   = nx;
    targetNormY   = ny;
    // Parallax offset for container
    targetOffsetX =  nx * 30;
    targetOffsetY =  ny * 20;
  });

  // ── IDLE ANIMATION PARAMS ────────────────────────────────
  let clock = new THREE.Clock();
  let animT = 0;

  // ── SCROLL PARALLAX ──────────────────────────────────────
  let scrollFactor = 0;
  window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const heroH = hero.offsetHeight;
    scrollFactor = Math.min(window.scrollY / heroH, 1);
    isOnHeroSection = scrollFactor < 1;
  });

  // ── RESIZE ───────────────────────────────────────────────
  setSize();
  window.addEventListener('resize', setSize);

  // ── RENDER LOOP ───────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    animT += delta;

    // Smooth lerp mouse
    mouseNormX += (targetNormX - mouseNormX) * 0.05;
    mouseNormY += (targetNormY - mouseNormY) * 0.05;
    orbOffsetX += (targetOffsetX - orbOffsetX) * 0.04;
    orbOffsetY += (targetOffsetY - orbOffsetY) * 0.04;

    // Move key light to follow mouse (creates moving specular like reference)
    keyLight.position.x =  mouseNormX * 5 + 1;
    keyLight.position.y = -mouseNormY * 4 + 3;
    keyLight.position.z =  3.5;

    // Move rim light opposite direction (subtle)
    rimLight.position.x = -mouseNormX * 3 - 2;
    rimLight.position.y =  mouseNormY * 2 - 1;

    // Very gentle idle rotation on sphere
    sphere.rotation.y = animT * 0.04  + mouseNormX * 0.12;
    sphere.rotation.x = Math.sin(animT * 0.03) * 0.04 - mouseNormY * 0.08;

    // Idle breathing bob
    const idleBob   = Math.sin(animT * 0.6) * 0.018;
    const idleSway  = Math.cos(animT * 0.4) * 0.012;
    sphere.position.y = idleBob;
    sphere.position.x = idleSway;

    // Apply container parallax via CSS transform
    if (container) {
      const scrollShift = scrollFactor * -60;
      container.style.transform = `translateY(calc(-50% + ${orbOffsetY + scrollShift}px)) translateX(${orbOffsetX}px)`;
    }

    renderer.render(scene, camera);
  }

  animate();

})();
