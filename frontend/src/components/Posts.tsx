import React from 'react'
import Post from './Post'
import { useAppSelector } from '../redux/hooks';

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
}
const Posts = () => {
  const {posts} = useAppSelector(store=>store.post);
  return (
    <div>
        {
            posts.map((post) => <Post key={post._id} post={post}/>)
        }
    </div>
  )
}

export default Posts