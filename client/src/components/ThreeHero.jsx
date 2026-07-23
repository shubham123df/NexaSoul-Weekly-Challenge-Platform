import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeHero() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // NexaSoul brand colors
    const colors = [
      new THREE.Color(0x2563eb), // primary blue
      new THREE.Color(0x06b6d4), // cyan
      new THREE.Color(0x8b5cf6), // purple
      new THREE.Color(0x10b981), // emerald
      new THREE.Color(0xf59e0b), // amber
    ];

    // Create floating geometric shapes
    const shapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.TorusGeometry(0.7, 0.3, 16, 100),
      new THREE.SphereGeometry(0.8, 32, 32),
    ];

    for (let i = 0; i < 40; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3,
        wireframe: Math.random() > 0.5,
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.x = (Math.random() - 0.5) * 80;
      mesh.position.y = (Math.random() - 0.5) * 60;
      mesh.position.z = (Math.random() - 0.5) * 40;
      
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.01,
        },
        floatSpeed: (Math.random() - 0.5) * 0.03,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: mesh.position.y,
      };
      
      shapes.push(mesh);
      scene.add(mesh);
    }

    // Create connecting lines between nearby shapes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x2563eb),
      transparent: true,
      opacity: 0.15,
    });

    const linesGeometry = new THREE.BufferGeometry();
    const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(linesMesh);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;

      // Update shapes
      shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.rotation.z += shape.userData.rotationSpeed.z;

        // Floating motion
        shape.position.y = shape.userData.originalY + 
          Math.sin(time * 2 + shape.userData.floatOffset) * 3;
        
        // Gentle color pulsing
        const hueShift = Math.sin(time + shape.userData.floatOffset) * 0.05;
        shape.material.color.setHSL(
          (shape.material.color.getHSL({}).h + hueShift) % 1,
          0.7,
          0.5 + Math.sin(time * 1.5 + shape.userData.floatOffset) * 0.15
        );
      });

      // Update connecting lines
      const linePositions = [];
      const maxDistance = 15;
      
      for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
          const distance = shapes[i].position.distanceTo(shapes[j].position);
          if (distance < maxDistance) {
            linePositions.push(
              shapes[i].position.x, shapes[i].position.y, shapes[i].position.z,
              shapes[j].position.x, shapes[j].position.y, shapes[j].position.z
            );
          }
        }
      }
      
      linesGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      );

      // Camera rotation with smooth easing
      targetRotationX = mouseY * 0.1;
      targetRotationY = mouseX * 0.1;
      camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05;
      camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05;

      // Gentle camera sway
      camera.position.x = Math.sin(time * 0.3) * 2;
      camera.position.y = Math.cos(time * 0.25) * 1.5;
      camera.position.z = 50 + Math.sin(time * 0.2) * 2;

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      shapes.forEach(shape => scene.remove(shape));
      scene.remove(linesMesh);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none', zIndex: 1 }}
    />
  );
}
