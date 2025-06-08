// src/components/3d/Humanoid.js
'use client'

import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import { LayerMaterial, Fresnel, Noise } from 'lamina'
import { useGLTF } from '@react-three/drei'

// Preload the model
useGLTF.preload('/model/Humanoid.glb')

const Humanoid = forwardRef(({ 
  position = [0, 0, 0], 
  scale = 1, 
  rotation = [0, Math.PI, 0],
  animateInternally = false, // Option to use internal animations
  ...props 
}, ref) => {
  const matRef = useRef()
  const meshRef = useRef()
  const matSpeedRef = useRef(0.008)
  
  // Expose mesh to parent via ref
  useImperativeHandle(ref, () => meshRef.current)
  
  // Load model with error boundary
  const { nodes } = useGLTF('/model/Humanoid.glb')
  
  // Find the main mesh geometry
  const geometry = useMemo(() => {
    const meshNode = Object.values(nodes).find(node => node.geometry)
    return meshNode?.geometry
  }, [nodes])
  
  // Animate material (always runs)
  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.offset.x += matSpeedRef.current
    }
    
    // Only run internal animations if enabled
    // if (animateInternally && meshRef.current) {
    //   const breathingScale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    //   meshRef.current.scale.setScalar(scale * breathingScale)
    //   meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    // }
  })
  
  if (!geometry) {
    console.warn('Humanoid geometry not found')
    return null
  }
  
  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      {...props}
    >
      <LayerMaterial
        color="#000000"
        lighting="physical"
      >
        <Noise
          ref={matRef}
          scale={2}
          alpha={1}
          colorA={[0, 0, 0]}
          colorB={[0, 0, 0]}
          colorD={[0, 0, 0]}
          colorC={[15, 1, 0]}
          type="perlin"
        />
        <Fresnel
          mode="softlight"
          color="#fefefe"
          intensity={2}
          power={2}
          bias={0}
          alpha={1}
          visible
        />
      </LayerMaterial>
    </mesh>
  )
})

Humanoid.displayName = 'Humanoid'

export default Humanoid