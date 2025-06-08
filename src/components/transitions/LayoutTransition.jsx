"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSelectedLayoutSegment } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useEffect, useRef } from "react";

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
// This is key to preventing abrupt unmounting during navigation
function FrozenRouter({ children }) {
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
}

export function LayoutTransition({
  children,
  className,
  style,
  exitDuration = 1.5, // Customizable exit duration (seconds)
  entranceDelay = 1,  // Customizable delay before entrance animations (seconds)
}) {
  const segment = useSelectedLayoutSegment();
  
  // Default animation settings
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
          },
          enter: {
            duration: exitDuration,
            delay: entranceDelay, // Wait for exit + delay before animating in
          }
        }}
      >
        <FrozenRouter>
          {children}
        </FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}

// Element-specific transition component for animating individual elements
export function PageElement({
  children,
  className,
  style,
  exitOrder = 0, // Order in which this element exits (0 = first)
  entranceOrder = 0, // Order in which this element enters (0 = first)
  exitDuration = 0.5, // Duration of exit animation
  entranceDuration = 0.5, // Duration of entrance animation
  baseExitDelay = 0, // Base delay before exit animations start
  baseEntranceDelay = 2.5, // Base delay before entrance animations start (2.5s mark)
  variants, // Custom animation variants
  ...props
}) {
  // Default variants if none provided
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
          delay: baseExitDelay + (exitOrder * 0.1), // Stagger exit animations
        },
        enter: {
          duration: entranceDuration,
          delay: baseEntranceDelay + (entranceOrder * 0.1), // Stagger entrance animations
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}