"use client";

import { useRouter, usePathname } from "next/navigation";
import { createContext, useState, useContext, useCallback, useEffect } from "react";

// Define available routes in order
const ROUTES = [
  "/",                // home
  "/about",          // about
  "/skills",         // skills
  "/projects",       // projects
  "/contact"         // contact
];

// Create context
const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [direction, setDirection] = useState(null); // 'forward' or 'backward'
  
  // Get current route index
  const currentRouteIndex = ROUTES.indexOf(pathname);
  
  // Function to navigate to a specific route
  const navigateTo = useCallback((route) => {
    if (isNavigating) return; // Prevent multiple navigations
    
    const targetIndex = ROUTES.indexOf(route);
    const currentIndex = ROUTES.indexOf(pathname);
    
    // Set direction based on indices
    const newDirection = targetIndex > currentIndex ? "forward" : "backward";
    
    if (targetIndex !== currentIndex) {
      setIsNavigating(true);
      setDirection(newDirection);
      
      // Wait for exit animations to complete before changing route
      setTimeout(() => {
        router.push(route);
        
        // Reset navigation state after a short delay
        setTimeout(() => {
          setIsNavigating(false);
        }, 100);
      }, 1500); // Match exit animation duration
    }
  }, [router, pathname, isNavigating]);
  
  // Function to navigate to next route
  const navigateNext = useCallback(() => {
    if (isNavigating) return;
    
    const nextIndex = currentRouteIndex + 1;
    
    // Prevent going past the last route
    if (nextIndex < ROUTES.length) {
      navigateTo(ROUTES[nextIndex]);
    }
  }, [currentRouteIndex, navigateTo, isNavigating]);
  
  // Function to navigate to previous route
  const navigatePrevious = useCallback(() => {
    if (isNavigating) return;
    
    const prevIndex = currentRouteIndex - 1;
    
    // Prevent going before the first route
    if (prevIndex >= 0) {
      navigateTo(ROUTES[prevIndex]);
    }
  }, [currentRouteIndex, navigateTo, isNavigating]);
  
  // Check if we're at the first or last route
  const isFirstRoute = currentRouteIndex === 0;
  const isLastRoute = currentRouteIndex === ROUTES.length - 1;
  
  // Context value
  const value = {
    currentRoute: pathname,
    isNavigating,
    direction,
    navigateTo,
    navigateNext,
    navigatePrevious,
    isFirstRoute,
    isLastRoute,
    routes: ROUTES,
    currentRouteIndex
  };
  
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

// Custom hook to use the navigation context
export function useNavigation() {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  
  return context;
}