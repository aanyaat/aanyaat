import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PHOTO_URLS = [
  { src: '/images/gifts/flowers_mode.jpeg', title: 'Floral Glow 🌸' },
  { src: '/images/gifts/1000087383.jpg', title: 'Warm Smile ✨' },
  { src: '/images/gifts/yellow_mode.jpeg', title: 'Golden Sunshine 💛' },
  { src: '/images/gifts/1000087377.jpg', title: 'Sweet Candid 💖' },
  { src: '/images/gifts/boss_mode.jpeg', title: 'Boss Energy 👑' },
  { src: '/images/gifts/1000087399.jpg', title: 'Sweet Moments 🌷' },
  { src: '/images/gifts/story_begins.jpg', title: 'Story Begins 💫' },
  { src: '/images/gifts/1000091235.jpg', title: 'Endless Love 💕' },
];

function getDeviceProfile() {
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const lowPower = mobile || hardwareConcurrency <= 4 || deviceMemory <= 4;

  return {
    mobile,
    reducedMotion,
    lowPower,
    cardCount: lowPower ? 5 : 8,
    sparkleCount: lowPower ? 32 : 72,
    petalCount: lowPower ? 8 : 16,
    trailCount: lowPower ? 16 : 32,
    pixelRatio: Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5),
    frameInterval: reducedMotion ? 1000 / 12 : lowPower ? 1000 / 30 : 1000 / 60,
  };
}

