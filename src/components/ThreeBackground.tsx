import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const gyroRef = useRef({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x2a2a5c, 0.3);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x6366f1, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xfbbf24, 0.8, 100);
    pointLight2.position.set(-10, -10, 5);
    scene.add(pointLight2);

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

    const fabricMaterial = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.4,
      wireframe: true
    });

    // Create Calabi-Yau manifold approximation
    const createCalabiYau = () => {
      const geometry = new THREE.SphereGeometry(3, 32, 32);
      const vertices = geometry.attributes.position.array;
      
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];
        
        // Complex deformation to approximate Calabi-Yau
        const r = Math.sqrt(x*x + y*y + z*z);
        const theta = Math.atan2(y, x);
        const phi = Math.acos(z / r);
        
        const deformation = Math.sin(3 * theta) * Math.cos(2 * phi) * 0.5;
        vertices[i] = x * (1 + deformation);
        vertices[i + 1] = y * (1 + deformation);
        vertices[i + 2] = z * (1 + deformation);
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
      
      const mesh = new THREE.Mesh(geometry, wireMaterial);
      mesh.position.set(-8, 5, -10);
      return mesh;
    };

    // Create 4D cube projection (tesseract)
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
      
      group.position.set(8, -3, -15);
      return group;
    };

    // Create Möbius strip
    const createMobiusStrip = () => {
      const geometry = new THREE.TorusGeometry(2, 0.8, 8, 16);
      const vertices = geometry.attributes.position.array;
      
      // Deform the torus to approximate a Möbius strip
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];
        
        const angle = Math.atan2(y, x);
        const twist = angle * 0.5;
        
        vertices[i + 1] = y * Math.cos(twist) - z * Math.sin(twist);
        vertices[i + 2] = y * Math.sin(twist) + z * Math.cos(twist);
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
      
      const mesh = new THREE.Mesh(geometry, wireMaterial);
      mesh.position.set(0, -8, -12);
      mesh.scale.setScalar(2);
      return mesh;
    };

    // Create dynamic fabric grid
    const createFabricGrid = () => {
      const geometry = new THREE.PlaneGeometry(20, 20, 32, 32);
      const mesh = new THREE.Mesh(geometry, fabricMaterial);
      mesh.rotation.x = -Math.PI / 4;
      mesh.position.set(0, 0, -20);
      return mesh;
    };

    // Create shapes
    const calabiYau = createCalabiYau();
    const tesseract = createTesseract();
    const mobiusStrip = createMobiusStrip();
    const fabricGrid = createFabricGrid();

    scene.add(calabiYau);
    scene.add(tesseract);
    scene.add(mobiusStrip);
    scene.add(fabricGrid);

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

    camera.position.z = 5;

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
    window.addEventListener('deviceorientation', handleDeviceOrientation);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      
      // Animate Calabi-Yau
      calabiYau.rotation.x = time * 0.2;
      calabiYau.rotation.y = time * 0.3;
      
      // Animate tesseract
      tesseract.rotation.x = time * 0.15;
      tesseract.rotation.y = time * 0.25;
      tesseract.rotation.z = time * 0.1;
      
      // Animate Möbius strip
      mobiusStrip.rotation.x = time * 0.1;
      mobiusStrip.rotation.z = time * 0.2;
      
      // Animate fabric grid (stretching and squeezing)
      const fabricVertices = fabricGrid.geometry.attributes.position.array;
      for (let i = 0; i < fabricVertices.length; i += 3) {
        const x = fabricVertices[i];
        const y = fabricVertices[i + 1];
        const wave = Math.sin(time * 2 + x * 0.5) * Math.cos(time * 1.5 + y * 0.3) * 2;
        fabricVertices[i + 2] = wave;
      }
      fabricGrid.geometry.attributes.position.needsUpdate = true;
      
      // Animate particles
      const particlePositions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particlePositions.length; i += 3) {
        particlePositions[i + 1] += Math.sin(time + particlePositions[i]) * 0.01;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Cursor magnetic attraction
      const mouseInfluence = 0.02;
      calabiYau.position.x += (mouseRef.current.x * 2 - calabiYau.position.x * 0.1) * mouseInfluence;
      calabiYau.position.y += (mouseRef.current.y * 2 - calabiYau.position.y * 0.1) * mouseInfluence;
      
      tesseract.position.x += (mouseRef.current.x * -1.5 - tesseract.position.x * 0.1) * mouseInfluence;
      tesseract.position.y += (mouseRef.current.y * -1.5 - tesseract.position.y * 0.1) * mouseInfluence;
      
      mobiusStrip.position.x += (mouseRef.current.x * 1 - mobiusStrip.position.x * 0.1) * mouseInfluence;
      mobiusStrip.position.y += (mouseRef.current.y * 1 - mobiusStrip.position.y * 0.1) * mouseInfluence;
      
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

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

export default ThreeBackground;