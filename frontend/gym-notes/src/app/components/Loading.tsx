'use client'

import { useEffect, useState } from 'react';

export default function Loading({ children }: Readonly<{ children: React.ReactNode }>) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      {children}{dots}
    </span>
  );
}
