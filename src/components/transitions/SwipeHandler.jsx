"use client";

import { useRef, useEffect, memo } from "react";
import { useGesture } from "@use-gesture/react";
import { useNavigation } from "./NavigationContext";

// Memoize the SwipeHandler component to prevent unnecessary re-renders
const SwipeHandler = memo(({ children, threshold = 50 }) => {
  const containerRef = useRef(null);
  const { navigateNext, navigatePrevious, isFirstRoute, isLastRoute, isNavigating } = useNavigation();
  const wheelTimeoutRef = useRef(null);
  const lastWheelTime = useRef(0);

  // Set up gesture handler for touch/mobile
  const bind = useGesture(
    {
      onDrag: ({ movement: [mx, my], direction: [dx, dy], cancel }) => {
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
      
      // Throttle wheel events for better performance
      const now = performance.now();
      if (now - lastWheelTime.current < 1000) return; // 1 second throttle
      
      lastWheelTime.current = now;
      
      // Clear any existing timeout
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      
      // Scroll down = next page
      if (e.deltaY > 50) {
        if (!isLastRoute) {
          e.preventDefault(); // Prevent default scroll
          navigateNext();
        }
      } 
      // Scroll up = previous page
      else if (e.deltaY < -50) {
        if (!isFirstRoute) {
          e.preventDefault(); // Prevent default scroll
          navigatePrevious();
        }
      }
      
      // Set timeout to reset after animation completes
      wheelTimeoutRef.current = setTimeout(() => {
        wheelTimeoutRef.current = null;
      }, 1000);
    };
    
    // Add wheel event listener with passive: false to allow preventDefault
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    
    // Cleanup
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [navigateNext, navigatePrevious, isFirstRoute, isLastRoute, isNavigating]);

  return (
    <div 
      ref={containerRef} 
      {...bind()} 
      style={{ 
        touchAction: "none", 
        height: "100%",
        width: "100%"
      }}
    >
      {children}
    </div>
  );
});

SwipeHandler.displayName = 'SwipeHandler';

export default SwipeHandler;