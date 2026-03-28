import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WireframeTorus({ position, rotation, scale, speed, color }: any) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * speed * 0.3
    ref.current.rotation.y += delta * speed * 0.2
  })
  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <torusGeometry args={[1, 0.35, 16, 40]} />
      <meshStandardMaterial color={color || "#e8762a"} wireframe transparent opacity={0.85} />
    </mesh>
  )
}

function WireframeBox({ position, rotation, scale, speed, color }: any) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * speed * 0.15
    ref.current.rotation.z += delta * speed * 0.25
  })
  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color || "#555555"} wireframe transparent opacity={0.6} />
    </mesh>
  )
}

function GearShape({ position, scale, speed }: any) {
  const ref = useRef<THREE.Mesh>(null!)
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    const teeth = 12
    const outerR = 1
    const toothHeight = 0.2
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2
      const a2 = ((i + 0.3) / teeth) * Math.PI * 2
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2
      const a4 = ((i + 0.8) / teeth) * Math.PI * 2
      if (i === 0) shape.moveTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR)
      shape.lineTo(Math.cos(a2) * (outerR + toothHeight), Math.sin(a2) * (outerR + toothHeight))
      shape.lineTo(Math.cos(a3) * (outerR + toothHeight), Math.sin(a3) * (outerR + toothHeight))
      shape.lineTo(Math.cos(a4) * outerR, Math.sin(a4) * outerR)
    }
    shape.closePath()
    const hole = new THREE.Path()
    hole.absellipse(0, 0, 0.6, 0.6, 0, Math.PI * 2, true, 0)
    shape.holes.push(hole)
    return new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false })
  }, [])

  useFrame((_, delta) => {
    ref.current.rotation.z += delta * speed * 0.4
  })

  return (
    <mesh ref={ref} position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial color="#999" wireframe transparent opacity={0.7} />
    </mesh>
  )
}

function SolidGear({ position, scale, speed }: any) {
  const ref = useRef<THREE.Mesh>(null!)
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    const teeth = 16
    const outerR = 1
    const toothHeight = 0.15
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2
      const a2 = ((i + 0.25) / teeth) * Math.PI * 2
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2
      const a4 = ((i + 0.75) / teeth) * Math.PI * 2
      if (i === 0) shape.moveTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR)
      shape.lineTo(Math.cos(a2) * (outerR + toothHeight), Math.sin(a2) * (outerR + toothHeight))
      shape.lineTo(Math.cos(a3) * (outerR + toothHeight), Math.sin(a3) * (outerR + toothHeight))
      shape.lineTo(Math.cos(a4) * outerR, Math.sin(a4) * outerR)
    }
    shape.closePath()
    const hole = new THREE.Path()
    hole.absellipse(0, 0, 0.5, 0.5, 0, Math.PI * 2, true, 0)
    shape.holes.push(hole)
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false })
  }, [])

  useFrame((_, delta) => {
    ref.current.rotation.z += delta * speed * 0.3
  })

  return (
    <mesh ref={ref} position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial color="#d47b2e" transparent opacity={0.25} side={THREE.DoubleSide} />
    </mesh>
  )
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null!)
  const [positions] = useMemo(() => {
    const pos = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return [pos]
  }, [])

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#888888" transparent opacity={0.6} />
    </points>
  )
}

function GridLines() {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    ref.current.rotation.x = -0.6
    ref.current.position.y += delta * 0.02
    if (ref.current.position.y > 0.5) ref.current.position.y = 0
  })
  return (
    <group ref={ref} position={[0, -3, -5]}>
      <gridHelper args={[30, 30, '#cccccc', '#e0e0e0']} />
    </group>
  )
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none" style={{ opacity: 0.7 }}>
      <Canvas
        camera={{ position: [0, 1, 10], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} />

        {/* Grid */}
        <GridLines />

        {/* Large gears - right side of screen */}
        <GearShape position={[5, 1, -1]} scale={1.5} speed={0.6} />
        <GearShape position={[3, -1.5, -2]} scale={1} speed={-0.8} />
        <SolidGear position={[-5, 2, -3]} scale={2} speed={0.3} />

        {/* Torus shapes */}
        <WireframeTorus position={[6, 3, -2]} rotation={[0.5, 0, 0]} scale={0.9} speed={0.5} color="#e8762a" />
        <WireframeTorus position={[-4, -1, -1]} rotation={[1, 0.5, 0]} scale={0.7} speed={-0.6} color="#d47b2e" />

        {/* Boxes */}
        <WireframeBox position={[7, -2, -3]} rotation={[0.3, 0.5, 0]} scale={1.2} speed={0.4} color="#444" />
        <WireframeBox position={[-6, 1, -2]} rotation={[0.7, 0.2, 0.4]} scale={0.9} speed={-0.5} color="#666" />
        <WireframeBox position={[-2, 3.5, -4]} rotation={[0.1, 0.8, 0]} scale={0.7} speed={0.6} color="#555" />

        {/* Particles */}
        <FloatingParticles />
      </Canvas>
    </div>
  )
}
