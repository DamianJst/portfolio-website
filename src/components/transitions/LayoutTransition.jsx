"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSelectedLayoutSegment } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useEffect, useRef, memo } from "react";

// Custom hook to track previous values
function usePreviousValue(value) {
  const prevValue = useRef();

  useEffect(() => {
    prevValue.current = value;
    return () => {
      prevValue.current = undefined;
    };
  });

  return prevValue.current;
}

// FrozenRouter preserves the router context during animations
// Memoized to prevent unnecessary re-renders
const FrozenRouter = memo(({ children }) => {
  const context = useContext(LayoutRouterContext);
  const prevContext = usePreviousValue(context) || null;

  const segment = useSelectedLayoutSegment();
  const prevSegment = usePreviousValue(segment);

  const changed = 
    segment !== prevSegment && 
    segment !== undefined && 
    prevSegment !== undefined;

  return (
    <LayoutRouterContext.Provider value={changed ? prevContext : context}>
      {children}
    </LayoutRouterContext.Provider>
  );
});

FrozenRouter.displayName = 'FrozenRouter';

// Memoized LayoutTransition component to prevent unnecessary re-renders
export const LayoutTransition = memo(({
  children,
  className,
  style,
  exitDuration = 1, // Reduced for better performance
  entranceDelay = 0.5, // Reduced for better performance
}) => {
  const segment = useSelectedLayoutSegment();
  
  // Simplified animation settings for better performance
  const initial = { opacity: 0 };
  const animate = { opacity: 1 };
  const exit = { opacity: 0 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className={className}
        style={style}
        key={segment}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{
          exit: {
            duration: exitDuration,
            ease: "easeInOut"
          },
          enter: {
            duration: exitDuration,
            delay: entranceDelay,
            ease: "easeInOut"
          }
        }}
      >
        <FrozenRouter>
          {children}
        </FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
});

LayoutTransition.displayName = 'LayoutTransition';

// Element-specific transition component for animating individual elements
// Memoized for better performance
export const PageElement = memo(({
  children,
  className,
  style,
  exitOrder = 0, // Order in which this element exits (0 = first)
  entranceOrder = 0, // Order in which this element enters (0 = first)
  exitDuration = 0.3, // Reduced for better performance
  entranceDuration = 0.3, // Reduced for better performance
  baseExitDelay = 0, // Base delay before exit animations start
  baseEntranceDelay = 1.5, // Base delay before entrance animations start
  variants, // Custom animation variants
  ...props
}) => {
  // Default variants if none provided - simplified for better performance
  const defaultVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const animationVariants = variants || defaultVariants;

  return (
    <motion.div
      className={className}
      style={style}
      variants={animationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        exit: {
          duration: exitDuration,
          delay: baseExitDelay + (exitOrder * 0.08), // Slightly reduced stagger
          ease: "easeInOut"
        },
        enter: {
          duration: entranceDuration,
          delay: baseEntranceDelay + (entranceOrder * 0.08), // Slightly reduced stagger
          ease: "easeInOut"
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

PageElement.displayName = 'PageElement';