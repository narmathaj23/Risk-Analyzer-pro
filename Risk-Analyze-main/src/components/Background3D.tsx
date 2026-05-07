import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedBlob({ position, color, speed, distort }: { position: [number, number, number], color: string, speed: number, distort: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * speed;
      mesh.current.rotation.y = state.clock.getElapsedTime() * speed * 0.8;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={mesh} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={speed}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#9D50BB" intensity={1} />
        
        <AnimatedBlob position={[-2, 1, -1]} color="#00D2FF" speed={1.5} distort={0.4} />
        <AnimatedBlob position={[2, -1, -2]} color="#9D50BB" speed={1.2} distort={0.5} />
        <AnimatedBlob position={[0, -2, -3]} color="#6E48AA" speed={1} distort={0.3} />
        
        <mesh position={[0, 0, -10]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
    </div>
  );
}
