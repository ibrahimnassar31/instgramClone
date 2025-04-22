'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '../src/redux/hooks';

export default function Home() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push('/signup');
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to the Home Page!</h1>
    </div>
  );
}