export function ThreeDPhotoExperience() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const profile = getDeviceProfile();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 11);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !profile.lowPower,
        powerPreference: profile.lowPower ? 'low-power' : 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(profile.pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping = profile.lowPower ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const photoGroup = new THREE.Group();
    scene.add(photoGroup);

    const photoCards: { group: THREE.Group; baseY: number }[] = [];
    const loadedTextures: THREE.Texture[] = [];
    const loadedMaterials: THREE.Material[] = [];
    let disposed = false;
    let idleHandles: number[] = [];
    let timeoutHandles: number[] = [];
    const textureLoader = new THREE.TextureLoader();
    const photoGeometry = new THREE.PlaneGeometry(2.4, 3.2);
    const backGeometry = new THREE.PlaneGeometry(2.58, 3.44);
    const rimGeometry = new THREE.PlaneGeometry(2.64, 3.5);
    const frameMaterial = new THREE.MeshBasicMaterial({ color: 0xfffefb, side: THREE.DoubleSide });
    const borderMaterial = new THREE.MeshBasicMaterial({
      color: 0xf2cc4e,
      transparent: true,
      opacity: profile.lowPower ? 0.16 : 0.24,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    loadedMaterials.push(frameMaterial, borderMaterial);

    const addPhotoTexture = (photo: (typeof PHOTO_URLS)[number], cardGroup: THREE.Group) => {
      textureLoader.load(
        photo.src,
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = profile.lowPower ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = !profile.lowPower;
          texture.anisotropy = profile.lowPower ? 1 : Math.min(renderer.capabilities.getMaxAnisotropy(), 2);
          loadedTextures.push(texture);

          const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
          loadedMaterials.push(material);
          const photoMesh = new THREE.Mesh(photoGeometry, material);
          photoMesh.position.z = 0.01;
          cardGroup.add(photoMesh);
        },
        undefined,
        () => undefined,
      );
    };

    const photos = PHOTO_URLS.slice(0, profile.cardCount);
    photos.forEach((photo, idx) => {
      const cardGroup = new THREE.Group();
      const angle = (idx / photos.length) * Math.PI * 2;
      const baseY = (idx - photos.length / 2) * 0.45;
      const radius = profile.lowPower ? 4.1 : 4.8;

      const backMesh = new THREE.Mesh(backGeometry, frameMaterial);
      backMesh.position.z = -0.01;
      const rimMesh = new THREE.Mesh(rimGeometry, borderMaterial);
      rimMesh.position.z = -0.02;
      cardGroup.add(backMesh, rimMesh);
      cardGroup.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
      cardGroup.rotation.y = -angle - Math.PI / 2;
      photoGroup.add(cardGroup);
      photoCards.push({ group: cardGroup, baseY });

      // Defer image decoding until the first frame is visible, keeping initial mobile paint light.
      schedulePhotoLoad(() => addPhotoTexture(photo, cardGroup), 1100 + idx * 90);
    });

    const sparklePositions = new Float32Array(profile.sparkleCount * 3);
    for (let i = 0; i < profile.sparkleCount * 3; i += 3) {
      sparklePositions[i] = (Math.random() - 0.5) * 24;
      sparklePositions[i + 1] = (Math.random() - 0.5) * 18;
      sparklePositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    const sparkleGeometry = new THREE.BufferGeometry();
    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMaterial = new THREE.PointsMaterial({
      color: 0xfde047,
      size: profile.lowPower ? 0.1 : 0.14,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    loadedMaterials.push(sparkleMaterial);
    const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    scene.add(sparkles);

    const petalGeometry = new THREE.PlaneGeometry(0.5, 0.7, 4, 4);
    const petalPosition = petalGeometry.attributes.position;
    for (let i = 0; i < petalPosition.count; i += 1) {
      const v = (petalPosition.getY(i) + 0.35) / 0.7;
      petalPosition.setZ(i, Math.sin(v * Math.PI) * 0.18);
    }
    petalGeometry.computeVertexNormals();
    const petalMaterial = new THREE.MeshBasicMaterial({
      color: 0xfb7185,
      transparent: true,
      opacity: profile.lowPower ? 0.35 : 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    loadedMaterials.push(petalMaterial);
    const floatingPetalsGroup = new THREE.Group();
    scene.add(floatingPetalsGroup);
    const driftingPetals: { mesh: THREE.Mesh; speedY: number; rotSpeed: THREE.Vector3; wobble: number }[] = [];

    for (let i = 0; i < profile.petalCount; i += 1) {
      const petal = new THREE.Mesh(petalGeometry, petalMaterial);
      petal.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 8);
      petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      petal.scale.setScalar(0.6 + Math.random() * 0.6);
      floatingPetalsGroup.add(petal);
      driftingPetals.push({
        mesh: petal,
        speedY: 0.008 + Math.random() * 0.012,
        rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02),
        wobble: Math.random() * Math.PI * 2,
      });
    }

    // A small additive particle trail follows the pointer without adding another canvas or audio permission prompt.
    const trailPositions = new Float32Array(profile.trailCount * 3);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMaterial = new THREE.PointsMaterial({
      color: 0xfde047,
      size: profile.lowPower ? 0.11 : 0.16,
      transparent: true,
      opacity: profile.lowPower ? 0.35 : 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    loadedMaterials.push(trailMaterial);
    const trail = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trail);

    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragRotation = { x: 0, y: 0 };
    let visible = true;
    let animId = 0;
    let lastFrameTime = 0;
    const clock = new THREE.Clock();

    function schedulePhotoLoad(callback: () => void, delay: number) {
      const handle = window.setTimeout(callback, delay);
      timeoutHandles.push(handle);
    }

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollProgress = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
    };

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
      if (isDragging) {
        dragRotation.y += (event.clientX - previousMousePosition.x) * 0.006;
        dragRotation.x += (event.clientY - previousMousePosition.y) * 0.006;
      }
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (profile.mobile) return;
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };
    const handleMouseUp = () => { isDragging = false; };
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      targetMouseX = (touch.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (touch.clientY / window.innerHeight - 0.5) * 2;
    };

    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, profile.lowPower ? 1 : 1.5));
      photoGroup.scale.setScalar(width < 768 ? 0.72 : width < 1200 ? 0.9 : 1.08);
      photoGroup.position.set(0, width < 768 ? 0.2 : 0, 0);
    };

    const handleVisibility = () => {
      visible = document.visibilityState === 'visible';
    };

    const animate = (time: number) => {
      if (disposed) return;
      animId = requestAnimationFrame(animate);
      if (!visible || document.visibilityState === 'hidden') return;
      if (time - lastFrameTime < profile.frameInterval) return;
      lastFrameTime = time;

      const elapsed = clock.getElapsedTime();
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      if (!profile.reducedMotion) {
        const totalRotation = elapsed * 0.13 + scrollProgress * Math.PI * 3.15 + mouseX * 0.35 + dragRotation.y;
        photoGroup.rotation.y = totalRotation;
        photoGroup.rotation.x = 0.1 + mouseY * 0.16 + dragRotation.x;
        photoGroup.position.y = -scrollProgress * 3.5;
        camera.position.z = 11 - scrollProgress * 0.75;
        sparkles.rotation.y = elapsed * 0.03;

        driftingPetals.forEach((petal) => {
          petal.mesh.position.y -= petal.speedY * (1 + scrollProgress * 1.2);
          petal.mesh.position.x += Math.sin(elapsed + petal.wobble) * 0.008;
          petal.mesh.rotation.x += petal.rotSpeed.x;
          petal.mesh.rotation.y += petal.rotSpeed.y;
          petal.mesh.rotation.z += petal.rotSpeed.z;
          if (petal.mesh.position.y < -10) {
            petal.mesh.position.y = 10;
            petal.mesh.position.x = (Math.random() - 0.5) * 20;
          }
        });

        photoCards.forEach((card, idx) => {
          card.group.position.y = card.baseY + Math.sin(elapsed * 1.1 + idx) * 0.1;
        });
      }

      const positions = trailGeometry.attributes.position.array as Float32Array;
      positions[0] += ((targetMouseX * 5.2) - positions[0]) * 0.12;
      positions[1] += ((-targetMouseY * 3.4) - positions[1]) * 0.12;
      positions[2] += (1.2 - positions[2]) * 0.12;
      for (let i = 1; i < profile.trailCount; i += 1) {
        const index = i * 3;
        const previous = (i - 1) * 3;
        positions[index] += (positions[previous] - positions[index]) * 0.22;
        positions[index + 1] += (positions[previous + 1] - positions[index + 1]) * 0.22;
        positions[index + 2] += ((positions[previous + 2] - i * 0.035) - positions[index + 2]) * 0.2;
      }
      trailGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', updateLayout, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    handleScroll();
    updateLayout();
    animate(performance.now());

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      timeoutHandles.forEach((handle) => window.clearTimeout(handle));
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', updateLayout);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
        }
      });
      loadedTextures.forEach((texture) => texture.dispose());
      loadedMaterials.forEach((material) => material.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={canvasContainerRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true" />
      <div className="fixed right-3 top-20 z-40 pointer-events-none flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-1.5 text-xs font-medium text-wine-700 shadow-card backdrop-blur-xl sm:right-6">
        <span className="text-base animate-heart-beat">✨</span>
        <span className="font-semibold">3D Memory Galaxy:</span>
        <span className="font-bold text-rose-600">scroll to orbit</span>
      </div>
    </>
  );
}
