import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCcw, Hand } from 'lucide-react';

export function ThreeDTulipExperience() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [currentPetalsCount, setCurrentPetalsCount] = useState(6);
  const [manualDetachedCount, setManualDetachedCount] = useState(0);
  const lastPetalsCountRef = useRef(6);

  const pluckNextPetalRef = useRef<() => void>(() => {});
  const resetBloomRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 8, 8);
    scene.add(keyLight);

    const softFillLight = new THREE.DirectionalLight(0xfda4af, 2.0);
    softFillLight.position.set(-6, -2, 5);
    scene.add(softFillLight);

    const backRimLight = new THREE.PointLight(0xfde047, 4.0, 35);
    backRimLight.position.set(0, 5, -6);
    scene.add(backRimLight);

    // --- Tulip Geometry Construction ---
    function createTulipPetalGeometry(width: number, height: number, curvature: number) {
      const geom = new THREE.PlaneGeometry(width, height, 16, 24);
      const pos = geom.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const v = (y + height / 2) / height;

        const widthFactor = Math.sin(v * Math.PI * 0.85 + 0.15);
        pos.setX(i, x * widthFactor);

        const hollow = Math.sin(v * Math.PI) * (width * 0.42 * curvature);
        const crossHollow = (1 - Math.pow(x / (width / 2 + 0.001), 2)) * hollow;
        const tipFlare = v > 0.8 ? Math.pow((v - 0.8) / 0.2, 2) * (curvature * 0.2) : 0;

        pos.setZ(i, -crossHollow + tipFlare);
      }
      geom.computeVertexNormals();
      return geom;
    }

    const outerPetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xf43f5e, // Vibrant Rose-Pink
      roughness: 0.26,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const innerPetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xfb7185, // Coral Rose
      roughness: 0.3,
      metalness: 0.06,
      side: THREE.DoubleSide,
    });

    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.45,
      metalness: 0.05,
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.35,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    // --- 3D Tulip Master Group ---
    const tulipGroup = new THREE.Group();
    scene.add(tulipGroup);

    // Stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -5.5, -0.4),
      new THREE.Vector3(0.15, -3, -0.2),
      new THREE.Vector3(0, 0, 0),
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 32, 0.09, 12, false);
    const stemMesh = new THREE.Mesh(stemGeom, stemMaterial);
    tulipGroup.add(stemMesh);

    // Leaves
    const leafGeom = createTulipPetalGeometry(0.9, 4.5, 0.6);
    const leafMesh = new THREE.Mesh(leafGeom, leafMaterial);
    leafMesh.position.set(-0.35, -2.5, 0.1);
    leafMesh.rotation.set(0.2, 0.4, 0.35);
    tulipGroup.add(leafMesh);

    const leaf2Geom = createTulipPetalGeometry(0.7, 3.8, 0.5);
    const leaf2Mesh = new THREE.Mesh(leaf2Geom, leafMaterial);
    leaf2Mesh.position.set(0.3, -3.2, -0.15);
    leaf2Mesh.rotation.set(-0.15, -0.6, -0.4);
    tulipGroup.add(leaf2Mesh);

    // Center Pistil & Stamens
    const stamenGroup = new THREE.Group();
    const pistilGeom = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8);
    const pistilMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.2 });
    const pistilMesh = new THREE.Mesh(pistilGeom, pistilMat);
    pistilMesh.position.set(0, 0.4, 0);
    stamenGroup.add(pistilMesh);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const antherGeom = new THREE.SphereGeometry(0.06, 8, 8);
      antherGeom.scale(1, 2.5, 1);
      const antherMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
      const antherMesh = new THREE.Mesh(antherGeom, antherMat);
      antherMesh.position.set(Math.cos(angle) * 0.2, 0.55, Math.sin(angle) * 0.2);
      stamenGroup.add(antherMesh);
    }
    tulipGroup.add(stamenGroup);

    // 6 Individual Petals
    interface TulipPetalNode {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      baseRot: THREE.Euler;
      detachThreshold: number;
      index: number;
      manuallyDetached: boolean;
      manualProgress: number;
    }

    const petals: TulipPetalNode[] = [];

    // Inner 3 Petals
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const pGeom = createTulipPetalGeometry(1.6, 2.7, 0.85);
      const pMesh = new THREE.Mesh(pGeom, innerPetalMaterial);

      const radius = 0.28;
      pMesh.position.set(Math.cos(angle) * radius, 1.1, Math.sin(angle) * radius);
      pMesh.rotation.y = -angle + Math.PI / 2;
      pMesh.rotation.x = 0.22;

      tulipGroup.add(pMesh);
      petals.push({
        mesh: pMesh,
        basePos: pMesh.position.clone(),
        baseRot: pMesh.rotation.clone(),
        detachThreshold: 0.55 + i * 0.15,
        index: i,
        manuallyDetached: false,
        manualProgress: 0,
      });
    }

    // Outer 3 Petals
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.PI / 3;
      const pGeom = createTulipPetalGeometry(1.9, 2.9, 0.95);
      const pMesh = new THREE.Mesh(pGeom, outerPetalMaterial);

      const radius = 0.42;
      pMesh.position.set(Math.cos(angle) * radius, 1.05, Math.sin(angle) * radius);
      pMesh.rotation.y = -angle + Math.PI / 2;
      pMesh.rotation.x = 0.45;

      tulipGroup.add(pMesh);
      petals.push({
        mesh: pMesh,
        basePos: pMesh.position.clone(),
        baseRot: pMesh.rotation.clone(),
        detachThreshold: 0.15 + i * 0.12,
        index: i + 3,
        manuallyDetached: false,
        manualProgress: 0,
      });
    }

    // Floating Petals
    const floatingCount = 20;
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    const floatingPetals: {
      mesh: THREE.Mesh;
      speedY: number;
      rotSpeed: THREE.Vector3;
      wobble: number;
    }[] = [];

    const driftPetalGeom = createTulipPetalGeometry(0.8, 1.2, 0.7);
    for (let i = 0; i < floatingCount; i++) {
      const fpMesh = new THREE.Mesh(driftPetalGeom, outerPetalMaterial);
      fpMesh.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 6);
      fpMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      fpMesh.scale.setScalar(0.5 + Math.random() * 0.5);
      floatingGroup.add(fpMesh);

      floatingPetals.push({
        mesh: fpMesh,
        speedY: 0.007 + Math.random() * 0.012,
        rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02),
        wobble: Math.random() * Math.PI * 2,
      });
    }

    // Sparkles
    const sparkleCount = 60;
    const sparkleGeom = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount * 3; i += 3) {
      sparklePositions[i] = (Math.random() - 0.5) * 20;
      sparklePositions[i + 1] = (Math.random() - 0.5) * 16;
      sparklePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const sparkles = new THREE.Points(sparkleGeom, sparkleMat);
    scene.add(sparkles);

    // --- Interactive Coordinates & Drag Control ---
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragRotation = { x: 0, y: 0 };

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        targetScrollProgress = Math.min(Math.max(window.scrollY / docHeight, 0), 1);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        dragRotation.y += deltaX * 0.008;
        dragRotation.x += deltaY * 0.008;
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    handleScroll();

    // Responsive Positioning:
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      if (width < 768) {
        tulipGroup.position.set(0, -0.6, 0);
        tulipGroup.scale.setScalar(1.9);
      } else if (width < 1200) {
        tulipGroup.position.set(0, -0.4, 0.5);
        tulipGroup.scale.setScalar(2.5);
      } else {
        tulipGroup.position.set(0, -0.2, 0.8);
        tulipGroup.scale.setScalar(3.0);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);

    // Callbacks for manual actions
    pluckNextPetalRef.current = () => {
      const attachedPetal = petals.find((p) => !p.manuallyDetached);
      if (attachedPetal) {
        attachedPetal.manuallyDetached = true;
        setManualDetachedCount((c) => c + 1);
      }
    };

    resetBloomRef.current = () => {
      petals.forEach((p) => {
        p.manuallyDetached = false;
        p.manualProgress = 0;
      });
      setManualDetachedCount(0);
      dragRotation = { x: 0, y: 0 };
    };

    // --- Animation Loop ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // ─── 3D Tulip Body Sway & Rotation ───
      tulipGroup.rotation.y = elapsed * 0.25 + scrollProgress * Math.PI * 2.2 + mouseX * 0.4 + dragRotation.y;
      tulipGroup.rotation.x = 0.2 + Math.sin(elapsed * 0.6) * 0.05 + mouseY * 0.25 - scrollProgress * 0.2 + dragRotation.x;
      tulipGroup.rotation.z = Math.sin(elapsed * 0.5) * 0.06 + mouseX * 0.15;

      // ─── Scroll & Manual Driven Petal Detachment ───
      let remainingCount = 6;
      petals.forEach((p) => {
        const isScrollDetached = scrollProgress >= p.detachThreshold;
        const isDetached = isScrollDetached || p.manuallyDetached;

        if (isDetached) {
          remainingCount--;
          if (p.manuallyDetached) {
            p.manualProgress = Math.min(p.manualProgress + delta * 0.9, 1);
          }
          const detachProgress = p.manuallyDetached
            ? p.manualProgress
            : (scrollProgress - p.detachThreshold) / (1 - p.detachThreshold + 0.001);

          const flyAngle = (p.index / 6) * Math.PI * 2;
          const outwardX = Math.cos(flyAngle) * detachProgress * 5.5;
          const outwardZ = Math.sin(flyAngle) * detachProgress * 5.5;
          const dropY = -detachProgress * 9.5;

          p.mesh.position.x = p.basePos.x + outwardX;
          p.mesh.position.y = p.basePos.y + dropY;
          p.mesh.position.z = p.basePos.z + outwardZ;

          p.mesh.rotation.x = p.baseRot.x + detachProgress * 4.0 + Math.sin(elapsed * 2 + p.index) * 0.4;
          p.mesh.rotation.y = p.baseRot.y + detachProgress * 3.2;
          p.mesh.rotation.z = p.baseRot.z + detachProgress * 2.6;
        } else {
          const bloomOpen = Math.min(scrollProgress * 1.8, 0.6);
          p.mesh.position.copy(p.basePos);
          p.mesh.rotation.x = p.baseRot.x + bloomOpen * 0.35;
          p.mesh.rotation.y = p.baseRot.y;
          p.mesh.rotation.z = p.baseRot.z;
        }
      });

      if (lastPetalsCountRef.current !== remainingCount) {
        lastPetalsCountRef.current = remainingCount;
        setCurrentPetalsCount(remainingCount);
      }

      // ─── Drifting Petals ───
      floatingPetals.forEach((fp) => {
        fp.mesh.position.y -= fp.speedY * (1 + scrollProgress * 2);
        fp.mesh.position.x += Math.sin(elapsed + fp.wobble) * 0.012 + mouseX * 0.008;
        fp.mesh.position.z += Math.cos(elapsed * 0.8 + fp.wobble) * 0.008;

        fp.mesh.rotation.x += fp.rotSpeed.x;
        fp.mesh.rotation.y += fp.rotSpeed.y;
        fp.mesh.rotation.z += fp.rotSpeed.z;

        if (fp.mesh.position.y < -8) {
          fp.mesh.position.y = 8;
          fp.mesh.position.x = (Math.random() - 0.5) * 18;
        }
      });

      sparkles.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', updateLayout);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      outerPetalMaterial.dispose();
      innerPetalMaterial.dispose();
      stemMaterial.dispose();
      leafMaterial.dispose();
      sparkleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {/* Realtime 3D Canvas Background Layer */}
      <div
        ref={canvasContainerRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      />

      {/* Floating 3D Tulip Control Dock */}
      <div className="fixed top-20 right-3 sm:right-6 z-40 pointer-events-auto flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-xl px-3.5 py-1.5 shadow-card border border-white/70 text-xs text-wine-700 font-medium">
          <span className="text-base animate-heart-beat">🌷</span>
          <span className="hidden sm:inline">Aanya's 3D Tulip:</span>
          <span className="text-rose-600 font-bold tabular-nums">{currentPetalsCount}/6 Petals</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-white/75 backdrop-blur-xl p-1 shadow-soft border border-white/60 text-xs">
          <button
            onClick={() => pluckNextPetalRef.current()}
            disabled={currentPetalsCount === 0}
            className="flex items-center gap-1 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white px-2.5 py-1 transition-all cursor-pointer font-medium"
            title="Pluck a petal"
          >
            <Sparkles className="h-3 w-3" />
            <span>Pluck Petal</span>
          </button>
          <button
            onClick={() => resetBloomRef.current()}
            className="p-1 rounded-full hover:bg-rose-100 text-wine-600 transition-all cursor-pointer"
            title="Bloom all petals again"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}

