'use client'

import { useState } from 'react'
import styles from '@/styles/about.module.scss'

export default function ReadMoreSection({ children }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={styles.readMoreContainer}>
      {/* Content wrapper - always in DOM, CSS handles visibility */}
      <div 
        className={`${styles.expandableContent} ${isExpanded ? styles.expanded : ''}`}
      >
        {children}
      </div>
      
      {/* Button - CSS handles showing/hiding based on screen size */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.readMoreButton}
        aria-expanded={isExpanded}
      >
        {isExpanded ? 'Read less' : 'Read more'}
        <span className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}>
          ▼
        </span>
      </button>
    </div>
  )
}

// 'use client'

// import { useState, useEffect } from 'react'
// import styles from '@/styles/about.module.scss'

// export default function ReadMoreSection({ children }) {
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     // Check if we're on mobile
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 640)
//     }
    
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
    
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   // On desktop, always show content
//   if (!isMobile) {
//     return <>{children}</>
//   }

//   // On mobile, show expandable content
//   return (
//     <>
//       <div 
//         className={`${styles.expandableContent} ${isExpanded ? styles.expanded : ''}`}
//         aria-hidden={!isExpanded}
//       >
//         {children}
//       </div>
      
//       <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className={styles.readMoreButton}
//         aria-expanded={isExpanded}
//       >
//         {isExpanded ? 'Read less' : 'Read more'}
//         <span className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}>
//           ▼
//         </span>
//       </button>
//     </>
//   )
// }