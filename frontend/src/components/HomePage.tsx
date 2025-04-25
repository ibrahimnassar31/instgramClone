import { useGetAllPosts } from "../hooks/useGetAllPosts";
import { useGetSuggestions } from "../hooks/useGetSuggestions";
import Feed from "./Feed";


const HomePage = () => {
 useGetAllPosts();
 useGetSuggestions();



  return (
    <div className="flex ">
       <div className="flex-grow">
        <Feed/>
       </div>
        
    </div>
  );    
};

export default HomePage;
