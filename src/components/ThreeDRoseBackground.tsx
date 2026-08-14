import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeDRoseBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfff0f5, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffe4e6, 2.2);
    mainLight.position.set(5, 8, 10);
    scene.add(mainLight);

    const goldRimLight = new THREE.PointLight(0xf59e0b, 3, 25);
    goldRimLight.position.set(-6, -4, 4);
    scene.add(goldRimLight);

    const roseGlow = new THREE.PointLight(0xf43f5e, 2.5, 20);
    roseGlow.position.set(0, 2, 5);
    scene.add(roseGlow);

    // --- Rose Petal Geometry & Material Generator ---
    function createPetalGeometry(width: number, length: number, curl: number) {
      const geom = new THREE.PlaneGeometry(width, length, 12, 12);
      const pos = geom.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);

        // Curve petal into natural rose cup shape
        const normY = (y + length / 2) / length; // 0 to 1
        const curveZ = -Math.sin(normY * Math.PI) * (width * 0.45 * curl);
        const edgeCurl = (1 - Math.abs(x / (width / 2))) * curveZ;

        // Flare the petal tip outwards
        const tipFlare = Math.pow(normY, 2) * (curl * 0.35);

        pos.setZ(i, edgeCurl + tipFlare);
        // Taper bottom of petal
        pos.setX(i, x * (0.3 + 0.7 * Math.sin(normY * Math.PI * 0.85)));
      }
      geom.computeVertexNormals();
      return geom;
    }

    const petalMaterial = new THREE.MeshStandardMaterial({
      color: 0xbe123c, // Deep luxury crimson rose
      roughness: 0.38,
      metalness: 0.12,
      side: THREE.DoubleSide,
      shadowSide: THREE.DoubleSide,
    });

    const outerPetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xe11d48, // Vibrant rose petal
      roughness: 0.32,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    const innerPetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x9f1239, // Velvet wine interior
      roughness: 0.45,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    // --- 3D Rose Flower Group ---
    const roseGroup = new THREE.Group();
    roseGroup.position.set(2.8, 0.5, 0); // Position on the right flank on desktop
    scene.add(roseGroup);

    interface DetachablePetal {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      baseRot: THREE.Euler;
      detachThreshold: number; // scroll progress threshold (0..1)
      fallSpeed: number;
      rotSpeed: THREE.Vector3;
      detached: boolean;
      currentPos: THREE.Vector3;
      currentRot: THREE.Euler;
    }

    const detachablePetals: DetachablePetal[] = [];

    // Build Concentric Layers of Petals (Total ~32 petals in 5 layers)
    const layers = [
      { count: 4, radius: 0.35, width: 0.8, length: 1.2, curl: 1.2, tilt: 0.15, mat: innerPetalMaterial, detachStart: 0.85 },
      { count: 6, radius: 0.65, width: 1.1, length: 1.5, curl: 1.1, tilt: 0.35, mat: innerPetalMaterial, detachStart: 0.65 },
      { count: 7, radius: 1.05, width: 1.4, length: 1.9, curl: 0.95, tilt: 0.55, mat: petalMaterial, detachStart: 0.42 },
      { count: 8, radius: 1.55, width: 1.8, length: 2.3, curl: 0.85, tilt: 0.78, mat: petalMaterial, detachStart: 0.22 },
      { count: 9, radius: 2.1, width: 2.2, length: 2.7, curl: 0.75, tilt: 1.05, mat: outerPetalMaterial, detachStart: 0.08 },
    ];

    layers.forEach((layer, layerIdx) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2 + (layerIdx * 0.42);
        const geom = createPetalGeometry(layer.width, layer.length, layer.curl);
        const mesh = new THREE.Mesh(geom, layer.mat);

        // Position & Angle petal
        const x = Math.cos(angle) * layer.radius;
        const z = Math.sin(angle) * layer.radius;
        const y = -layerIdx * 0.08;

        mesh.position.set(x, y, z);
        mesh.rotation.y = -angle + Math.PI / 2;
        mesh.rotation.x = layer.tilt + (Math.random() * 0.08 - 0.04);
        mesh.rotation.z = (Math.random() * 0.1 - 0.05);

        roseGroup.add(mesh);

        const detachT = layer.detachStart + (i / layer.count) * 0.12 + Math.random() * 0.05;

        detachablePetals.push({
          mesh,
          basePos: mesh.position.clone(),
          baseRot: mesh.rotation.clone(),
          detachThreshold: Math.min(detachT, 0.95),
          fallSpeed: 0.04 + Math.random() * 0.03,
          rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04
          ),
          detached: false,
          currentPos: mesh.position.clone(),
          currentRot: mesh.rotation.clone(),
        });
      }
    });

    // Glowing golden center core
    const coreGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreMesh.position.set(0, 0.1, 0);
    roseGroup.add(coreMesh);

    // --- Floating Rose Petal Particle Cloud (Ambience across the screen) ---
    const ambientPetalCount = 35;
    const ambientPetalGroup = new THREE.Group();
    scene.add(ambientPetalGroup);

    const ambientPetals: {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      speedY: number;
      speedX: number;
      rotSpeed: THREE.Vector3;
      wobbleOffset: number;
    }[] = [];

    const smallPetalGeom = createPetalGeometry(0.7, 0.9, 0.6);
    for (let i = 0; i < ambientPetalCount; i++) {
      const pMesh = new THREE.Mesh(smallPetalGeom, outerPetalMaterial);
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 8;

      pMesh.position.set(x, y, z);
      pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      pMesh.scale.setScalar(0.6 + Math.random() * 0.6);
      ambientPetalGroup.add(pMesh);

      ambientPetals.push({
        mesh: pMesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        speedY: 0.008 + Math.random() * 0.012,
        speedX: (Math.random() - 0.5) * 0.006,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    // --- Golden Sparkle Points Cloud ---
    const sparkleCount = 90;
    const sparkleGeom = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount * 3; i += 3) {
      sparklePositions[i] = (Math.random() - 0.5) * 22;
      sparklePositions[i + 1] = (Math.random() - 0.5) * 18;
      sparklePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));

    const sparkleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const sparkles = new THREE.Points(sparkleGeom, sparkleMat);
    scene.add(sparkles);

    // --- Scroll & Mouse Tracking ---
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        targetScrollProgress = Math.min(Math.max(window.scrollY / docHeight, 0), 1);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle initial scroll
    handleScroll();

    // Responsive positioning (Center more on mobile, flank right on desktop)
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      if (width < 768) {
        roseGroup.position.set(0, 1.2, -1.5);
        roseGroup.scale.setScalar(0.75);
      } else {
        roseGroup.position.set(3.2, 0.2, 0);
        roseGroup.scale.setScalar(1.05);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);

    // --- Animation Loop ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth lerp for scroll and mouse
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // ─── 3D Rose Rotation & Motion based on Scroll ───
      roseGroup.rotation.y = elapsed * 0.25 + scrollProgress * Math.PI * 2.2 + mouseX * 0.4;
      roseGroup.rotation.x = 0.35 + Math.sin(elapsed * 0.5) * 0.08 + mouseY * 0.3 - scrollProgress * 0.4;
      roseGroup.rotation.z = Math.cos(elapsed * 0.4) * 0.06;

      // Pulse the golden core glow
      coreMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 2.5) * 0.4 + scrollProgress * 0.8;

      // ─── Scroll-Driven Petal Detachment Physics ───
      detachablePetals.forEach((p) => {
        if (scrollProgress >= p.detachThreshold) {
          // Petal is detached and falling/swirling!
          const detachProgress = (scrollProgress - p.detachThreshold) / (1 - p.detachThreshold + 0.001);

          // Fly outward and drift downwards with wind turbulence
          const outwardX = Math.sin(p.detachThreshold * 10) * detachProgress * 3.5;
          const outwardZ = Math.cos(p.detachThreshold * 10) * detachProgress * 3.5;
          const dropY = -detachProgress * 8.5;

          p.mesh.position.x = p.basePos.x + outwardX;
          p.mesh.position.y = p.basePos.y + dropY;
          p.mesh.position.z = p.basePos.z + outwardZ;

          p.mesh.rotation.x = p.baseRot.x + detachProgress * 4 + Math.sin(elapsed + p.detachThreshold) * 0.5;
          p.mesh.rotation.y = p.baseRot.y + detachProgress * 3;
          p.mesh.rotation.z = p.baseRot.z + detachProgress * 2.5;

          // Gentle scale reduction as it floats into distance
          const scale = Math.max(1 - detachProgress * 0.35, 0.4);
          p.mesh.scale.setScalar(scale);
        } else {
          // Petal is still attached to the rose
          p.mesh.position.copy(p.basePos);
          p.mesh.rotation.copy(p.baseRot);
          p.mesh.scale.setScalar(1);
        }
      });

      // ─── Ambient Petals Floating Across Screen ───
      ambientPetals.forEach((ap, idx) => {
        ap.mesh.position.y -= ap.speedY * (1 + scrollProgress * 2.5);
        ap.mesh.position.x += Math.sin(elapsed * 0.8 + ap.wobbleOffset) * 0.015 + mouseX * 0.01;
        ap.mesh.position.z += Math.cos(elapsed * 0.6 + ap.wobbleOffset) * 0.01;

        ap.mesh.rotation.x += ap.rotSpeed.x;
        ap.mesh.rotation.y += ap.rotSpeed.y;
        ap.mesh.rotation.z += ap.rotSpeed.z;

        // Wrap around when petal falls below screen
        if (ap.mesh.position.y < -9) {
          ap.mesh.position.y = 9;
          ap.mesh.position.x = (Math.random() - 0.5) * 20;
        }
      });

      // ─── Sparkle Points Twinkle ───
      sparkles.rotation.y = elapsed * 0.04;
      sparkles.rotation.x = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', updateLayout);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      layers.forEach((l) => l.mat.dispose());
      outerPetalMaterial.dispose();
      innerPetalMaterial.dispose();
      coreMat.dispose();
      sparkleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
