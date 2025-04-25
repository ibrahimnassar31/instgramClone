import { setSuggestedUsers } from "../redux/authSlice";
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
export const useGetSuggestions = () => {
  const dispatch = useAppDispatch();

  const getSuggestions = async () => {
    try {
      const response = await fetchData<{ users: Post[] }>("/users/suggestions");
      dispatch(setSuggestedUsers(response.users));
    } catch (error) {
      console.error(error);
    }
  };

  return getSuggestions;
};
