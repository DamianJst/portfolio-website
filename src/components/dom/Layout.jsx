// src/components/dom/Layout.jsx
'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import for the 3D scene
const Scene = dynamic(() => import('@/components/canvas/Scene'), { 
  ssr: false,
  loading: () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      zIndex: -1,
    }} />
  )
})

const Layout = ({ children }) => {
  const ref = useRef()

  return (
    <>
      {/* 3D Background Canvas - Explicitly behind everything */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1, // Explicitly behind
          pointerEvents: 'none',
        }}
      >
        <Scene
          style={{
            width: '100%',
            height: '100%',
          }}
          eventSource={ref}
          eventPrefix='client'
        />
      </div>
      
      {/* Main content - Explicitly in front */}
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          zIndex: 1, // Explicitly in front
          pointerEvents: 'auto',
        }}
      >
        {children}
      </div>
    </>
  )
}

export { Layout }