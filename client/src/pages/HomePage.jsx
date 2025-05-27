import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, MessageCircleIcon } from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Friends Section */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
              <p className="text-base opacity-70 mt-1 hidden sm:block">Connect and chat with your friends</p>
            </div>
            <Link to="/notifications" className="btn bg-primary hover:bg-[#f3a62f]/90 text-white rounded-lg hidden sm:inline-flex">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
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
                <Link 
                  to={`/chat/${friend._id}`}
                  key={friend._id} 
                  className="card bg-base-200 transition-all duration-300 hover:bg-base-300 min-[540px]:hover:bg-base-200"
                >
                  <div className="card-body p-3 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="avatar size-16 rounded-full ring ring-[#f3a62f]/20">
                        <img src={friend.profilePic} alt={friend.fullName} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{friend.fullName}</h3>
                          <Link 
                            to={`/chat/${friend._id}`} 
                            className="btn bg-primary hover:bg-[#f3a62f]/90 text-white rounded-lg hidden min-[540px]:inline-flex sm:hidden"
                          >
                            <MessageCircleIcon className="size-6 mr-2" />
                            Message
                          </Link>
                        </div>
                        <div className="flex items-center text-sm opacity-70 mt-1 hidden sm:flex">
                          <span className="size-2 rounded-full bg-success inline-block mr-2" />
                          Online
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 hidden sm:flex">
                      <span className="badge badge-secondary">
                        {getLanguageFlag(friend.nativeLanguage)}
                        Native: {capitialize(friend.nativeLanguage)}
                      </span>
                      <span className="badge badge-outline">
                        {getLanguageFlag(friend.learningLanguage)}
                        Learning: {capitialize(friend.learningLanguage)}
                      </span>
                    </div>
                    <Link 
                      to={`/chat/${friend._id}`} 
                      className="btn bg-primary hover:bg-[#f3a62f]/90 text-white mt-4 rounded-lg hidden sm:inline-flex"
                    >
                      <MessageCircleIcon className="size-4 mr-2" />
                      Message
                    </Link>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recommended Users Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New People</h2>
            <p className="text-base opacity-70 mt-1 hidden sm:block">
            Find your people, share your passions, and create bonds that truly matter
            </p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new connections!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 transition-all duration-300"
                  >
                    <div className="card-body p-3 sm:p-6">
                      <div className="flex items-center gap-4">
                        <div className="avatar size-16 rounded-full ring ring-[#f3a62f]/20">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-sm opacity-70 mt-1">
                              <MapPinIcon className="size-4 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 hidden sm:flex">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70 mt-4 line-clamp-2">{user.bio}</p>
                      )}

                      <button
                        className={`btn w-full mt-4 rounded-lg ${
                          hasRequestBeenSent 
                            ? "btn-disabled" 
                            : "bg-primary hover:bg-[#f3a62f]/90 text-white"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
