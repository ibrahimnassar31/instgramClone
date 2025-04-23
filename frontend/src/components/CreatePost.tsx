'use client';
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader2, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { postData } from '../hooks/useApi';
import { readFileAsDataURL } from '../lib/utils';
import { setPosts } from '../redux/postSlice';

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
  const dispatch = useAppDispatch();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setFile(selectedFile);
      try {
        const dataUrl = await readFileAsDataURL(selectedFile);
        setImagePreview(dataUrl);
      } catch (error) {
        toast.error('Failed to load image');
      }
    }
  };

  const resetForm = () => {
    setCaption('');
    setFile(null);
    setImagePreview('');
    setLoading(false);
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  const createPost = async () => {
    if (!caption && !file) {
      toast.error('Please add a caption or image');
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
        { withCredentials: true },
      );

      if (response.success) {
        dispatch(setPosts([response.post, ...posts]));
        toast.success('Post created successfully');
        setOpen(false);
        resetForm();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt={user?.username || 'User'} />
            <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
            <span className="text-gray-600 text-xs">{user?.bio || 'No bio yet'}</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none resize-none min-h-[100px]"
          placeholder="Write a caption..."
          maxLength={2200}
        />

        {imagePreview ? (
          <div className="relative w-full h-64">
            <img
              src={imagePreview}
              alt="Preview"
              className="object-cover h-full w-full rounded-md"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => {
                setFile(null);
                setImagePreview('');
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => imageRef.current?.click()}
            className="w-full h-64 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-transparent hover:bg-gray-50"
          >
            <ImagePlus className="h-6 w-6 mr-2" />
            Upload Image
          </Button>
        )}

        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          onClick={createPost}
          disabled={loading || (!caption && !file)}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating post...
            </>
          ) : (
            'Share Post'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;