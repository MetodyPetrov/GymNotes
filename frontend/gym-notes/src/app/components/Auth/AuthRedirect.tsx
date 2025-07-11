'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loading from '../Loading/Loading';

export default function AuthRedirect({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/authenticate');
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [pathname]);

  if (!authorized && pathname !== '/authenticate') {
    return null;
  }

  return authorized === null ? <Loading>Authorizing</Loading> : <>{children}</>;
}
