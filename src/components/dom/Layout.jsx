'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { NavigationProvider } from '@/components/transitions/NavigationContext'
import { LayoutTransition } from '@/components/transitions/LayoutTransition'
import SwipeHandler from '@/components/transitions/SwipeHandler'
import DesktopNavigation from '@/components/navigation/DesktopNavigation'
import MobileNavigation from '@/components/navigation/MobileNavigation'

// Keep using the original Scene with dynamic import
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

const Layout = ({ children }) => {
  const ref = useRef()

  return (
    <NavigationProvider>
      {/* Navigation Components */}
      <DesktopNavigation />
      <MobileNavigation />
      
      {/* Main content with transitions */}
      <SwipeHandler>
        {/* Keep the same div structure but wrap children in LayoutTransition */}
        <div
          ref={ref}
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            overflow: 'auto',
            touchAction: 'auto',
          }}
        >
          <LayoutTransition
            exitDuration={1}
            entranceDelay={0.5}
          >
            {children}
          </LayoutTransition>
        </div>
      </SwipeHandler>
      
      {/* Keep the original Scene component - this is key to the tunnel-rat pattern */}
      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        eventSource={ref}
        eventPrefix='client'
      />
    </NavigationProvider>
  )
}

export { Layout }