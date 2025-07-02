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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
        {pages.map(({ name, to }) => (
          <Link key={to} href={to}>
            <Button sx={{ my: 2, color: 'white', display: 'block', fontSize: 34, whiteSpace: 'nowrap', border: 'dashed 1px blue' }}>
              {name}
            </Button>
          </Link>
        ))}
      </Box>
    </AppBar>
  );
}
export default Navigation;
