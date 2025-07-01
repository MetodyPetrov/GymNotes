'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';

const pages = [
  { name: 'My workouts', to: '/my-workouts' },
  { name: 'Explore', to: '/explore-workouts' },
  { name: 'Leaderboard', to: '/leaderboard' },
  { name: 'Profile', to: '/profile' }
];

function Navigation() {
  return (
    <AppBar sx={{ mt: 10 }}>
      <Box sx={{ width: '100vw', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
        {pages.map(({ name, to }) => (
          <Button key={name} sx={{ my: 2, color: 'white', display: 'block', fontSize: 34, whiteSpace: 'nowrap', border: 'dashed 1px blue' }}>
            <Link href={to}>
              {name}
            </Link>
          </Button>
        ))}
      </Box>
    </AppBar>
  );
}
export default Navigation;
