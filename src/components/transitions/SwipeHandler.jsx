"use client";

import { useRef, useEffect } from "react";
import { useGesture } from "@use-gesture/react";
import { useNavigation } from "./NavigationContext";

export default function SwipeHandler({ children, threshold = 50 }) {
  const containerRef = useRef(null);
  const { navigateNext, navigatePrevious, isFirstRoute, isLastRoute, isNavigating } = useNavigation();

  // Set up gesture handler
  const bind = useGesture(
    {
      onDrag: ({ movement: [mx, my], direction: [dx, dy], distance, cancel }) => {
        // Only handle vertical swipes and when not currently navigating
        if (Math.abs(my) > Math.abs(mx) && !isNavigating) {
          // Up swipe (negative my) = next page
          if (my < -threshold && dy < 0) {
            if (!isLastRoute) {
              cancel(); // Cancel the gesture
              navigateNext();
            }
          } 
          // Down swipe (positive my) = previous page
          else if (my > threshold && dy > 0) {
            if (!isFirstRoute) {
              cancel(); // Cancel the gesture
              navigatePrevious();
            }
          }
        }
      },
      // Optional - add some visual feedback during the drag
      onDragStart: () => {
        if (!isNavigating) {
          // Add visual feedback classes if needed
        }
      },
      onDragEnd: () => {
        // Remove visual feedback classes if needed
      }
    },
    {
      // Configure drag behavior
      drag: {
        filterTaps: true,
        threshold: 5,
        rubberband: true
      }
    }
  );

  // Handle wheel events for desktop scrolling navigation
  useEffect(() => {
    const handleWheel = (e) => {
      if (isNavigating) return;
      
      // Debounce wheel events (simple version)
      if (handleWheel.timeout) return;
      
      handleWheel.timeout = setTimeout(() => {
        handleWheel.timeout = null;
      }, 1000); // Match navigation timing
      
      // Scroll down = next page
      if (e.deltaY > 50) {
        if (!isLastRoute) {
          navigateNext();
        }
      } 
      // Scroll up = previous page
      else if (e.deltaY < -50) {
        if (!isFirstRoute) {
          navigatePrevious();
        }
      }
    };
    
    // Add wheel event listener
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel);
    }
    
    // Cleanup
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      if (handleWheel.timeout) {
        clearTimeout(handleWheel.timeout);
      }
    };
  }, [navigateNext, navigatePrevious, isFirstRoute, isLastRoute, isNavigating]);

  return (
    <div ref={containerRef} {...bind()} style={{ touchAction: "none", height: "100%" }}>
      {children}
    </div>
  );
}