"use client";

import { useRouter, usePathname } from "next/navigation";
import { createContext, useState, useContext, useCallback, useEffect, useMemo } from "react";

// Define available routes in order
const ROUTES = [
  "/",           // home
  "/about",      // about
  "/skills",     // skills
  "/projects",   // projects
  "/contact"     // contact
];

// Create context
const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [direction, setDirection] = useState(null); // 'forward' or 'backward'
  
  // Get current route index - memoized to prevent unnecessary recalculations
  const currentRouteIndex = useMemo(() => ROUTES.indexOf(pathname), [pathname]);
  
  // Prefetch all routes on component mount
  useEffect(() => {
    // Programmatically prefetch each route
    ROUTES.forEach(route => {
      // Skip current route
      if (route === pathname) return;
      router.prefetch(route);
    });
  }, [pathname, router]);
  
  // Function to navigate to a specific route
  const navigateTo = useCallback((route) => {
    if (isNavigating) return; // Prevent multiple navigations
    
    const targetIndex = ROUTES.indexOf(route);
    const currentIndex = currentRouteIndex;
    
    // Don't navigate if we're already on the target route
    if (targetIndex === currentIndex) return;
    
    // Set direction based on indices
    const newDirection = targetIndex > currentIndex ? "forward" : "backward";
    
    setIsNavigating(true);
    setDirection(newDirection);
    
    // Use a timeout matching the exit duration
    setTimeout(() => {
      router.push(route);
      
      // Reset navigation state after a short delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 100);
    }, 1000); // Match exit animation duration
  }, [router, currentRouteIndex, isNavigating]);
  
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
  
  // Check if we're at the first or last route - memoized to prevent unnecessary recalculations
  const isFirstRoute = useMemo(() => currentRouteIndex === 0, [currentRouteIndex]);
  const isLastRoute = useMemo(() => currentRouteIndex === ROUTES.length - 1, [currentRouteIndex]);
  
  // Context value - memoized to prevent unnecessary re-renders
  const value = useMemo(() => ({
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
  }), [
    pathname, 
    isNavigating, 
    direction, 
    navigateTo, 
    navigateNext, 
    navigatePrevious, 
    isFirstRoute, 
    isLastRoute, 
    currentRouteIndex
  ]);
  
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