import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const gyroRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const [gyroReady, setGyroReady] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x7c83ff, 2.2, 200);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffa72a, 1.6, 200);
    pointLight2.position.set(-10, -10, 5);
    scene.add(pointLight2);
    
    const rimLight = new THREE.PointLight(0x00e7ff, 1.4, 200);
    rimLight.position.set(0, 12, -6);
    scene.add(rimLight);

    // Materials
    const wireMaterial = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    const glowMaterial = new THREE.MeshPhongMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.2,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.1
    });

    // Note: fabric material removed along with fabric grid per request

    // Utility: lightweight parametric geometry generator
    const generateParametricGeometry = (
      getPoint: (u: number, v: number) => THREE.Vector3,
      uSegments: number,
      vSegments: number
    ) => {
      const vertices: number[] = [];
      const indices: number[] = [];

      for (let i = 0; i <= vSegments; i++) {
        const v = i / vSegments;
        for (let j = 0; j <= uSegments; j++) {
          const u = j / uSegments;
          const p = getPoint(u, v);
          vertices.push(p.x, p.y, p.z);
        }
      }

      const rowSize = uSegments + 1;
      for (let i = 0; i < vSegments; i++) {
        for (let j = 0; j < uSegments; j++) {
          const a = i * rowSize + j;
          const b = a + 1;
          const c = a + rowSize;
          const d = c + 1;
          indices.push(a, c, b, b, c, d);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setIndex(indices);
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();
      return geometry;
    };

    // Create Calabi-Yau-like parametric surfaces group (not used)
    const createCalabiYau = () => {
      const group = new THREE.Group();
      const configs = [
        { n1: 2, n2: 1, n3: 2, n4: 1, scale: 1.5, color: 0xe0aaff, pos: new THREE.Vector3(-8, 5, -12) },
        { n1: 3, n2: 4, n3: 2, n4: 5, scale: 1.2, color: 0xf7b267, pos: new THREE.Vector3(-3.5, -1, -10) },
        { n1: 2, n2: 3, n3: 7, n4: 1, scale: 1.3, color: 0x89f7fe, pos: new THREE.Vector3(-12, -3, -14) }
      ];

      const uSeg = 64;
      const vSeg = 64;
      configs.forEach(cfg => {
        const paramFunc = (u: number, v: number) => {
          const phi = 2 * Math.PI * u;
          const theta = 2 * Math.PI * v;
          const r = Math.sin(cfg.n2 * theta) + Math.cos(cfg.n3 * theta);
          const x = cfg.scale * Math.cos(cfg.n1 * phi) * r;
          const y = cfg.scale * Math.sin(cfg.n1 * phi) * r;
          const z = cfg.scale * (Math.sin(cfg.n2 * theta) + Math.cos(cfg.n4 * phi));
          return new THREE.Vector3(x, y, z);
        };
        const geometry = generateParametricGeometry(paramFunc, uSeg, vSeg);
        const material = new THREE.MeshStandardMaterial({
          color: cfg.color,
          metalness: 0.4,
          roughness: 0.25,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          emissive: new THREE.Color(cfg.color).multiplyScalar(0.25),
          emissiveIntensity: 0.9
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(cfg.pos);
        group.add(mesh);
      });
      return group;
    };

    // Create 4D cube projection (tesseract) (not used)
    const createTesseract = () => {
      const group = new THREE.Group();
      
      // Inner cube
      const innerGeometry = new THREE.BoxGeometry(2, 2, 2);
      const innerCube = new THREE.Mesh(innerGeometry, wireMaterial);
      group.add(innerCube);
      
      // Outer cube
      const outerGeometry = new THREE.BoxGeometry(3, 3, 3);
      const outerCube = new THREE.Mesh(outerGeometry, glowMaterial);
      group.add(outerCube);
      
      // Connecting lines between vertices
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.6 });
      const lineGeometry = new THREE.BufferGeometry();
      const points = [];
      
      // Create connections between inner and outer cube vertices
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        points.push(
          Math.cos(angle) * 1.5,
          Math.sin(angle) * 1.5,
          0,
          Math.cos(angle) * 2.5,
          Math.sin(angle) * 2.5,
          0
        );
      }
      
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      group.add(lines);
      
      // position set during placement
      return group;
    };

    // Create Möbius strip with engraved triangular pattern (not used)
    const createMobiusStrip = () => {
      const vertices: number[] = [];
      const indices: number[] = [];

      const radius = 2.2;
      const width = 1.0;
      const radialSegments = 96;
      const widthSegments = 20;
      const engravingDepth = -0.04;

      const getPoint = (u: number, v: number) => {
        const uWidth = width * u;
        const vHalf = v * 0.5;
        const x = (radius + uWidth * Math.cos(vHalf)) * Math.cos(v);
        const y = (radius + uWidth * Math.cos(vHalf)) * Math.sin(v);
        const z = uWidth * Math.sin(vHalf);
        return new THREE.Vector3(x, y, z);
      };

      for (let i = 0; i < radialSegments; i++) {
        const v = (i / radialSegments) * Math.PI * 2;
        const vNext = ((i + 1) / radialSegments) * Math.PI * 2;

        for (let j = 0; j < widthSegments; j++) {
          const u = (j / widthSegments) - 0.5;
          const uNext = ((j + 1) / widthSegments) - 0.5;

          const p0 = getPoint(u, v);
          const p1 = getPoint(uNext, v);
          const p2 = getPoint(u, vNext);
          const p3 = getPoint(uNext, vNext);

          const center = new THREE.Vector3().add(p0).add(p1).add(p2).add(p3).multiplyScalar(0.25);
          const edge1 = new THREE.Vector3().subVectors(p1, p0);
          const edge2 = new THREE.Vector3().subVectors(p2, p0);
          const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();
          center.addScaledVector(normal, engravingDepth);

          const base = vertices.length / 3;
          vertices.push(
            p0.x, p0.y, p0.z,
            p1.x, p1.y, p1.z,
            p2.x, p2.y, p2.z,
            p3.x, p3.y, p3.z,
            center.x, center.y, center.z
          );
          indices.push(
            base, base + 1, base + 4,
            base + 1, base + 3, base + 4,
            base + 3, base + 2, base + 4,
            base + 2, base, base + 4
          );
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setIndex(indices);
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: 0x9fb8ff,
        metalness: 0.65,
        roughness: 0.22,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        emissive: 0x4e6cff,
        emissiveIntensity: 0.8
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(2, -6, -10);
      return mesh;
    };

    // Fabric grid removed

    // Hyper-spheres cluster (concentric wire spheres with slight emissive glow) (not used)
    const createHyperSpheres = () => {
      const group = new THREE.Group();
      const radii = [2.5, 3.5, 4.5];
      radii.forEach((r, idx) => {
        const geo = new THREE.SphereGeometry(r, 32, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x9fffcf,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
          emissive: 0x2cffc6,
          emissiveIntensity: 0.3 + idx * 0.15
        });
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
      });
      // position set during placement
      return group;
    };

    // Wormhole (parametric funnel surface) (not used)
    const createWormhole = () => {
      const getPoint = (u: number, v: number) => {
        // u in [0,1] along axis, v in [0,1] around angle
        const z = (u - 0.5) * 16; // length
        const angle = v * Math.PI * 2;
        const radius = 1.2 + 2.2 / (1 + (z * 0.4) * (z * 0.4));
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return new THREE.Vector3(x, y, z);
      };
      const geometry = generateParametricGeometry(getPoint, 48, 160);
      const material = new THREE.MeshStandardMaterial({
        color: 0x7fe1ff,
        metalness: 0.35,
        roughness: 0.3,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
        emissive: 0x33c8ff,
        emissiveIntensity: 0.6
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = Math.PI / 2;
      return mesh;
    };

    // Kaleidoscopic lines removed

    // Helpers: positioning and instance spawning
    const samplePosition = (centers: THREE.Vector3[], minDistance: number, bounds: { x: number; y: number; zMin: number; zMax: number }) => {
      let attempts = 0;
      while (attempts < 200) {
        const pos = new THREE.Vector3(
          (Math.random() - 0.5) * bounds.x * 2,
          (Math.random() - 0.5) * bounds.y * 2,
          bounds.zMin + Math.random() * (bounds.zMax - bounds.zMin)
        );
        let ok = true;
        for (const c of centers) {
          if (pos.distanceTo(c) < minDistance) { ok = false; break; }
        }
        if (ok) return pos;
        attempts++;
      }
      return new THREE.Vector3((Math.random() - 0.5) * bounds.x * 2, (Math.random() - 0.5) * bounds.y * 2, bounds.zMin + Math.random() * (bounds.zMax - bounds.zMin));
    };

    // Create shapes
    // Spawn many instances with non-overlapping sampling (neural networks removed)

    const centers: THREE.Vector3[] = [];
    const bounds = { x: 18, y: 10, zMin: -24, zMax: -12 };

    // Helper builders (neural only)

    const place = (obj: THREE.Object3D, minDist: number, scaleRange: [number, number]) => {
      const pos = samplePosition(centers, minDist, bounds);
      obj.position.add(pos);
      const s = scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0]);
      obj.scale.setScalar(s);
      centers.push(pos.clone());
      scene.add(obj);
    };

    // Neural network ring model removed entirely

    // Phi-like data flow particles
    const flowCount = 800;
    const flowPositions = new Float32Array(flowCount * 3);
    const flowVelocities = new Float32Array(flowCount);
    for (let i = 0; i < flowCount; i++) {
      flowPositions[i * 3] = (Math.random() - 0.5) * 30;
      flowPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      flowPositions[i * 3 + 2] = -40 + Math.random() * 80;
      flowVelocities[i] = 0.06 + Math.random() * 0.08;
    }
    const flowGeometry = new THREE.BufferGeometry();
    flowGeometry.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3));
    const flowMaterial = new THREE.PointsMaterial({ color: 0xbfe7ff, size: 0.07, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const flowPoints = new THREE.Points(flowGeometry, flowMaterial);
    scene.add(flowPoints);

    // Create floating particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Gyroscope handling
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        gyroRef.current.alpha = event.alpha;
        gyroRef.current.beta = event.beta;
        gyroRef.current.gamma = event.gamma;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    // Attach gyro listener only when permission is granted or not required
    const maybeAttachGyro = () => {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      setGyroReady(true);
    };

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);
    const needsPermission = typeof (window as any).DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function';
    if (!isIOS || !needsPermission) {
      maybeAttachGyro();
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      
      // Only neural, particles below
      
      // Animate particles
      const particlePositionAttribute = particles.geometry.getAttribute('position');
      if (particlePositionAttribute) {
        const particlePositions = particlePositionAttribute.array as Float32Array;
        for (let i = 0; i < particlePositions.length; i += 3) {
          particlePositions[i + 1] += Math.sin(time + particlePositions[i]) * 0.01;
        }
        particlePositionAttribute.needsUpdate = true;
      }

      // Non-neural shapes removed

      // Kaleidoscope removed

      // No ring networks to animate

      // Animate data flow particles
      {
        const pos = flowGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < flowCount; i++) {
          const base = i * 3;
          pos[base + 2] += flowVelocities[i];
          if (pos[base + 2] > 40) {
            pos[base] = (Math.random() - 0.5) * 30;
            pos[base + 1] = (Math.random() - 0.5) * 18;
            pos[base + 2] = -40;
          }
        }
        flowGeometry.attributes.position.needsUpdate = true;
      }
      
      // Cursor magnetic attraction for arrays
      const mouseInfluence = 0.06;
      const applyParallax = (obj: THREE.Object3D, multX: number, multY: number) => {
        obj.position.x += (mouseRef.current.x * multX - obj.position.x * 0.1) * mouseInfluence;
        obj.position.y += (mouseRef.current.y * multY - obj.position.y * 0.1) * mouseInfluence;
      };
      // No ring networks to parallax
      // Others removed
      
      // Gyroscope effects
      const gyroInfluence = 0.001;
      camera.rotation.z = gyroRef.current.gamma * gyroInfluence;
      camera.rotation.x = gyroRef.current.beta * gyroInfluence;
      
      // Lighting animation
      pointLight1.position.x = Math.sin(time * 0.5) * 15;
      pointLight1.position.y = Math.cos(time * 0.3) * 10;
      
      pointLight2.position.x = Math.cos(time * 0.4) * -12;
      pointLight2.position.z = Math.sin(time * 0.6) * 8;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);

  const requestGyroPermission = async () => {
    try {
      const hasAPI = typeof (window as any).DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function';
      if (hasAPI) {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
            if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
              gyroRef.current.alpha = event.alpha;
              gyroRef.current.beta = event.beta;
              gyroRef.current.gamma = event.gamma;
            }
          });
          setGyroReady(true);
        }
      }
    } catch {}
  };

  return (
    <>
      <div 
        ref={mountRef} 
        className="fixed inset-0 z-0 pointer-events-none"
      />
      {!gyroReady && (
        <button
          type="button"
          onClick={requestGyroPermission}
          className="fixed bottom-4 right-4 z-20 rounded-md bg-indigo-500/80 text-white text-xs px-3 py-2 shadow pointer-events-auto"
        >
          Enable Motion
        </button>
      )}
    </>
  );
};

export default ThreeBackground;