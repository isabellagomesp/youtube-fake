import { useEffect, useState } from "react";
import LoginView from "./components/LoginView";
import UserHomeView from "./components/UserHomeView";
import VideoPlayerView from "./components/VideoPlayerView";
import HomeView from "./components/HomeView";

import {
  getUsers,
  getAllVideos,
  getUserVideos,
  getUserLikedVideos,
  subscribeToChannel,
  publishUserVideo,
  likeVideo as likeVideoRequest,
  dislikeVideo as dislikeVideoRequest,
  createVideoComment as createVideoCommentRequest,
} from "./services/api";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userVideos, setUserVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [localVideoUrls, setLocalVideoUrls] = useState({});
  const [localThumbnailUrls, setLocalThumbnailUrls] = useState({});
  const [currentPage, setCurrentPage] = useState("home");
  const [allVideos, setAllVideos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const fetchUserVideos = async (userId) => {
    const data = await getUserVideos(userId);
    setUserVideos(data);
  };

  const fetchAllVideos = async () => {
    const data = await getAllVideos();
    setAllVideos(data);
  };

  const fetchLikedVideos = async (userId) => {
    const data = await getUserLikedVideos(userId);
    setLikedVideos(data);
  };

  const handleLogin = async (userId) => {
    setCurrentUserId(userId);
    setCurrentPage("home");
  
    await fetchUserVideos(userId);
    await fetchLikedVideos(userId);
    await fetchAllVideos();
  };

  const handleLogout = () => {
    setCurrentUserId("");
    setSelectedVideo(null);
    setCurrentPage("home");
  };

  const handleSubscribeToChannel = async (channelOwnerId) => {
    await subscribeToChannel(currentUserId, channelOwnerId);
    await fetchUsers();
  };

  const publishVideo = async (video) => {
    const data = await publishUserVideo(currentUserId, video);

    if (video.file) {
      const localUrl = URL.createObjectURL(video.file);

      setLocalVideoUrls((previous) => ({
        ...previous,
        [data.id]: localUrl,
      }));
    }

    if (video.thumbnailFile) {
      const localThumbnailUrl = URL.createObjectURL(video.thumbnailFile);

      setLocalThumbnailUrls((previous) => ({
        ...previous,
        [data.id]: localThumbnailUrl,
      }));
    }

    await fetchUsers();
    await fetchUserVideos(currentUserId);
    await fetchAllVideos();
  };

  const likeVideo = async (videoId) => {
    await likeVideoRequest(videoId, currentUserId);
    await fetchLikedVideos(currentUserId);
    await fetchUserVideos(currentUserId);

    const updatedVideos = await getAllVideos();
    const updatedVideo = updatedVideos.find((video) => video.id === videoId);

    setAllVideos(updatedVideos);

    if (updatedVideo) {
      setSelectedVideo({
        ...updatedVideo,
        localUrl: localVideoUrls[videoId],
        localThumbnailUrl: localThumbnailUrls[videoId],
      });
    }
  };

  const dislikeVideo = async (videoId) => {
    await dislikeVideoRequest(videoId, currentUserId);
    await fetchLikedVideos(currentUserId);
    await fetchUserVideos(currentUserId);

    const updatedVideos = await getAllVideos();
    const updatedVideo = updatedVideos.find((video) => video.id === videoId);

    setAllVideos(updatedVideos);

    if (updatedVideo) {
      setSelectedVideo({
        ...updatedVideo,
        localUrl: localVideoUrls[videoId],
        localThumbnailUrl: localThumbnailUrls[videoId],
      });
    }
  };

  const createVideoComment = async (videoId, text) => {
    await createVideoCommentRequest(videoId, currentUserId, text);

    const updatedVideos = await getAllVideos();
    const updatedVideo = updatedVideos.find((video) => video.id === videoId);

    setAllVideos(updatedVideos);

    if (updatedVideo) {
      setSelectedVideo({
        ...updatedVideo,
        localUrl: localVideoUrls[videoId],
        localThumbnailUrl: localThumbnailUrls[videoId],
      });
    }
  };

  const filteredVideos = allVideos.filter((video) => {
    const search = searchText.trim().toLowerCase();
  
    if (!search) {
      return true;
    }
  
    return (
      video.title?.toLowerCase().includes(search) ||
      video.description?.toLowerCase().includes(search) ||
      video.channelName?.toLowerCase().includes(search)
    );
  });

  const currentUser = users.find((user) => user.id === currentUserId);

  if (!currentUserId) {
    return <LoginView users={users} onLogin={handleLogin} />;
  }

  if (selectedVideo) {
    return (
      <VideoPlayerView
        video={selectedVideo}
        currentUser={currentUser}
        currentUserId={currentUserId}
        onBack={() => setSelectedVideo(null)}
        onSubscribe={handleSubscribeToChannel}
        onLikeVideo={likeVideo}
        onDislikeVideo={dislikeVideo}
        onCreateComment={createVideoComment}
      />
    );
  }

  if (currentPage === "home") {
    return (
      <HomeView
        currentUser={currentUser}
        currentUserId={currentUserId}
        videos={filteredVideos}
        searchText={searchText}
        onSearchChange={setSearchText}
        onOpenProfile={() => setCurrentPage("profile")}
        onSelectVideo={(video) => {
          setSelectedVideo({
            ...video,
            localUrl: localVideoUrls[video.id],
            localThumbnailUrl: localThumbnailUrls[video.id],
          });
        }}
        localThumbnailUrls={localThumbnailUrls}
      />
    );
  }

  return (
    <UserHomeView
      users={users}
      currentUser={currentUser}
      onLogout={handleLogout}
      onPublishVideo={publishVideo}
      userVideos={userVideos}
      likedVideos={likedVideos}
      onSelectVideo={(video) => {
        setSelectedVideo({
          ...video,
          localUrl: localVideoUrls[video.id],
          localThumbnailUrl: localThumbnailUrls[video.id],
        });
      }}
      onBackHome={() => setCurrentPage("home")}
    />
  );
}

export default App;