'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../src/redux/hooks';
import HomePage from '../src/components/HomePage';

export default function Home() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/signup');
    } else {
      setIsLoading(false);
    }
  }, [user , router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <HomePage />
    </div>
  );
}
