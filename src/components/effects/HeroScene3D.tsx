'use client';

import React, { useRef, useMemo, useEffect, useCallback, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Sparkles, ContactShadows, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════
// SECTION 1 — WEB AUDIO SYNTHESIZER (4DX SOUND EFFECTS)
// ═══════════════════════════════════════════════════════════════

class FireworkAudio {
  private ctx: AudioContext | null = null;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch { /* silently fail on unsupported browsers */ }
  }

  playBang() {
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const t = this.ctx.currentTime;

      // Low-frequency boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(18, t + 0.25);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);

      // Noise crackle
      const noise = this.ctx.createBufferSource();
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      noise.buffer = buf;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(700, t);
      lp.frequency.exponentialRampToValueAtTime(40, t + 0.4);
      const ng = this.ctx.createGain();
      ng.gain.setValueAtTime(0.15, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      noise.connect(lp).connect(ng).connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.4);
    } catch { /* audio errors are non-critical */ }
  }

  playSizzle() {
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const t = this.ctx.currentTime;
      const noise = this.ctx.createBufferSource();
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.15, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.03;
      noise.buffer = buf;
      const hp = this.ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 3000;
      const ng = this.ctx.createGain();
      ng.gain.setValueAtTime(0.05, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      noise.connect(hp).connect(ng).connect(this.ctx.destination);
      noise.start(t);
      noise.stop(t + 0.15);
    } catch { /* non-critical */ }
  }
}

const fxAudio = new FireworkAudio();

// ═══════════════════════════════════════════════════════════════
// SECTION 2 — CONSTANTS & SHARED
// ═══════════════════════════════════════════════════════════════

const FONT_URL = 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD7K_RW7eP5S_DWay8zzLyydVQ7mZ.woff';
const PRODUCTS = ['sparkler', 'flowerpot', 'rocket', 'chakra', 'bomb', 'fountain'] as const;
const SKIN = '#E8B893';
const GOLD = '#D4AF37';
const HAIR = '#0a0a0a';

// ═══════════════════════════════════════════════════════════════
// SECTION 3 — PARALLAX CAMERA (mouse-reactive)
// ═══════════════════════════════════════════════════════════════

function ParallaxCamera() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    if (!camRef.current) return;
    const m = mouseRef.current;
    camRef.current.position.x = THREE.MathUtils.lerp(camRef.current.position.x, m.x * 0.5, 0.025);
    camRef.current.position.y = THREE.MathUtils.lerp(camRef.current.position.y, 2.6 + m.y * 0.25, 0.025);
    camRef.current.lookAt(0.2, 1.15, 0);
  });

  return <PerspectiveCamera ref={camRef} makeDefault position={[0, 2.6, 7.5]} fov={46} near={0.1} far={60} />;
}

// ═══════════════════════════════════════════════════════════════
// SECTION 4 — ENVIRONMENT: Rangoli, Diya, Embers
// ═══════════════════════════════════════════════════════════════

