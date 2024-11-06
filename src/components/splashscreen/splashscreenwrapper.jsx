// components/SplashScreenWrapper.jsx
"use client";
import { useEffect } from 'react';
import SplashScreen from './page.jsx';
import useSplashScreen from '../splashscreen/usesplashscreen.js';

const SplashScreenWrapper = ({ children }) => {
  const { isVisible, hide } = useSplashScreen();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hide();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, hide]);

  if (isVisible) {
    return <SplashScreen />;
  }

  return children;
};

export default SplashScreenWrapper;