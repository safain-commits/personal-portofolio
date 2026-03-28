import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Center, ContactShadows } from '@react-three/drei'
import { useTheme } from './theme-provider'

type RotationTuple = [number, number, number]
type PositionTuple = [number, number, number]

type ViewerThemeMode = 'light' | 'dark'
type ViewerPresetName = 'theme-adaptive' | 'soft-studio-grounded-light' | 'soft-studio-grounded-dark'
type ViewerRotationPresetName =
  | 'none'
  | 'x-positive-90'
  | 'x-negative-90'
  | 'y-positive-90'
  | 'y-negative-90'
  | 'z-positive-90'
  | 'z-negative-90'

type ViewerLightingPreset = {
  name: string
  background: string
  placeholderBackground: string
  hemisphereSky: string
  hemisphereGround: string
  hemisphereIntensity: number
  ambientIntensity: number
  keyLight: { position: PositionTuple; intensity: number; color: string }
  fillLight: { position: PositionTuple; intensity: number; color: string }
  rimLight: { position: PositionTuple; intensity: number; color: string }
  frontFillLight: { position: PositionTuple; intensity: number; color: string }
  shadow: { opacity: number; scale: number; blur: number; color: string }
  environmentIntensity: number
}

const SOFT_STUDIO_GROUNDED_PRESET: Record<ViewerThemeMode, ViewerLightingPreset> = {
  light: {
    name: 'soft-studio-grounded',
    background: '#E5E8EB',
    placeholderBackground: '#E5E8EB',
    hemisphereSky: '#f8fafc',
    hemisphereGround: '#d7dce1',
    hemisphereIntensity: 0.72,
    ambientIntensity: 0.3,
    keyLight: { position: [4.5, 6, 5], intensity: 0.56, color: '#f8fafc' },
    fillLight: { position: [-4, 2.5, 3], intensity: 0.28, color: '#e3e9ef' },
    rimLight: { position: [0, 3, -4], intensity: 0.16, color: '#f1f4f7' },
    frontFillLight: { position: [0, 1.8, 6], intensity: 0.16, color: '#ffffff' },
    shadow: { opacity: 0.11, scale: 8.7, blur: 4.3, color: '#4b5563' },
    environmentIntensity: 0.26,
  },
  dark: {
    name: 'soft-studio-grounded-dark',
    background: '#161a1f',
    placeholderBackground: '#161a1f',
    hemisphereSky: '#d9e1e8',
    hemisphereGround: '#2a3138',
    hemisphereIntensity: 0.5,
    ambientIntensity: 0.2,
    keyLight: { position: [4.5, 6, 5], intensity: 0.46, color: '#eef3f7' },
    fillLight: { position: [-4, 2.5, 3], intensity: 0.2, color: '#94a3b8' },
    rimLight: { position: [0, 3, -4], intensity: 0.18, color: '#cbd5e1' },
    frontFillLight: { position: [0, 1.8, 6], intensity: 0.12, color: '#f8fafc' },
    shadow: { opacity: 0.18, scale: 8.8, blur: 4.6, color: '#020617' },
    environmentIntensity: 0.22,
  },
}

const ROTATION_PRESET_MAP: Record<ViewerRotationPresetName, RotationTuple> = {
  none: [0, 0, 0],
  'x-positive-90': [Math.PI / 2, 0, 0],
  'x-negative-90': [-Math.PI / 2, 0, 0],
  'y-positive-90': [0, Math.PI / 2, 0],
  'y-negative-90': [0, -Math.PI / 2, 0],
  'z-positive-90': [0, 0, Math.PI / 2],
  'z-negative-90': [0, 0, -Math.PI / 2],
}

interface ModelProps {
  url: string
  rotation?: RotationTuple
}

interface ModelViewerProps {
  modelUrl: string
  viewerPreset?: ViewerPresetName | string
  viewerRotationPreset?: ViewerRotationPresetName | string
  viewerAutoRotate?: boolean
  viewerCameraDistance?: number | null
  viewerCameraHeight?: number | null
  viewerOffsetX?: number | null
  viewerOffsetY?: number | null
  modelRotation?: RotationTuple
  cameraPosition?: PositionTuple
  orbitTarget?: PositionTuple
  minDistance?: number
  maxDistance?: number
}

function addRotationTuple(a: RotationTuple, b: RotationTuple): RotationTuple {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

function Model({ url, rotation = [0, 0, 0] }: ModelProps) {
  const { scene } = useGLTF(url)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <Center>
      <group rotation={rotation}>
        <primitive object={clonedScene} />
      </group>
    </Center>
  )
}

