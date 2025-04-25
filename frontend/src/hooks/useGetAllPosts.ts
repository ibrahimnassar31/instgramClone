import { setPosts } from "../redux/postSlice";
import { useAppDispatch } from "../redux/hooks";
import { fetchData } from "../hooks/useApi";


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
export const useGetAllPosts = () => {
  const dispatch = useAppDispatch();

  const getAllPosts = async () => {
    try {
      const response = await fetchData<{ posts: Post[] }>("/posts");
      dispatch(setPosts(response.posts));
      console.log(response.posts);
    } catch (error) {
      console.error(error);
    }
  };

  return getAllPosts;
};




