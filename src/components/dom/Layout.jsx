'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { NavigationProvider } from '@/components/transitions/NavigationContext'
import { LayoutTransition } from '@/components/transitions/LayoutTransition'
import SwipeHandler from '@/components/transitions/SwipeHandler'
import DesktopNavigation from '@/components/navigation/DesktopNavigation'
import MobileNavigation from '@/components/navigation/MobileNavigation'

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
    <NavigationProvider>
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
      
      {/* Navigation Components */}
      <DesktopNavigation />
      <MobileNavigation />
      
      {/* Main content with transitions - Explicitly in front */}
      <SwipeHandler>
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
          <LayoutTransition
            exitDuration={1.5}   // 1.5s for exit animations
            entranceDelay={1}    // 1s delay before entrance (starts at 2.5s mark)
          >
            {children}
          </LayoutTransition>
        </div>
      </SwipeHandler>
    </NavigationProvider>
  )
}

// Using the exact same export pattern as the original
export { Layout }