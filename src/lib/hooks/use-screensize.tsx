'use client'

import { useState, useEffect } from 'react';

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);

  const handleResize = () => {
    setScreenSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize();
    }
  }, [loading]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoading(false);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return { screenSize, loading };
};