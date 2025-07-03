'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';

type NavigationProps = {
  pfPage: string;
}

function Navigation({ pfPage } :NavigationProps) {
  const pages = [
    { name: 'My workouts', to: '/my-workouts' },
    { name: 'Explore', to: '/explore-workouts' },
    { name: 'Leaderboard', to: '/leaderboard' },
    { name: pfPage, to: '/' + pfPage.toLowerCase() }
  ];

  if(!localStorage.getItem('accessToken')) {
    pages[3].name = 'Sign in';
    pages[3].to = '/authenticate';
  } else {
    pages[3].name = 'Profile';
    pages[3].to = '/profile';
  }

  return (
    <AppBar sx={{ mt: 10, paddingTop: '35px', paddingBottom: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        {pages.map(({ name, to }) => (
          <Button key={name} sx={{ color: 'white', padding: '0px' }}>
            <Link key={to} href={to} style={{
                cursor: 'pointer',
                color: 'white',
                fontSize: 34,
                whiteSpace: 'nowrap',
                border: 'dashed 1px blue',
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
