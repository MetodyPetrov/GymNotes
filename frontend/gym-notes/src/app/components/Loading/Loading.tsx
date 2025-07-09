'use client'

import { useEffect, useState, CSSProperties } from 'react';

export default function Loading({
  children,
  style
}: Readonly<{
  children: React.ReactNode;
  style?: CSSProperties;
}>) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span style={style}>
      {children}{dots}
    </span>
  );
}
