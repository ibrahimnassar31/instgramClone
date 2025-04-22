'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAsync } from '../../hooks/useAsync';
import { postData } from '../../hooks/useApi';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

interface ApiResponse {
  message: string;
  success: boolean;
}

const Signup = () => {
  const [input, setInput] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const wrappedPostData = (...args: unknown[]) => postData<ApiResponse>(args[0] as string, args[1]);
  const { execute, loading } = useAsync<ApiResponse>(wrappedPostData);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await execute('/users/register', input);
      
      if (response.success) {
        toast.success(response.message);
        setInput({
          username: '',
          email: '',
          password: '',
        });
        router.push('/login');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="shadow-lg flex flex-col gap-5 p-8 w-[400px] bg-white rounded-lg">
        {/* Header */}
        <div className="my-4 text-center">
          <h1 className="font-bold text-xl">LOGO</h1>
          <p className="text-sm">Signup to see photos & videos from your friends</p>
        </div>

        <div>
          <span className="font-medium">Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={handleChange}
            className="focus-visible:ring-transparent my-2"
            required
          />
        </div>

        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={handleChange}
            className="focus-visible:ring-transparent my-2"
            required
          />
        </div>

        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={handleChange}
            className="focus-visible:ring-transparent my-2"
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'Signup'
          )}
        </Button>

        <span className="text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;