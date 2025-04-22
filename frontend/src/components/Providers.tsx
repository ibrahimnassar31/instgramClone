'use client';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '../redux/hooks';

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authPaths = ['/login', '/signup'];
    const isAuthPath = authPaths.includes(pathname);

    if (!user && !isAuthPath) {
      router.push('/login');
    } else if (user && isAuthPath) {
      router.push('/');
    }
    setIsLoading(false);
  }, [user, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const authPaths = ['/login', '/signup'];
  const shouldRenderContent = user || authPaths.includes(pathname);

  return shouldRenderContent ? <>{children}</> : null;
}