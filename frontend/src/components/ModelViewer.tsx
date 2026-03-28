import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Center, ContactShadows } from '@react-three/drei'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}

export default function ModelViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="w-full aspect-video bg-gradient-to-b from-muted/50 to-muted border relative overflow-hidden" style={{ minHeight: '400px' }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        /* Soften the base lighting to avoid blowing out the white colors */
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.15} />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={1.5}
          enablePan={false}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
      <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium tracking-widest uppercase text-muted-foreground">
        3D Interactive — Drag to rotate
      </div>
    </div>
  )
}
