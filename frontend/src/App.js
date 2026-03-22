import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import HashtagAnalyzer from './components/HashtagAnalyzer';
import SingleTweetAnalyzer from './components/SingleTweetAnalyzer';
import ParticleBackground from './components/ParticleBackground';
import { healthCheck, apiRoot } from './services/api';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('explore');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Test backend health and API root on app load
    healthCheck().then(response => {
      console.log('✅ Backend health check passed:', response);
    }).catch(error => {
      console.error('❌ Backend health check failed:', error);
    });
    
    apiRoot().then(response => {
      console.log('✅ Backend API root check passed:', response);
    }).catch(error => {
      console.error('❌ Backend API root check failed:', error);
    });
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app dashboard-layout">
      <ParticleBackground />
      
      {/* Cursor glow effect */}
      <div 
        className="cursor-glow"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
        }}
      />
  
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <motion.div 
          className="dashboard-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Floating orbs */}
          <div className="floating-orb orb-1" />
          <div className="floating-orb orb-2" />
          <div className="floating-orb orb-3" />

          {/* Content Area */}
          <div className="content-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="content-card"
              >
                {activeView === 'explore' ? <HashtagAnalyzer /> : <SingleTweetAnalyzer />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
      
      {/* Bottom decorative wave */}
      <div className="wave-container">
        <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path 
            d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
            fill="rgba(255,255,255,0.03)"
          >
            <animate 
              attributeName="d" 
              dur="10s" 
              repeatCount="indefinite"
              values="
                M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z;
                M0,60 C360,0 1080,120 1440,60 L1440,120 L0,120 Z;
                M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z
              "
            />
          </path>
        </svg>
      </div>
    </div>
  );
}

export default App;
