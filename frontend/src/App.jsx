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
  getUserPlaylists,
  createUserPlaylist,
  addVideoToPlaylist,
  viewVideo as viewVideoRequest,
} from "./services/api";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userVideos, setUserVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [localVideoUrls, setLocalVideoUrls] = useState({});
  const [currentPage, setCurrentPage] = useState("home");
  const [allVideos, setAllVideos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [likedVideos, setLikedVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [channelView, setChannelView] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

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

  const fetchPlaylists = async (userId) => {
    const data = await getUserPlaylists(userId);
    setPlaylists(Array.isArray(data) ? data : []);
  };

  const handleLogin = async (userId) => {
    setCurrentUserId(userId);
    setCurrentPage("home");
  
    await fetchUserVideos(userId);
    await fetchLikedVideos(userId);
    await fetchPlaylists(userId);
    await fetchAllVideos();
  };

  const handleLogout = () => {
    setCurrentUserId("");
    setSelectedVideo(null);
    setCurrentPage("home");
    setPlaylists([]);
  };

  const handleViewChannel = async (channelOwnerId) => {
    if (channelOwnerId === currentUserId) {
      setSelectedVideo(null);
      setCurrentPage("profile");
      return;
    }

    const channelUser = users.find((u) => u.id === channelOwnerId);
    const [videos, liked, playlists] = await Promise.all([
      getUserVideos(channelOwnerId),
      getUserLikedVideos(channelOwnerId),
      getUserPlaylists(channelOwnerId),
    ]);

    const visiblePlaylists = Array.isArray(playlists)
      ? playlists.filter((playlist) => playlist.visibility !== "private")
      : [];

    setChannelView({
      user: channelUser,
      videos: videos || [],
      likedVideos: liked || [],
      playlists: visiblePlaylists,
    });
    setSelectedVideo(null);
    setCurrentPage("channel");
  };

  const handleSubscribeToChannel = async (channelOwnerId) => {
    await subscribeToChannel(currentUserId, channelOwnerId);
    await fetchUsers();
  };

  const publishVideo = async (video) => {
    let thumbnailData = "";
    if (video.thumbnailFile) {
      thumbnailData = await toBase64(video.thumbnailFile);
    }

    const data = await publishUserVideo(currentUserId, { ...video, thumbnailData });

    if (video.file) {
      const localUrl = URL.createObjectURL(video.file);
      setLocalVideoUrls((previous) => ({
        ...previous,
        [data.id]: localUrl,
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
      });
    }
  };

  const handleCreatePlaylist = async (name, visibility) => {
    await createUserPlaylist(currentUserId, name, visibility);
    await fetchPlaylists(currentUserId);
  };

  const handleAddVideoToPlaylist = async (playlistId, videoId) => {
    await addVideoToPlaylist(currentUserId, playlistId, videoId);
    await fetchPlaylists(currentUserId);
  };

  const handleViewVideo = async (videoId) => {
    await viewVideoRequest(videoId);

    const updatedVideos = await getAllVideos();
    const updatedVideo = updatedVideos.find((video) => video.id === videoId);

    setAllVideos(updatedVideos);

    if (updatedVideo) {
      setSelectedVideo({
        ...updatedVideo,
        localUrl: localVideoUrls[videoId],
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
        playlists={playlists}
        onAddToPlaylist={handleAddVideoToPlaylist}
        onViewChannel={handleViewChannel}
        onViewVideo={handleViewVideo}
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
          });
        }}
      />
    );
  }

  if (currentPage === "channel" && channelView) {
    return (
      <UserHomeView
        users={users}
        currentUser={currentUser}
        channelOwner={channelView.user}
        isOwnChannel={false}
        onLogout={handleLogout}
        onPublishVideo={publishVideo}
        userVideos={channelView.videos}
        likedVideos={channelView.likedVideos}
        allVideos={allVideos}
        playlists={channelView.playlists}
        onCreatePlaylist={handleCreatePlaylist}
        onSelectVideo={(video) => {
          setSelectedVideo({
            ...video,
            localUrl: localVideoUrls[video.id],
                      });
        }}
        onBackHome={() => {
          setChannelView(null);
          setCurrentPage("home");
        }}
      />
    );
  }

  return (
    <UserHomeView
      users={users}
      currentUser={currentUser}
      channelOwner={currentUser}
      isOwnChannel={true}
      onLogout={handleLogout}
      onPublishVideo={publishVideo}
      userVideos={userVideos}
      likedVideos={likedVideos}
      allVideos={allVideos}
      playlists={playlists}
      onCreatePlaylist={handleCreatePlaylist}
      onSelectVideo={(video) => {
        setSelectedVideo({
          ...video,
          localUrl: localVideoUrls[video.id],
                  });
      }}
      onBackHome={() => setCurrentPage("home")}
    />
  );
}

export default App;