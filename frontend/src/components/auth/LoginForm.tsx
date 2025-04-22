'use client';
import React, {useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAsync } from '../../hooks/useAsync';
import { postData } from '../../hooks/useApi';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAppDispatch } from '../../redux/hooks';
import { setAuthUser } from '@/src/redux/authSlice';

interface LoginFormData {
  email: string;
  password: string;
}

interface ApiResponse {
  message: string;
  success: boolean;
  user: {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    followers: string[];
    following: string[];
    posts: string[];
  };
}

const Login = () => {
  const [input, setInput] = useState<LoginFormData>({
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

  const wrappedPostData = (...args: unknown[]): Promise<ApiResponse> => {
    const endpoint = args[0] as string;
    const payload = args[1];
    return postData<ApiResponse>(endpoint, payload);
  };
  const { execute, loading } = useAsync<ApiResponse>(wrappedPostData);
  const router = useRouter();
 

  const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      try {
        const response = await execute('/users/login', input);
  
        if (response.success) {
          dispatch(setAuthUser(response.user));
          toast.success(response.message);
          setInput({
            email: '',
            password: '',
          });
          router.push('/');
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to log in');
      }
    };



  return (
    <div className="flex items-center w-screen h-screen justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="shadow-lg flex flex-col gap-5 p-8 w-[400px] bg-white rounded-lg">
        {/* Header */}
        <div className="my-4 text-center">
          <h1 className="font-bold text-xl">LOGO</h1>
          <p className="text-sm">Login to see photos & videos from your friends</p>
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
            'Login'
          )}
        </Button>

        <span className="text-center">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
