'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function Navigation() {
  const pathname = usePathname();
  const [pfPage, setPfPage] = useState<string>();
  const [pfUrl, setPfUrl] = useState<string>();

  const pages = [
    { name: 'My workouts', to: '/my-workouts' },
    { name: 'Explore', to: '/explore/users' },
    { name: 'Leaderboard', to: '/leaderboard' },
    { name: pfPage, to: pfUrl }
  ];

  useEffect(() => {
    if(!localStorage.getItem('accessToken')) {
      setPfPage('Sign in');
      setPfUrl('/authenticate');
    }
    else {
      setPfUrl('/profile/personal');
      setPfPage('Profile');
    }
  }, [pathname]);

  return (
    <AppBar sx={{ mt: 2, paddingTop: '20px', paddingBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        {pages.map(({ name, to }, index) => (
          <Button key={index} sx={{ color: 'white', padding: '0px', borderRadius: '15px' }}>
            <Link href={to || ''} style={{
                cursor: 'pointer',
                color: 'white',
                fontSize: 34,
                whiteSpace: 'nowrap',
                border: 'dashed 1px white',
                borderRadius: '15px',
                padding: '15px'
              }}
            >
                {name}
            </Link>
          </Button>
        ))}
      </Box>
    </AppBar>
  );
}
export default Navigation;
