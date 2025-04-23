'use client';
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '../redux/hooks';
import { postData } from '../../src/hooks/useApi';
import { readFileAsDataURL } from '../lib/utils';



type Post = {
  _id: string;
  caption: string;
  image?: string;
  likes: string[];
  comments: {
    _id: string;
    user: {
      _id: string;
      username: string;
      profilePicture?: string;
    };
    comment: string;
    createdAt: string;
  }[];
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
};

interface CreatePostProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreatePost = ({ open, setOpen }: CreatePostProps) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const { posts } = useAppSelector((state) => state.post);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        const dataUrl = await readFileAsDataURL(selectedFile);
        setImagePreview(dataUrl);
      } catch (error) {
        toast.error('فشل تحميل الصورة');
      }
    }
  };

  const createPost = async () => {
    if (!caption && !file) {
      toast.error('يرجى إضافة تعليق أو صورة');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    if (file) formData.append('image', file);

    try {
      setLoading(true);
      const response = await postData<{ success: boolean; post: Post; message: string }>(
        '/posts',
        formData,
      );

      if (response.success) {
        setPosts([response.post, ...posts]);
        toast.success(response.message);
        setOpen(false);
        setCaption('');
        setFile(null);
        setImagePreview('');
      } else {
        toast.error('فشل إنشاء المنشور');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'فشل إنشاء المنشور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center font-semibold">إنشاء منشور جديد</DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt={user?.username || 'User'} />
            <AvatarFallback>{user?.username?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none resize-none"
          placeholder="اكتب تعليقاً..."
        />
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="معاينة الصورة"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          onClick={() => imageRef.current?.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          اختر من الجهاز
        </Button>
        {imagePreview && (
          <Button
            onClick={createPost}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جارٍ التحميل...
              </>
            ) : (
              'نشر'
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;