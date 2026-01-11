'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { OptimizedLink } from './ui/OptimizedLink';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';
import { Menu, X } from 'lucide-react';
import { InteractiveHoverButton } from './ui/interactive-hover-button';

export const Navbar: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scroll to hash after navigation to home page
  useEffect(() => {
    if (typeof window !== 'undefined' && pathname === '/') {
      const storedHash = sessionStorage.getItem('scrollToHash');
      const hash = storedHash || window.location.hash;

      if (hash) {
        if (storedHash) sessionStorage.removeItem('scrollToHash');

        const scrollToHash = () => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            window.history.replaceState(null, '', hash);
          }
        };

        requestAnimationFrame(() => {
          scrollToHash();
          setTimeout(scrollToHash, 100);
          setTimeout(scrollToHash, 300);
        });
      }
    }
  }, [pathname]);

  const links = [
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Influencers', href: '/influencers' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (pathname === '/') {
        const element = document.querySelector(href);
        if (element) element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        if (typeof window !== 'undefined') sessionStorage.setItem('scrollToHash', href);
        router.push('/');
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <div className={`pointer-events-auto relative flex items-center justify-between transition-all duration-700 ease-nav ${isScrolled
          ? "mt-4 sm:mt-6 w-[95%] max-w-4xl h-12 sm:h-14 px-3 sm:px-4 md:px-6 rounded-full bg-brand-dark/80 backdrop-blur-xl border border-brand-primary/20 shadow-xl shadow-black/20"
          : "mt-0 w-full max-w-7xl h-20 px-6 sm:px-8 bg-transparent border-transparent rounded-none"
          }`}>

          {/* Logo */}
          <OptimizedLink
            href="/"
            className="relative z-10 flex items-center gap-2.5 flex-shrink-0 group"
          >
            <img
              src="/favicon/logo.png"
              alt="OurCashmir Logo"
              className={`transition-all duration-700 object-contain ${isScrolled ? 'h-8 sm:h-9' : 'h-10 sm:h-12'}`}
            />
            <span className={`font-display font-bold tracking-tighter text-brand-white transition-all duration-700 ${isScrolled ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>
              OUR<span className="text-brand-primary group-hover:text-brand-white transition-colors">CASHMIR</span>
            </span>
          </OptimizedLink>

          {/* Center Links with Sliding Background - Desktop */}
          <div className={`hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-0.5 transition-all duration-500 ${!isScrolled && 'scale-105'}`}>
            {links.map((link, i) => {
              const isHashLink = link.href.startsWith('#');

              const linkContent = (
                <>
                  {hoveredIndex === i && (
                    <motion.div
                      layoutId="navbar-hover"
                      className="absolute inset-0 bg-brand-primary/10 rounded-full -z-10"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  {link.name}
                </>
              );

              const className = "relative px-3.5 sm:px-4 py-2 text-xs font-medium transition-colors duration-200 text-gray-400 hover:text-brand-primary whitespace-nowrap";

              if (isHashLink) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={className}
                  >
                    {linkContent}
                  </a>
                );
              } else {
                return (
                  <OptimizedLink
                    key={link.name}
                    href={link.href}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={className}
                  >
                    {linkContent}
                  </OptimizedLink>
                );
              }
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 relative z-10 ml-auto flex-shrink-0">
            {/* AnimatedThemeToggler removed */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center text-sm font-medium text-gray-400 hover:text-brand-white transition-colors mr-4"
            >
              Log in
            </Link>
            <InteractiveHoverButton
              onClick={() => {
                router.push('/login');
                setMobileMenuOpen(false);
              }}
              className="hidden sm:inline-flex items-center justify-center text-sm"
            >
              Start Project
            </InteractiveHoverButton>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface text-brand-white border border-brand-primary/20 ml-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Immersive Full Screen Design */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-brand-dark z-40 md:hidden flex flex-col justify-center items-center"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />

            <div className="flex flex-col gap-6 items-center z-10 w-full max-w-md px-6">
              {links.map((link, i) => {
                const isHashLink = link.href.startsWith('#');

                if (isHashLink) {
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + (i * 0.1),
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      onClick={(e) => {
                        handleLinkClick(e, link.href);
                        setMobileMenuOpen(false);
                      }}
                      className="text-4xl sm:text-5xl font-display font-bold text-brand-white hover:text-brand-primary transition-colors tracking-tight text-center"
                    >
                      {link.name}
                    </motion.a>
                  );
                } else {
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + (i * 0.1),
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      <OptimizedLink
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-4xl sm:text-5xl font-display font-bold text-brand-white hover:text-brand-primary transition-colors tracking-tight text-center block"
                      >
                        {link.name}
                      </OptimizedLink>
                    </motion.div>
                  );
                }
              })}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full mt-8"
              >
                <OptimizedLink
                  href="/login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                  className="w-full block py-4 text-center text-lg font-bold bg-brand-primary text-black rounded-full transition-transform active:scale-95"
                >
                  Start Project
                </OptimizedLink>
              </motion.div>
            </div>
            {/* Close button handled by main toggle in navbar which stays on top */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;