import { useEffect, useRef, useState } from 'react';
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

export function ThreeDPhotoExperience() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

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
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffecd2, 2.0);
    directionalLight1.position.set(5, 8, 7);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xfda4af, 1.8);
    directionalLight2.position.set(-5, -4, 5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xfde047, 3.0, 25);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // --- Texture Loader ---
    const textureLoader = new THREE.TextureLoader();
    const photoGroup = new THREE.Group();
    scene.add(photoGroup);

    // --- Create 3D Floating Photo Cards ---
    const photoCards: {
      group: THREE.Group;
      baseAngle: number;
      radius: number;
      baseY: number;
      rotSpeed: number;
      title: string;
    }[] = [];

    const totalCards = PHOTO_URLS.length;
    const cardWidth = 2.4;
    const cardHeight = 3.2; // 3:4 portrait aspect ratio (no cutoff)

    // Frame materials
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const borderGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Warm gold rim
      roughness: 0.25,
      metalness: 0.8,
    });

    PHOTO_URLS.forEach((p, idx) => {
      const cardGroup = new THREE.Group();

      // Card geometry with white Polaroid-like backing
      const backGeom = new THREE.PlaneGeometry(cardWidth + 0.18, cardHeight + 0.24);
      const backMesh = new THREE.Mesh(backGeom, frameMaterial);
      backMesh.position.z = -0.01;
      cardGroup.add(backMesh);

      // Gold frame rim
      const rimGeom = new THREE.PlaneGeometry(cardWidth + 0.24, cardHeight + 0.3);
      const rimMesh = new THREE.Mesh(rimGeom, borderGoldMaterial);
      rimMesh.position.z = -0.02;
      cardGroup.add(rimMesh);

      // Front Photo Plane
      textureLoader.load(p.src, (texture) => {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;

        const photoMat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.2,
          metalness: 0.05,
          side: THREE.DoubleSide,
        });

        const photoGeom = new THREE.PlaneGeometry(cardWidth, cardHeight);
        const photoMesh = new THREE.Mesh(photoGeom, photoMat);
        photoMesh.position.z = 0.01;
        cardGroup.add(photoMesh);
      });

      // Arrange in a 3D Spiral Orbit
      const angle = (idx / totalCards) * Math.PI * 2;
      const radius = 4.8;
      const yOffset = (idx - totalCards / 2) * 0.45;

      cardGroup.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
      cardGroup.rotation.y = -angle - Math.PI / 2;

      photoGroup.add(cardGroup);
      photoCards.push({
        group: cardGroup,
        baseAngle: angle,
        radius: radius,
        baseY: yOffset,
        rotSpeed: 0.002,
        title: p.title,
      });
    });

    // --- Floating Golden Sparkles ---
    const sparkleCount = 90;
    const sparkleGeom = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount * 3; i += 3) {
      sparklePositions[i] = (Math.random() - 0.5) * 24;
      sparklePositions[i + 1] = (Math.random() - 0.5) * 18;
      sparklePositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.15,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const sparkles = new THREE.Points(sparkleGeom, sparkleMat);
    scene.add(sparkles);

    // --- Floating Silk Petals in Background ---
    const petalGeom = new THREE.PlaneGeometry(0.5, 0.7, 8, 8);
    const pos = petalGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = (pos.getY(i) + 0.35) / 0.7;
      pos.setZ(i, Math.sin(v * Math.PI) * 0.18);
    }
    petalGeom.computeVertexNormals();

    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.3,
      metalness: 0.05,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });

    const floatingPetalsGroup = new THREE.Group();
    scene.add(floatingPetalsGroup);

    const driftingPetals: {
      mesh: THREE.Mesh;
      speedY: number;
      rotSpeed: THREE.Vector3;
      wobble: number;
    }[] = [];

    for (let i = 0; i < 24; i++) {
      const pMesh = new THREE.Mesh(petalGeom, petalMat);
      pMesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 8);
      pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      pMesh.scale.setScalar(0.6 + Math.random() * 0.6);
      floatingPetalsGroup.add(pMesh);

      driftingPetals.push({
        mesh: pMesh,
        speedY: 0.008 + Math.random() * 0.012,
        rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02),
        wobble: Math.random() * Math.PI * 2,
      });
    }

    // --- Interactive Coordinates & Scroll Progress ---
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

    // Responsive scaling
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      if (width < 768) {
        photoGroup.scale.setScalar(0.78);
        photoGroup.position.set(0, 0.2, 0);
      } else if (width < 1200) {
        photoGroup.scale.setScalar(0.95);
        photoGroup.position.set(0, 0, 0);
      } else {
        photoGroup.scale.setScalar(1.15);
        photoGroup.position.set(0, 0, 0);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);

    // --- Animation Loop ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Master 3D Orbit Rotation
      const totalRotation = elapsed * 0.18 + scrollProgress * Math.PI * 3.0 + mouseX * 0.4 + dragRotation.y;
      photoGroup.rotation.y = totalRotation;
      photoGroup.rotation.x = 0.12 + Math.sin(elapsed * 0.5) * 0.04 + mouseY * 0.2 + dragRotation.x;
      photoGroup.position.y = -scrollProgress * 4.0;

      // Floating Petals Animation
      driftingPetals.forEach((dp) => {
        dp.mesh.position.y -= dp.speedY * (1 + scrollProgress * 1.5);
        dp.mesh.position.x += Math.sin(elapsed + dp.wobble) * 0.01;
        dp.mesh.position.z += Math.cos(elapsed * 0.7 + dp.wobble) * 0.008;

        dp.mesh.rotation.x += dp.rotSpeed.x;
        dp.mesh.rotation.y += dp.rotSpeed.y;
        dp.mesh.rotation.z += dp.rotSpeed.z;

        if (dp.mesh.position.y < -10) {
          dp.mesh.position.y = 10;
          dp.mesh.position.x = (Math.random() - 0.5) * 20;
        }
      });

      // Individual Card Bobbing
      photoCards.forEach((c, idx) => {
        c.group.position.y = c.baseY + Math.sin(elapsed * 1.5 + idx) * 0.15;
      });

      sparkles.rotation.y = elapsed * 0.04;

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

      frameMaterial.dispose();
      borderGoldMaterial.dispose();
      petalMat.dispose();
      sparkleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {/* 3D WebGL Background Canvas */}
      <div
        ref={canvasContainerRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      />

      {/* Floating 3D Photo Status Pill */}
      <div className="fixed top-20 right-3 sm:right-6 z-40 pointer-events-auto flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-xl px-4 py-1.5 shadow-card border border-white/70 text-xs text-wine-700 font-medium">
        <span className="text-base animate-heart-beat">✨</span>
        <span className="font-semibold">3D Memory Galaxy:</span>
        <span className="text-rose-600 font-bold">Aanya's Gallery</span>
      </div>
    </>
  );
}
