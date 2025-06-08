'use client'

import { useState } from 'react'

export default function ExpandableText({ children, buttonClassName, chevronClassName, expandedClassName, paragraphClassName }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {isExpanded && <p className={paragraphClassName}>{children}</p>}
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={buttonClassName}
      >
        {isExpanded ? 'Read less' : 'Read more'}
        <span className={`${chevronClassName} ${isExpanded ? expandedClassName : ''}`}>
          ▼
        </span>
      </button>
    </>
  )
}