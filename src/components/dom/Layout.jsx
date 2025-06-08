'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { NavigationProvider } from '@/components/transitions/NavigationContext'
import { LayoutTransition } from '@/components/transitions/LayoutTransition'
import SwipeHandler from '@/components/transitions/SwipeHandler'
import DesktopNavigation from '@/components/navigation/DesktopNavigation'
import MobileNavigation from '@/components/navigation/MobileNavigation'

// Dynamic import for the 3D scene with a consistent key to prevent remounting
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
  const pathname = usePathname()
  const [renderKey] = useState('persistent-scene-key') // Keep the same key to prevent remounting

  // Prefetch all routes when the component mounts
  useEffect(() => {
    // Prefetch all main routes
    const routes = ['/', '/about', '/skills', '/projects', '/contact']
    
    // Create a link element for each route to trigger prefetching
    routes.forEach(route => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })
  }, [])

  return (
    <NavigationProvider>
      {/* 3D Background Canvas with a consistent key */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <Scene
          key={renderKey} // Keep the 3D scene mounted with a persistent key
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
      
      {/* Main content with transitions */}
      <SwipeHandler>
        <div
          ref={ref}
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            zIndex: 1,
            pointerEvents: 'auto',
          }}
        >
          <LayoutTransition
            exitDuration={1}   // Reduced for better performance
            entranceDelay={0.5} // Reduced for better performance
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