export default function ModelViewer({
  modelUrl,
  viewerPreset = 'theme-adaptive',
  viewerRotationPreset = 'none',
  viewerAutoRotate = true,
  viewerCameraDistance,
  viewerCameraHeight,
  viewerOffsetX,
  viewerOffsetY,
  modelRotation,
  cameraPosition,
  orbitTarget,
  minDistance,
  maxDistance,
}: ModelViewerProps) {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<ViewerThemeMode>('light')

  useEffect(() => {
    const applyTheme = () => {
      const mode: ViewerThemeMode = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme
      setResolvedTheme(mode)
    }

    applyTheme()

    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => applyTheme()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }

    mediaQuery.addListener(listener)
    return () => mediaQuery.removeListener(listener)
  }, [theme])

  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true)
      setHasEnteredViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsNearViewport(visible)
        if (visible) setHasEnteredViewport(true)
      },
      {
        rootMargin: '320px 0px',
        threshold: 0.01,
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const preset = viewerPreset === 'soft-studio-grounded-dark'
    ? SOFT_STUDIO_GROUNDED_PRESET.dark
    : viewerPreset === 'soft-studio-grounded-light'
      ? SOFT_STUDIO_GROUNDED_PRESET.light
      : SOFT_STUDIO_GROUNDED_PRESET[resolvedTheme]

  const baseCameraPosition: PositionTuple = cameraPosition ?? [0, 1.6, 4.4]
  const effectiveCameraDistance = viewerCameraDistance ?? baseCameraPosition[2]
  const effectiveCameraHeight = viewerCameraHeight ?? baseCameraPosition[1]
  const effectiveCameraPosition: PositionTuple = [baseCameraPosition[0], effectiveCameraHeight, effectiveCameraDistance]
  const baseTarget: PositionTuple = orbitTarget ?? [0, 0.15, 0]
  const effectiveOrbitTarget: PositionTuple = [
    baseTarget[0] - (viewerOffsetX ?? 0),
    baseTarget[1] - (viewerOffsetY ?? 0),
    baseTarget[2],
  ]
  const presetRotation = ROTATION_PRESET_MAP[(viewerRotationPreset as ViewerRotationPresetName) || 'none'] || ROTATION_PRESET_MAP.none
  const effectiveRotation = addRotationTuple(presetRotation, modelRotation ?? [0, 0, 0])
  const effectiveMinDistance = minDistance ?? Math.max(0.9, effectiveCameraDistance * 0.4)
  const effectiveMaxDistance = maxDistance ?? Math.max(effectiveCameraDistance * 1.9, effectiveCameraDistance + 2.2)

  return (
    <div
      ref={containerRef}
      className="w-full aspect-video border relative overflow-hidden"
      style={{ minHeight: '400px' }}
      data-viewer-preset={preset.name}
      data-theme-mode={resolvedTheme}
    >
      {hasEnteredViewport ? (
        <Canvas
          dpr={[1, 1.4]}
          camera={{ position: effectiveCameraPosition, fov: 40 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={[preset.background]} />
          <hemisphereLight args={[preset.hemisphereSky, preset.hemisphereGround, preset.hemisphereIntensity]} />
          <ambientLight intensity={preset.ambientIntensity} />
          <directionalLight position={preset.keyLight.position} intensity={preset.keyLight.intensity} color={preset.keyLight.color} />
          <directionalLight position={preset.fillLight.position} intensity={preset.fillLight.intensity} color={preset.fillLight.color} />
          <directionalLight position={preset.rimLight.position} intensity={preset.rimLight.intensity} color={preset.rimLight.color} />
          <directionalLight position={preset.frontFillLight.position} intensity={preset.frontFillLight.intensity} color={preset.frontFillLight.color} />
          <Suspense fallback={null}>
            <Model url={modelUrl} rotation={effectiveRotation} />
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={preset.shadow.opacity}
              scale={preset.shadow.scale}
              blur={preset.shadow.blur}
              color={preset.shadow.color}
            />
            <Environment preset="studio" environmentIntensity={preset.environmentIntensity} />
          </Suspense>
          <OrbitControls
            autoRotate={viewerAutoRotate && isNearViewport}
            autoRotateSpeed={1.2}
            enableDamping
            enablePan={false}
            target={effectiveOrbitTarget}
            minDistance={effectiveMinDistance}
            maxDistance={effectiveMaxDistance}
          />
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-center px-6" style={{ backgroundColor: preset.placeholderBackground }}>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">3D viewer will load as you approach this section.</p>
            <p className="text-xs text-muted-foreground">Optimized to keep initial scrolling smoother.</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium tracking-widest uppercase text-muted-foreground">
        3D Interactive — Drag to rotate
      </div>
    </div>
  )
}
