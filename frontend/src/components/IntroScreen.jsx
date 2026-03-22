import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './IntroScreen.css';

const IntroScreen = ({ onComplete }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showTwitter, setShowTwitter] = useState(false);
  const [exiting, setExiting] = useState(false);

  const fullTitle = "Twitter Sentiment Analysis";
  const subtitle = "AI-powered insights in real time";

  // Typing effect
  useEffect(() => {
    if (showTitle && typedText.length < fullTitle.length) {
      const timer = setTimeout(() => {
        setTypedText(fullTitle.slice(0, typedText.length + 1));
      }, 80);
      return () => clearTimeout(timer);
    } else if (typedText === fullTitle && !showSubtitle) {
      setTimeout(() => setShowSubtitle(true), 500);
    }
  }, [typedText, showTitle, fullTitle, showSubtitle]);

  // Animation timeline
  useEffect(() => {
    const timeline = [
      { delay: 1000, action: () => setShowTwitter(true) },
      { delay: 2500, action: () => setShowTitle(true) },
      { delay: 4500, action: () => setExiting(true) },
      { delay: 5500, action: () => onComplete() }
    ];

    const timers = timeline.map(({ delay, action }) => 
      setTimeout(action, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const phoneVariants = {
    initial: {
      scale: 0.5,
      rotateX: -15,
      rotateY: 15,
      opacity: 0,
      z: -100
    },
    animate: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      opacity: 1,
      z: 0,
      transition: {
        duration: 1.5,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  const twitterVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: [-10, 10],
      opacity: 1,
      transition: {
        y: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        },
        opacity: { duration: 0.8 }
      }
    }
  };

  const titleVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const subtitleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const exitVariants = {
    exit: {
      opacity: 0,
      filter: "blur(10px)",
      scale: 1.1,
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="intro-screen"
      variants={exitVariants}
      animate={exiting ? "exit" : "initial"}
    >
      <div className="intro-container">
        {/* Phone with 3D zoom effect */}
        <motion.div
          className="phone-container"
          variants={phoneVariants}
          initial="initial"
          animate="animate"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d"
          }}
        >
          <img 
            src="/phone.png" 
            alt="Phone" 
            className="phone-image"
            onError={(e) => {
              e.target.style.display = 'none';
              // Fallback to placeholder
              e.target.parentElement.innerHTML = `
                <div class="phone-placeholder">
                  <div class="phone-frame">
                    <div class="phone-screen"></div>
                  </div>
                </div>
              `;
            }}
          />
        </motion.div>

        {/* Twitter logo with floating animation */}
        <AnimatePresence>
          {showTwitter && (
            <motion.div
              className="twitter-container"
              variants={twitterVariants}
              initial="initial"
              animate="animate"
            >
              <img 
                src="/twitter.png" 
                alt="Twitter" 
                className="twitter-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  // Fallback to SVG
                  e.target.parentElement.innerHTML = `
                    <svg class="twitter-svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  `;
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title with typing effect and neon glow */}
        <AnimatePresence>
          {showTitle && (
            <motion.div
              className="title-container"
              variants={titleVariants}
              initial="initial"
              animate="animate"
            >
              <h1 className="intro-title neon-text">
                {typedText}
                <span className="cursor">|</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence>
          {showSubtitle && (
            <motion.div
              className="subtitle-container"
              variants={subtitleVariants}
              initial="initial"
              animate="animate"
            >
              <p className="intro-subtitle">{subtitle}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Parallax background elements */}
      <div className="parallax-bg">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
    </motion.div>
  );
};

export default IntroScreen;
