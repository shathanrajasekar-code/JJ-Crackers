'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type BlastType = 'burst' | 'fountain' | 'spin' | 'sparkle';

interface ParticleSystemProps {
  count?: number;
  position: [number, number, number];
  color?: string;
  type?: BlastType;
  onComplete?: () => void;
}

function FireworkParticles({ count = 800, position, color = '#D4AF37', type = 'burst', onComplete }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const duration = 2000; // 2 seconds

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = position[0];
      pos[i * 3 + 1] = position[1];
      pos[i * 3 + 2] = position[2];

      let vx = 0, vy = 0, vz = 0;
      
      if (type === 'burst') {
        const phi = Math.acos(-1 + Math.random() * 2);
        const theta = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 8;
        vx = Math.sin(phi) * Math.cos(theta) * speed;
        vy = Math.sin(phi) * Math.sin(theta) * speed;
        vz = Math.cos(phi) * speed;
      } else if (type === 'fountain') {
        vx = (Math.random() - 0.5) * 3;
        vy = 8 + Math.random() * 10;
        vz = (Math.random() - 0.5) * 3;
      } else if (type === 'spin') {
        const angle = (i / count) * Math.PI * 2 * 15;
        const speed = 8 + Math.random() * 5;
        vx = Math.cos(angle) * speed;
        vy = (Math.random() - 0.5) * 2;
        vz = Math.sin(angle) * speed;
      } else { // sparkle
        vx = (Math.random() - 0.5) * 15;
        vy = (Math.random() - 0.5) * 15;
        vz = (Math.random() - 0.5) * 15;
      }

      vel[i * 3] = vx;
      vel[i * 3 + 1] = vy;
      vel[i * 3 + 2] = vz;
      sizes[i] = Math.random() * 2 + 1;
    }
    return { pos, vel, sizes };
  }, [count, position, type]);

  useFrame((state, delta) => {
    if (!pointsRef.current || startTime === null) return;
    const elapsed = Date.now() - startTime;
    const progress = elapsed / duration;
    if (progress >= 1) {
      onComplete?.();
      return;
    }
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = particles.vel;
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] * delta;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
      velocities[i * 3 + 1] -= 9.8 * delta * 0.8; // Gravity
      velocities[i * 3] *= 0.97; // Drag
      velocities[i * 3 + 1] *= 0.97;
      velocities[i * 3 + 2] *= 0.97;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (pointsRef.current.material instanceof THREE.PointsMaterial) {
      pointsRef.current.material.opacity = 1 - progress;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* @ts-ignore - R3F bufferAttribute typing */}
        <bufferAttribute attach="attributes-position" count={particles.pos.length / 3} array={particles.pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color={color} transparent blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation={true} />
    </points>
  );
}

export function RealisticFirework({ x = 0, y = 0, type = 'burst', color = '#D4AF37', onComplete }: { x?: number; y?: number; type?: BlastType; color?: string; onComplete?: () => void }) {
  const [coords, setCoords] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    // Screen to world approx
    const wx = (x / window.innerWidth) * 40 - 20;
    const wy = -(y / window.innerHeight) * 30 + 15;
    setCoords([wx, wy, 0]);
  }, [x, y]);

  if (!coords) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[coords[0], coords[1], 5]} intensity={5} color={color} />
        <FireworkParticles position={coords} color={color} type={type} onComplete={onComplete} />
      </Canvas>
    </div>
  );
}
