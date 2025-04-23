'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '../../src/redux/postSlice';
import { postData } from '../hooks/useApi';
import CreatePost from './CreatePost';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
// import { useToggle } from '../hooks/useToggle';
import { logout } from '../../src/redux/authSlice';
const SidebarItem = ({
  icon,
  text,
  isActive,
  onClick,
  notificationCount,
}: {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
  notificationCount?: number;
}) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
  >
    {icon}
    <span>{text}</span>
    {notificationCount && notificationCount > 0 && (
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">
            {notificationCount}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            {notificationCount === 0 ? (
              <p>لا توجد إشعارات جديدة</p>
            ) : (
              // استبدلي بالبيانات الحقيقية للإشعارات
              <p>{notificationCount} إشعارات جديدة</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )}
  </div>
);

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const response = await postData<{ success: boolean; message: string }>(
        '/users/logout',
        { withCredentials: true},
      );
      if (response.success) {
        setSelectedPost(null);
        setPosts([]);
        router.push('/login');
        toast.success(response.message);
        dispatch(logout());
        
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'فشل تسجيل الخروج');
    }
  };

  const sidebarHandler = (text: string) => {
    switch (text) {
      case 'Logout':
        logoutHandler();
        break;
      case 'Create':
        setOpen(!open)
        break;
      case 'Profile':
        if (user?._id) router.push(`/profile/${user._id}`);
        break;
      case 'Home':
        router.push('/');
        break;
      case 'Messages':
        router.push('/chat');
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { icon: <Home className="w-6 h-6" />, text: 'Home' },
    { icon: <Search className="w-6 h-6" />, text: 'Search' },
    { icon: <TrendingUp className="w-6 h-6" />, text: 'Explore' },
    { icon: <MessageCircle className="w-6 h-6" />, text: 'Messages' },
    {
      icon: <Heart className="w-6 h-6" />,
      text: 'Notifications',
      // notificationCount: likeNotifications.length,
    },
    { icon: <PlusSquare className="w-6 h-6" />, text: 'Create' },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt={user?.username || 'User'} />
          <AvatarFallback>{user?.username?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    { icon: <LogOut className="w-6 h-6" />, text: 'Logout' },
  ];

  return (
    <div className="fixed top-0 left-0 px-4 border-r border-gray-300 border-solid w-64 h-screen bg-white">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <nav>
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              text={item.text}
              isActive={pathname === `/${item.text.toLowerCase()}` || (item.text === 'Profile' && pathname.startsWith('/profile'))}
              onClick={() => sidebarHandler(item.text)}
              notificationCount={item.notificationCount}
            />
          ))}
        </nav>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default Sidebar;