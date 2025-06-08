// src/components/canvas/SceneController.jsx - Working Version
'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import Humanoid from '@/components/3d/Humanoid'
import { EffectComposer, Scanline, Vignette, Bloom, Noise, Glitch, ToneMapping, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import { OrbitControls } from '@react-three/drei';
import Overlay from './Overlay';

export default function SceneController() {
  const humanoidRef = useRef()
  const { camera, gl } = useThree()
  
  // Fix camera on mount
  useEffect(() => {
    // Set camera position
    camera.position.set(-4.5, 4, 0)
    // Make camera look at the humanoid position
    camera.lookAt(0, 3.5, 0)
    camera.updateProjectionMatrix()
    
  }, [camera, gl])
  
  useFrame(() => {
    // Always look at humanoid
    camera.lookAt(0, 3.5, 0)
  })
  
  return (
    <>
<Overlay/>
<EffectComposer multisampling={2}>
				<Bloom
                    radius={0.4}
					mipmapBlur
					luminanceThreshold={0.3}
					luminanceSmoothing={0.4}
					intensity={1}
				/>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={[0.003, 0.003]} // color offset
        />
				<Noise
					premultiply
					blendFunction={BlendFunction.NORMAL}
					opacity={0.6}
				/>
                 <ToneMapping
                    blendFunction={BlendFunction.SCREEN} // blend mode
                    adaptive={true} // toggle adaptive luminance map usage
                    resolution={256} // texture resolution of the luminance map
                    middleGrey={0.5} // middle grey factor
                    maxLuminance={4.0} // maximum luminance
                    averageLuminance={1.0} // average luminance
                    adaptationRate={1.0} // luminance adaptation rate
                />
			</EffectComposer>
            <OrbitControls/>
      {/* Good lighting setup */}
      <ambientLight
				// distance={5}
				intensity={0.1}
				// position={[1.2, 4, 1.9]}
				// color={"#ffffff"}
			/>
      {/* <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.6} 
        castShadow 
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff6b6b" />
       */}
      {/* Adjusted fog - farther away */}
      {/* <fog attach="fog" args={['#000000', 15, 40]} /> */}
      
      {/* Main Humanoid */}
      <Humanoid 
        ref={humanoidRef}
        position={[0, 0, 0]} 
        // scale={2.5}
        // rotation={[0, Math.PI, 0]}
      />
      
      {/* Optional: Add a floor for reference */}
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -10]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#111111" />
      </mesh> */}
    </>
  )
}