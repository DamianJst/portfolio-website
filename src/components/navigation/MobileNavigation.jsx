"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../transitions/NavigationContext';
import styles from './MobileNavigation.module.scss';

export default function MobileNavigation() {
  const { currentRoute, navigateTo, isNavigating } = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define routes and their display names
  const routes = [
    { path: '/', label: 'HOME' },
    { path: '/about', label: 'ABOUT' },
    { path: '/skills', label: 'SKILLS' },
    { path: '/projects', label: 'PROJECT' },
    { path: '/contact', label: 'CONTACT' }
  ];

  const toggleMenu = () => {
    if (!isNavigating) {
      setMenuOpen(!menuOpen);
    }
  };

  const handleNavigation = (path) => {
    if (isNavigating) return;
    
    setMenuOpen(false);
    navigateTo(path);
  };

  // Animation variants
  const menuIconVariants = {
    closed: { opacity: 1 },
    open: { opacity: 1 }
  };

  const topBarVariants = {
    closed: { 
      rotate: 0, 
      translateY: 0,
      width: '100%'
    },
    open: { 
      rotate: 45, 
      translateY: 8,
      width: '100%'
    }
  };

  const bottomBarVariants = {
    closed: { 
      rotate: 0, 
      translateY: 0,
      width: '100%'
    },
    open: { 
      rotate: -45, 
      translateY: -8,
      width: '100%'
    }
  };

  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.5,
        when: 'afterChildren',
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
        staggerDirection: 1,
        delayChildren: 0.2
      }
    }
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: 20
    },
    open: {
      opacity: 1,
      x: 0
    }
  };

  const logoVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.2,
        duration: 0.5
      }
    }
  };

  // Return early if not mounted yet (prevents hydration issues)
  if (!mounted) return null;

  return (
    <header className={styles.header}>
      <motion.div 
        className={styles.container}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div className={styles.logoContainer} variants={logoVariants}>
          <svg
            className={styles.logo}
            viewBox="0 0 34 4"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.93,0.68H0.98V3.31H7.93C8.04,3.31 8.14,3.27 8.21,3.21C8.28,3.14 8.32,3.05 8.32,2.95V1.05C8.32,0.94 8.28,0.85 8.21,0.78C8.14,0.72 8.04,0.68 7.93,0.68Z"
              fill="white"
            />
            <path
              d="M16.32,1.15H9.37C9.26,1.15 9.17,1.19 9.1,1.26C9.03,1.32 8.99,1.42 8.99,1.52V2.47C8.99,2.58 9.03,2.67 9.1,2.74C9.17,2.8 9.26,2.84 9.37,2.84H16.32C16.43,2.84 16.52,2.8 16.59,2.74C16.66,2.67 16.7,2.58 16.7,2.47V1.52C16.7,1.42 16.66,1.32 16.59,1.26C16.52,1.19 16.43,1.15 16.32,1.15Z"
              fill="white"
            />
            <path
              d="M18.04,2.21L18.04,2.69L19.52,2.69C19.63,2.69 19.72,2.65 19.79,2.58C19.86,2.5 19.9,2.41 19.9,2.31L19.9,1.29L19.66,1.29L19.66,2.31C19.66,2.35 19.65,2.38 19.62,2.41C19.59,2.43 19.56,2.45 19.52,2.45L18.28,2.45L18.28,2.21L18.04,2.21Z"
              fill="white"
            />
            <path
              d="M25.22,2.84H22.15V0.68H21.9V2.84H20.42V3.08H25.22V2.84Z"
              fill="white"
            />
            <path
              d="M28.01,2.84L31.17,2.84L31.17,3.08L27.76,3.08C27.65,3.08 27.56,3.04 27.49,2.98C27.42,2.91 27.38,2.82 27.38,2.71L27.38,0.68L27.63,0.68L27.63,2.71C27.63,2.75 27.64,2.78 27.67,2.81C27.7,2.83 27.73,2.84 27.76,2.84L28.01,2.84Z"
              fill="white"
            />
            <path
              d="M33.02,0.68L31.54,0.68V3.08L31.78,3.08L31.78,1.4L33.02,1.4C33.13,1.4 33.22,1.36 33.29,1.3C33.36,1.23 33.4,1.14 33.4,1.04C33.4,0.93 33.36,0.84 33.29,0.77C33.22,0.71 33.13,0.68 33.02,0.68Z"
              fill="white"
            />
          </svg>
        </motion.div>

        {/* Menu Toggle Button */}
        <motion.div 
          className={styles.menuIcon}
          onClick={toggleMenu}
          variants={menuIconVariants}
          animate={menuOpen ? 'open' : 'closed'}
          initial="hidden"
          whileTap={{ scale: 0.95 }}
        >
          <div className={styles.menuIconBarContainer}>
            <motion.span 
              className={styles.topBar}
              variants={topBarVariants}
            />
            <motion.span 
              className={styles.bottomBar}
              variants={bottomBarVariants}
            />
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className={styles.mobileMenu}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <ul className={styles.menuItems}>
                {routes.map((route) => (
                  <motion.li 
                    key={route.path}
                    variants={menuItemVariants}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div 
                      className={`${styles.menuItem} ${currentRoute === route.path ? styles.active : ''}`}
                      onClick={() => handleNavigation(route.path)}
                    >
                      {route.label}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}