function RangoliFloor() {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#110F0A" roughness={0.95} />
      </mesh>
      {/* Concentric golden rings */}
      {[0.9, 1.7, 2.5, 3.3].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002 * (i + 1), 0]}>
          <torusGeometry args={[r, 0.014, 6, 72]} />
          <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.15} emissive={GOLD} emissiveIntensity={0.25} />
        </mesh>
      ))}
      {/* Diamond dot pattern */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={`d${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[Math.cos(a) * 2.1, 0.003, Math.sin(a) * 2.1]}>
            <circleGeometry args={[0.06, 6]} />
            <meshStandardMaterial color="#F4E296" emissive={GOLD} emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

function DiyaLamp({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const bowlPts = useMemo(() => [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.32, 0.03),
    new THREE.Vector2(0.45, 0.12),
    new THREE.Vector2(0.4, 0.24),
  ], []);

  useFrame((s) => {
    const t = s.clock.elapsedTime + position[0] * 3; // offset by position for variety
    if (flameRef.current) flameRef.current.scale.set(1 + Math.sin(t * 14) * 0.12, 1 + Math.sin(t * 9) * 0.18, 1 + Math.cos(t * 11) * 0.1);
    if (lightRef.current) lightRef.current.intensity = 1.1 + Math.sin(t * 16) * 0.3;
  });

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <latheGeometry args={[bowlPts, 20]} />
        <meshStandardMaterial color="#A67C00" metalness={0.88} roughness={0.12} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.012, 0.02, 0.12, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh ref={flameRef} position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshBasicMaterial color="#FFCC33" transparent opacity={0.92} />
      </mesh>
      {/* Glow halo */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color="#FF6600" transparent opacity={0.06} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.38, 0]} intensity={1.1} distance={3.5} color="#FF8C00" decay={2} />
    </group>
  );
}

function FloatingEmbers({ count = 70 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 16,
    y: Math.random() * 11,
    z: (Math.random() - 0.5) * 10 - 1,
    speed: 0.12 + Math.random() * 0.35,
    phase: Math.random() * Math.PI * 2,
    size: 0.018 + Math.random() * 0.022,
  })), [count]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    data.forEach((p, i) => {
      const y = (p.y + t * p.speed) % 11;
      dummy.position.set(p.x + Math.sin(t * 0.35 + p.phase) * 0.35, y, p.z + Math.cos(t * 0.25 + p.phase) * 0.25);
      dummy.scale.setScalar(p.size * (0.75 + Math.sin(t * 2.5 + p.phase) * 0.25));
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color={GOLD} transparent opacity={0.45} toneMapped={false} />
    </instancedMesh>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 5 — SPARKLER PARTICLE EFFECT (world-space)
// ═══════════════════════════════════════════════════════════════

function SparklerEffect({ tipRef }: { tipRef: React.MutableRefObject<THREE.Vector3> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const MAX = 70;

  const particles = useRef(Array.from({ length: MAX }, () => ({
    pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 1,
  })));

  useFrame((s, delta) => {
    const tip = tipRef.current;
    // Spawn 4–6 sparks per frame from the sparkler tip
    let spawned = 0;
    for (const p of particles.current) {
      if (spawned >= 5) break;
      if (p.life >= 1) {
        p.pos.copy(tip);
        p.vel.set((Math.random() - 0.5) * 2.2, (Math.random() - 0.15) * 2.8, (Math.random() - 0.5) * 2.2);
        p.life = 0;
        spawned++;
      }
    }

    particles.current.forEach((p, i) => {
      if (p.life >= 1) {
        dummy.scale.setScalar(0);
      } else {
        p.life += delta * 2.4;
        p.pos.x += p.vel.x * delta;
        p.pos.y += p.vel.y * delta - delta * 2;
        p.pos.z += p.vel.z * delta;
        dummy.position.copy(p.pos);
        dummy.scale.setScalar(Math.max(0, (1 - p.life) * 0.07));
      }
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;

    if (lightRef.current) {
      lightRef.current.position.copy(tip);
      lightRef.current.intensity = 1.6 + Math.sin(s.clock.elapsedTime * 28) * 0.5 + Math.random() * 0.15;
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, MAX]} frustumCulled={false}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#FFCC33" transparent opacity={0.88} toneMapped={false} />
      </instancedMesh>
      <pointLight ref={lightRef} distance={3} color="#FF8C00" decay={2} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 6 — PATTU PAVADAI GIRL CHARACTER
// ═══════════════════════════════════════════════════════════════

function PattuPavadaiGirl({
  position,
  sparklerTipRef,
}: {
  position: [number, number, number];
  sparklerTipRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rArmRef = useRef<THREE.Group>(null);
  const lArmRef = useRef<THREE.Group>(null);
  const tipRef = useRef<THREE.Group>(null);

  // Elegant bell-shaped silk pavadai
  const skirtPts = useMemo(() => [
    new THREE.Vector2(0.18, 1.3),
    new THREE.Vector2(0.22, 1.12),
    new THREE.Vector2(0.34, 0.82),
    new THREE.Vector2(0.48, 0.48),
    new THREE.Vector2(0.58, 0.18),
    new THREE.Vector2(0.62, 0.0),
  ], []);

  useFrame((s) => {
    const t = s.clock.elapsedTime;

    // Body sway
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 2.2) * 0.022;
      groupRef.current.position.y = Math.sin(t * 3.2) * 0.035;
    }

    // Head bob
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 2.8) * 0.04;
      headRef.current.rotation.y = Math.sin(t * 1.6) * 0.06;
    }

    // Right arm: 3s wave every 15s, else hold sparkler
    if (rArmRef.current) {
      const cycle = t % 15;
      if (cycle < 3) {
        rArmRef.current.rotation.z = THREE.MathUtils.lerp(rArmRef.current.rotation.z, Math.PI / 3 + Math.sin(t * 7) * 0.28, 0.07);
        rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, Math.cos(t * 5) * 0.12, 0.07);
      } else {
        rArmRef.current.rotation.z = THREE.MathUtils.lerp(rArmRef.current.rotation.z, Math.PI / 6.5, 0.035);
        rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, -0.22, 0.035);
      }
    }

    // Left arm gentle swing
    if (lArmRef.current) {
      lArmRef.current.rotation.z = -Math.PI / 9 + Math.sin(t * 2.6 + 1) * 0.055;
    }

    // Track sparkler tip world-space position
    if (tipRef.current) tipRef.current.getWorldPosition(sparklerTipRef.current);
  });

  const skinMat = <meshStandardMaterial color={SKIN} roughness={0.7} />;
  const goldMat = <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.1} />;

  return (
    <group position={position}>
      {/* Base rotation — face slightly toward camera-right */}
      <group rotation={[0, 0.12, 0]}>
        <group ref={groupRef}>
          {/* ─── PAVADAI (Magenta Silk Skirt) ─── */}
          <mesh castShadow receiveShadow>
            <latheGeometry args={[skirtPts, 28]} />
            <meshStandardMaterial color="#C71585" roughness={0.22} metalness={0.38} />
          </mesh>
          {/* Gold zari border — bottom */}
          <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.62, 0.022, 6, 32]} />
            {goldMat}
          </mesh>
          {/* Gold zari border — waist */}
          <mesh position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.013, 6, 24]} />
            {goldMat}
          </mesh>

          {/* ─── BLOUSE (Emerald Green Silk) ─── */}
          <mesh position={[0, 1.52, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.18, 0.42, 14]} />
            <meshStandardMaterial color="#059669" roughness={0.28} metalness={0.32} />
          </mesh>
          {/* Neckline gold trim */}
          <mesh position={[0, 1.73, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.155, 0.011, 6, 20]} />
            {goldMat}
          </mesh>

          {/* ─── NECK ─── */}
          <mesh position={[0, 1.79, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.062, 0.1, 10]} />
            {skinMat}
          </mesh>

          {/* ─── HEAD ─── */}
          <group ref={headRef} position={[0, 2.07, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.26, 18, 18]} />
              {skinMat}
            </mesh>
            {/* Eye whites */}
            <mesh position={[-0.075, 0.04, 0.21]}>
              <sphereGeometry args={[0.038, 8, 8]} />
              <meshStandardMaterial color="#F5F5F0" roughness={0.4} />
            </mesh>
            <mesh position={[0.075, 0.04, 0.21]}>
              <sphereGeometry args={[0.038, 8, 8]} />
              <meshStandardMaterial color="#F5F5F0" roughness={0.4} />
            </mesh>
            {/* Pupils */}
            <mesh position={[-0.075, 0.04, 0.235]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#1a1100" roughness={0.25} />
            </mesh>
            <mesh position={[0.075, 0.04, 0.235]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#1a1100" roughness={0.25} />
            </mesh>
            {/* Bindi */}
            <mesh position={[0, 0.1, 0.255]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshBasicMaterial color="#FF0000" />
            </mesh>
            {/* Smile */}
            <mesh position={[0, -0.04, 0.255]} rotation={[0.12, 0, 0]}>
              <torusGeometry args={[0.035, 0.007, 4, 12, Math.PI]} />
              <meshStandardMaterial color="#CC8888" roughness={0.7} />
            </mesh>
            {/* Hair */}
            <mesh position={[0, 0.1, -0.04]} castShadow>
              <sphereGeometry args={[0.28, 14, 14]} />
              <meshStandardMaterial color={HAIR} roughness={0.92} />
            </mesh>
            {/* Hair bun */}
            <mesh position={[0, 0.06, -0.26]} castShadow>
              <sphereGeometry args={[0.13, 10, 10]} />
              <meshStandardMaterial color={HAIR} roughness={0.92} />
            </mesh>
            {/* Jasmine flowers */}
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(a) * 0.16, 0.06 + Math.sin(a) * 0.05, -0.22]}>
                  <sphereGeometry args={[0.025, 6, 6]} />
                  <meshStandardMaterial color="#FFFFF0" roughness={0.85} emissive="#FFFFF0" emissiveIntensity={0.15} />
                </mesh>
              );
            })}
          </group>

          {/* ─── LEFT ARM ─── */}
          <group ref={lArmRef} position={[-0.27, 1.58, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.052, 0.038, 0.38, 8]} />
              <meshStandardMaterial color="#059669" roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.4, 0]}>
              <sphereGeometry args={[0.042, 8, 8]} />
              {skinMat}
            </mesh>
            {/* Bangle */}
            <mesh position={[0, -0.33, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.048, 0.009, 6, 16]} />
              {goldMat}
            </mesh>
          </group>

          {/* ─── RIGHT ARM (holds Sparkler) ─── */}
          <group ref={rArmRef} position={[0.27, 1.58, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.052, 0.038, 0.38, 8]} />
              <meshStandardMaterial color="#059669" roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.4, 0]}>
              <sphereGeometry args={[0.042, 8, 8]} />
              {skinMat}
            </mesh>
            {/* Bangle */}
            <mesh position={[0, -0.33, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.048, 0.009, 6, 16]} />
              {goldMat}
            </mesh>
            {/* Sparkler stick */}
            <group position={[0.02, -0.44, 0.02]}>
              <mesh>
                <cylinderGeometry args={[0.009, 0.014, 0.48, 6]} />
                <meshStandardMaterial color="#999" metalness={0.35} roughness={0.55} />
              </mesh>
              {/* Invisible tip marker — world position tracked for particle emission */}
              <group ref={tipRef} position={[0, 0.27, 0]} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 7 — VESHTI BOY CHARACTER
// ═══════════════════════════════════════════════════════════════

function VeshtiBoy({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rArmRef = useRef<THREE.Group>(null);
  const lArmRef = useRef<THREE.Group>(null);

  const skinMat = <meshStandardMaterial color={SKIN} roughness={0.7} />;
  const goldMat = <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.1} />;

  useFrame((s) => {
    const t = s.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.cos(t * 2.2) * 0.022;
      groupRef.current.position.y = Math.cos(t * 3.2) * 0.035;
    }

    if (headRef.current) {
      headRef.current.rotation.z = Math.cos(t * 2.6) * 0.04;
      headRef.current.rotation.y = Math.cos(t * 1.4) * 0.065;
    }

    if (rArmRef.current) {
      const cycle = t % 15;
      if (cycle >= 8 && cycle < 10) {
        // Clapping
        rArmRef.current.rotation.z = Math.PI / 7 + Math.sin(t * 11) * 0.12;
        rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, 0.3, 0.06);
      } else if (cycle >= 4 && cycle < 6) {
        // Waving (offset from girl)
        rArmRef.current.rotation.z = THREE.MathUtils.lerp(rArmRef.current.rotation.z, Math.PI / 3 + Math.sin(t * 7) * 0.22, 0.06);
        rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, 0, 0.06);
      } else {
        rArmRef.current.rotation.z = THREE.MathUtils.lerp(rArmRef.current.rotation.z, 0.04, 0.035);
        rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, 0, 0.035);
      }
    }

    if (lArmRef.current) {
      const cycle = t % 15;
      if (cycle >= 8 && cycle < 10) {
        lArmRef.current.rotation.z = -(Math.PI / 7) - Math.sin(t * 11) * 0.12;
        lArmRef.current.rotation.x = THREE.MathUtils.lerp(lArmRef.current.rotation.x, 0.3, 0.06);
      } else {
        lArmRef.current.rotation.z = THREE.MathUtils.lerp(lArmRef.current.rotation.z, -0.04, 0.035);
        lArmRef.current.rotation.x = THREE.MathUtils.lerp(lArmRef.current.rotation.x, 0, 0.035);
      }
    }
  });

  return (
    <group position={position}>
      <group rotation={[0, -0.12, 0]}>
        <group ref={groupRef}>
          {/* ─── VESHTI (White Dhoti) ─── */}
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.35, 1.1, 14]} />
            <meshStandardMaterial color="#FAFAF8" roughness={0.45} metalness={0.05} />
          </mesh>
          {/* Gold zari border */}
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.35, 0.018, 6, 24]} />
            {goldMat}
          </mesh>

          {/* ─── SHIRT (Cream Silk) ─── */}
          <mesh position={[0, 1.32, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.48, 14]} />
            <meshStandardMaterial color="#FDF8EE" roughness={0.38} metalness={0.12} />
          </mesh>
          {/* Buttons */}
          <mesh position={[0, 1.4, 0.16]}><sphereGeometry args={[0.013, 6, 6]} /><meshBasicMaterial color={GOLD} /></mesh>
          <mesh position={[0, 1.28, 0.18]}><sphereGeometry args={[0.013, 6, 6]} /><meshBasicMaterial color={GOLD} /></mesh>

          {/* ─── NECK ─── */}
          <mesh position={[0, 1.61, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.1, 10]} />
            {skinMat}
          </mesh>

          {/* ─── HEAD ─── */}
          <group ref={headRef} position={[0, 1.88, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.26, 18, 18]} />
              {skinMat}
            </mesh>
            {/* Eye whites */}
            <mesh position={[-0.075, 0.04, 0.21]}><sphereGeometry args={[0.038, 8, 8]} /><meshStandardMaterial color="#F5F5F0" roughness={0.4} /></mesh>
            <mesh position={[0.075, 0.04, 0.21]}><sphereGeometry args={[0.038, 8, 8]} /><meshStandardMaterial color="#F5F5F0" roughness={0.4} /></mesh>
            {/* Pupils */}
            <mesh position={[-0.075, 0.04, 0.235]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#1a1100" roughness={0.25} /></mesh>
            <mesh position={[0.075, 0.04, 0.235]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#1a1100" roughness={0.25} /></mesh>
            {/* Smile */}
            <mesh position={[0, -0.04, 0.255]} rotation={[0.12, 0, 0]}>
              <torusGeometry args={[0.035, 0.007, 4, 12, Math.PI]} />
              <meshStandardMaterial color="#CC8888" roughness={0.7} />
            </mesh>
            {/* Hair */}
            <mesh position={[0, 0.11, 0]} castShadow>
              <sphereGeometry args={[0.27, 14, 14]} />
              <meshStandardMaterial color={HAIR} roughness={0.95} />
            </mesh>
            {/* Tilak (sandalwood + kumkum) */}
            <mesh position={[0, 0.07, 0.255]}>
              <boxGeometry args={[0.05, 0.018, 0.008]} />
              <meshBasicMaterial color="#FFE0B2" />
            </mesh>
            <mesh position={[0, 0.07, 0.26]}>
              <sphereGeometry args={[0.01, 6, 6]} />
              <meshBasicMaterial color="#FF0000" />
            </mesh>
          </group>

          {/* ─── LEFT ARM ─── */}
          <group ref={lArmRef} position={[-0.28, 1.42, 0]}>
            <mesh position={[0, -0.17, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.038, 0.36, 8]} />
              <meshStandardMaterial color="#FDF8EE" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.38, 0]}>
              <sphereGeometry args={[0.042, 8, 8]} />
              {skinMat}
            </mesh>
          </group>

          {/* ─── RIGHT ARM ─── */}
          <group ref={rArmRef} position={[0.28, 1.42, 0]}>
            <mesh position={[0, -0.17, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.038, 0.36, 8]} />
              <meshStandardMaterial color="#FDF8EE" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.38, 0]}>
              <sphereGeometry args={[0.042, 8, 8]} />
              {skinMat}
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 8 — JJ CRACKERS PREMIUM GIFT BOX
// ═══════════════════════════════════════════════════════════════

function ProductShape({ type }: { type: string }) {
  switch (type) {
    case 'sparkler':
      return (<group>
        <mesh><cylinderGeometry args={[0.013, 0.013, 0.45, 6]} /><meshStandardMaterial color="#999" metalness={0.4} /></mesh>
        <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial color="#FFD700" transparent opacity={0.85} toneMapped={false} /></mesh>
      </group>);
    case 'flowerpot':
      return <mesh><coneGeometry args={[0.12, 0.28, 12]} /><meshStandardMaterial color="#A0522D" roughness={0.8} /></mesh>;
    case 'rocket':
      return (<group>
        <mesh><cylinderGeometry args={[0.035, 0.035, 0.32, 8]} /><meshStandardMaterial color="#F43F5E" roughness={0.65} /></mesh>
        <mesh position={[0, 0.22, 0]}><coneGeometry args={[0.06, 0.12, 8]} /><meshStandardMaterial color={GOLD} metalness={0.55} /></mesh>
      </group>);
    case 'chakra':
      return <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.025, 8, 20]} /><meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.25} /></mesh>;
    case 'bomb':
      return <mesh><boxGeometry args={[0.16, 0.12, 0.22]} /><meshStandardMaterial color="#10B981" roughness={0.85} /></mesh>;
    default: // fountain
      return <mesh><cylinderGeometry args={[0.07, 0.055, 0.32, 8]} /><meshStandardMaterial color="#4488FF" roughness={0.55} /></mesh>;
  }
}

function JJGiftBox({ position }: { position: [number, number, number] }) {
  const lidRef = useRef<THREE.Group>(null);
  const prodRef = useRef<THREE.Group>(null);
  const boxRef = useRef<THREE.Group>(null);
  const [prodIdx, setProdIdx] = useState(0);
  const prevIdx = useRef(0);
  const mouseRef = useRef({ x: 0 });

  const BW = 0.9, BH = 0.55, BD = 0.6;
  const CYCLE = 7;

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const cT = (t % CYCLE) / CYCLE;

    // Product index (triggers re-render only on change — every 7s)
    const newIdx = Math.floor(t / CYCLE) % PRODUCTS.length;
    if (newIdx !== prevIdx.current) { prevIdx.current = newIdx; setProdIdx(newIdx); }

    // Lid open/close
    if (lidRef.current) {
      const target = (cT > 0.1 && cT < 0.85) ? -Math.PI / 3.5 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, target, 0.055);
    }

    // Product rise, rotate, descend
    if (prodRef.current) {
      const targetY = (cT > 0.15 && cT < 0.8) ? 0.55 : -0.05;
      prodRef.current.position.y = THREE.MathUtils.lerp(prodRef.current.position.y, BH + targetY, 0.04);
      if (cT > 0.15 && cT < 0.8) prodRef.current.rotation.y = t * 1.6;
    }

    // Mouse rotation on box
    if (boxRef.current) {
      boxRef.current.rotation.y = THREE.MathUtils.lerp(boxRef.current.rotation.y, mouseRef.current.x * 0.1, 0.025);
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.15} rotationIntensity={0}>
      <group position={position} ref={boxRef}>
        {/* Box body — matte black */}
        <mesh position={[0, BH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[BW, BH, BD]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.55} metalness={0.18} />
        </mesh>

        {/* Gold corner edges */}
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sz], i) => (
          <mesh key={i} position={[sx * BW / 2, BH / 2, sz * BD / 2]}>
            <boxGeometry args={[0.018, BH + 0.02, 0.018]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
        {/* Gold top trim */}
        <mesh position={[0, BH, 0]}>
          <boxGeometry args={[BW + 0.018, 0.015, BD + 0.018]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Box front branding */}
        <Suspense fallback={null}>
          <Text position={[0, BH / 2 + 0.04, BD / 2 + 0.01]} fontSize={0.16} color={GOLD} font={FONT_URL} anchorX="center" anchorY="middle">
            JJ
          </Text>
          <Text position={[0, BH / 2 - 0.12, BD / 2 + 0.01]} fontSize={0.04} color="#A08840" font={FONT_URL} anchorX="center" anchorY="middle">
            JEGAJOTHI CRACKERS
          </Text>
          <Text position={[0, BH / 2 - 0.2, BD / 2 + 0.01]} fontSize={0.025} color="#807050" font={FONT_URL} anchorX="center" anchorY="middle">
            SINCE 2015 · SIVAKASI
          </Text>
        </Suspense>

        {/* Lid — hinged at back edge */}
        <group ref={lidRef} position={[0, BH, -BD / 2]}>
          <mesh position={[0, 0.02, BD / 2]} castShadow>
            <boxGeometry args={[BW + 0.02, 0.035, BD + 0.02]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.55} metalness={0.18} />
          </mesh>
          <mesh position={[0, 0.04, BD / 2]}>
            <boxGeometry args={[BW + 0.03, 0.008, BD + 0.03]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Product showcase (cycles through PRODUCTS) */}
        <group ref={prodRef} position={[0, BH, 0]}>
          <ProductShape type={PRODUCTS[prodIdx]} />
        </group>

        {/* Sparkles around showcase area */}
        <Sparkles count={18} scale={[1, 1.2, 0.8]} position={[0, BH + 0.45, 0]} size={1.2} speed={0.7} color={GOLD} />
      </group>
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 9 — FIREWORKS SYSTEM
// ═══════════════════════════════════════════════════════════════

interface FWParticle { pos: THREE.Vector3; vel: THREE.Vector3; life: number; }

function FireworkSystem() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const MAX = 350;
  const particlesRef = useRef<FWParticle[]>([]);
  const lt1 = useRef<THREE.PointLight>(null);
  const lt2 = useRef<THREE.PointLight>(null);
  const lightsData = useRef<{ pos: THREE.Vector3; life: number }[]>([]);

  const boom = useCallback((origin: THREE.Vector3) => {
    for (let i = 0; i < 45; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      const sp = 2.2 + Math.random() * 3.8;
      particlesRef.current.push({
        pos: origin.clone(),
        vel: new THREE.Vector3(Math.sin(ph) * Math.cos(th) * sp, Math.sin(ph) * Math.sin(th) * sp, Math.cos(ph) * sp),
        life: 0,
      });
    }
    lightsData.current.push({ pos: origin.clone(), life: 0 });
    if (lightsData.current.length > 2) lightsData.current.shift();
    fxAudio.playBang();
  }, []);

  useEffect(() => {
    const initA = () => fxAudio.init();
    document.addEventListener('click', initA, { once: true });
    document.addEventListener('touchstart', initA, { once: true });

    // First firework after 2.5s, then recurring with random intervals
    let tid: ReturnType<typeof setTimeout>;
    const schedule = () => {
      tid = setTimeout(() => {
        boom(new THREE.Vector3((Math.random() - 0.5) * 7, 5 + Math.random() * 3.5, -3 - Math.random() * 4));
        schedule();
      }, 5500 + Math.random() * 2500);
    };
    tid = setTimeout(() => {
      boom(new THREE.Vector3((Math.random() - 0.5) * 5, 5.5 + Math.random() * 2, -4));
      schedule();
    }, 2500);

    return () => {
      clearTimeout(tid);
      document.removeEventListener('click', initA);
      document.removeEventListener('touchstart', initA);
    };
  }, [boom]);

  useFrame((_, dt) => {
    // Prune dead particles
    particlesRef.current = particlesRef.current.filter(p => p.life < 1);
    if (particlesRef.current.length > MAX) particlesRef.current = particlesRef.current.slice(-MAX);

    const count = particlesRef.current.length;
    particlesRef.current.forEach((p, i) => {
      p.life += dt * 0.65;
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt - dt * 1.4;
      p.pos.z += p.vel.z * dt;
      p.vel.multiplyScalar(0.985);
      dummy.position.copy(p.pos);
      dummy.scale.setScalar(Math.max(0, (1 - p.life) * 0.09));
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    // Zero remaining slots
    for (let i = count; i < MAX; i++) {
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    }
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;

    // Dynamic explosion lights
    lightsData.current.forEach((exp, i) => {
      exp.life += dt * 1.1;
      const l = i === 0 ? lt1.current : lt2.current;
      if (l) { l.position.copy(exp.pos); l.intensity = Math.max(0, 4 * (1 - exp.life)); }
    });
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, MAX]} frustumCulled={false}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.82} toneMapped={false} />
      </instancedMesh>
      <pointLight ref={lt1} intensity={0} distance={14} color="#FFD700" />
      <pointLight ref={lt2} intensity={0} distance={14} color="#FF6644" />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 10 — SCENE ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════

function FestiveScene() {
  const sparklerTip = useRef(new THREE.Vector3(-0.5, 2, 0.5));

  return (
    <group>
      <ParallaxCamera />

      {/* ── Cinematic Lighting ── */}
      <ambientLight intensity={0.32} color="#FFF5E0" />
      <spotLight
        position={[5, 11, 5]}
        angle={0.55}
        penumbra={1}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#FFEAA7"
      />
      <pointLight position={[-5, 4.5, 3]} intensity={0.7} color="#FF7F50" distance={12} />
      <pointLight position={[4, 2, -3]} intensity={0.4} color={GOLD} distance={10} />

      {/* ── Atmosphere ── */}
      <fog attach="fog" args={['#0A0A08', 7, 26]} />

      {/* ── Environment ── */}
      <RangoliFloor />
      <ContactShadows resolution={512} scale={10} blur={2.5} opacity={0.45} far={3.5} color="#000" position={[0, 0.005, 0]} />

      {/* ── Diyas (oil lamps) ── */}
      <DiyaLamp position={[-2.4, 0, 2.2]} />
      <DiyaLamp position={[3.2, 0, 1.8]} />
      <DiyaLamp position={[-1.2, 0, -0.8]} />
      <DiyaLamp position={[2.2, 0, -1.2]} />

      {/* ── Characters ── */}
      <PattuPavadaiGirl position={[-0.55, 0, 0.7]} sparklerTipRef={sparklerTip} />
      <VeshtiBoy position={[1.1, 0, 0.2]} />

      {/* ── Sparkler particle effect (world-space) ── */}
      <SparklerEffect tipRef={sparklerTip} />

      {/* ── JJ Crackers Gift Box ── */}
      <JJGiftBox position={[2.4, 0, 1.4]} />

      {/* ── Fireworks ── */}
      <FireworkSystem />

      {/* ── Ambient particles ── */}
      <FloatingEmbers count={55} />
      <Sparkles count={35} scale={[9, 7, 7]} position={[0, 3.5, -1]} size={1.3} speed={0.35} color={GOLD} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION 11 — EXPORTED COMPONENT (Canvas + UI)
// ═══════════════════════════════════════════════════════════════

export function HeroScene3D() {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ background: '#0A0A08' }}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <FestiveScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
