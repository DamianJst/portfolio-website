// src/components/canvas/Scene.jsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'
import * as THREE from 'three'
import { Suspense } from 'react'
import SceneController from './SceneController'

export default function Scene({ ...props }) {
  return (
    <Canvas 
      {...props}
      gl={{ 
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      }}
      onCreated={(state) => {
        state.gl.toneMapping = THREE.ACESFilmicToneMapping
        state.gl.toneMappingExposure = 1.5
        state.gl.setClearColor('#000000', 1)
      }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
    >
      {/* All 3D content managed by SceneController */}
      <Suspense fallback={null}>
        <SceneController />
      </Suspense>
      
      {/* Portal for route-specific 3D content (optional) */}
      <r3f.Out />
      
      <Preload all />
    </Canvas>
  )
}