import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import NoFriendsFound from "../components/NoFriendsFound";


const FriendsPage = () => {
  const { authUser } = useAuthUser();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <p className="text-base opacity-70 mt-1">Connect and chat with your friends</p>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <div key={friend._id} className="card bg-base-200 transition-all duration-300">
                <div className="card-body p-6">
                  <div className="flex items-center gap-4">
                    <div className="avatar size-16 rounded-full ring ring-primary/20">
                      <img src={friend.profilePic} alt={friend.fullName} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{friend.fullName}</h3>
                      <div className="flex items-center text-sm opacity-70 mt-1">
                        <span className="size-2 rounded-full bg-success inline-block mr-2" />
                        Online
                      </div>
                    </div>
                  </div>
              
                  <Link 
                    to={`/chat/${friend._id}`} 
                    className="btn bg-primary hover:bg-primary/90 text-white mt-4 rounded-lg"
                  >
                    <MessageCircleIcon className="size-4 mr-2" />
                    Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage; 