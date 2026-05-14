'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Crystalline AI core — rotating icosahedron with gold wireframe + glow,
 * surrounded by ambient particles. Lazy-loaded by the marketing page so
 * Three.js never blocks initial render.
 */

function Crystal() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x -= delta * 0.08;
      wireRef.current.rotation.y -= delta * 0.12;
    }
  });

  // Edges geometry for the wireframe overlay
  const edges = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(2.05, 1);
    return new THREE.EdgesGeometry(geom);
  }, []);

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
      {/* Inner solid form — distorts subtly */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 4]} />
        <MeshDistortMaterial
          color="#0A0A0A"
          metalness={0.95}
          roughness={0.15}
          distort={0.25}
          speed={1.5}
          emissive="#C8A96B"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Wireframe overlay — gold edges */}
      <lineSegments ref={wireRef} geometry={edges}>
        <lineBasicMaterial color="#C8A96B" transparent opacity={0.7} />
      </lineSegments>

      {/* Outer halo ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[3.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#E5D29D" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.8, 0.008, 16, 100]} />
        <meshBasicMaterial color="#C8A96B" transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#E5D29D"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export function CrystalScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#E5D29D" />
      <pointLight position={[-5, -3, 2]} intensity={0.6} color="#7A1E2C" />
      <pointLight position={[0, 4, -4]} intensity={0.4} color="#0F5C4D" />

      <Crystal />
      <Particles />
    </Canvas>
  );
}
