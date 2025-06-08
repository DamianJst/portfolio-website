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

// Layout transition component
export const LayoutTransition = memo(({
  children,
  className,
  style,
  exitDuration = 1,
  entranceDelay = 0.5,
}) => {
  const segment = useSelectedLayoutSegment();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className={className}
        style={style}
        key={segment}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
export const PageElement = memo(({
  children,
  className,
  style,
  exitOrder = 0,
  entranceOrder = 0,
  exitDuration = 0.3,
  entranceDuration = 0.3,
  baseExitDelay = 0,
  baseEntranceDelay = 1.5,
  variants,
  ...props
}) => {
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
          delay: baseExitDelay + (exitOrder * 0.08),
          ease: "easeInOut"
        },
        enter: {
          duration: entranceDuration,
          delay: baseEntranceDelay + (entranceOrder * 0.08),
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