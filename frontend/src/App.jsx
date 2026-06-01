import { useEffect, useState } from "react";
import LoginView from "./components/LoginView";
import UserHomeView from "./components/UserHomeView";
import VideoPlayerView from "./components/VideoPlayerView";
import HomeView from "./components/HomeView";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userVideos, setUserVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [localVideoUrls, setLocalVideoUrls] = useState({});
  const [currentPage, setCurrentPage] = useState("home");
  const [allVideos, setAllVideos] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("http://127.0.0.1:8000/users");
    const data = await response.json();
    setUsers(data);
  };

  const fetchUserVideos = async (userId) => {
    const response = await fetch(
      `http://127.0.0.1:8000/users/${userId}/videos`
    );
  
    const data = await response.json();
  
    setUserVideos(data);
  };

  const fetchAllVideos = async () => {
    const response = await fetch("http://127.0.0.1:8000/videos");
    const data = await response.json();
    setAllVideos(data);
  };

  const handleLogin = async (userId) => {
    setCurrentUserId(userId);
    setCurrentPage("home");
  
    await fetchUserVideos(userId);
    await fetchAllVideos();
  };

  const handleLogout = () => {
    setCurrentUserId("");
  };

  const subscribeToChannel = async (channelOwnerId) => {
    await fetch(
      `http://127.0.0.1:8000/users/${currentUserId}/subscribe/${channelOwnerId}`,
      {
        method: "POST",
      }
    );

    await fetchUsers();
  };

  const publishVideo = async (video) => {
    const response = await fetch(`http://127.0.0.1:8000/users/${currentUserId}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: video.title,
        description: video.description,
        fileName: video.fileName,
      }),
    });
  
    const data = await response.json();
  
    const localUrl = URL.createObjectURL(video.file);
  
    setLocalVideoUrls((previous) => ({
      ...previous,
      [data.id]: localUrl,
    }));
  
    await fetchUsers();
    await fetchUserVideos(currentUserId);
    await fetchAllVideos();
  };

  const likeVideo = async (videoId) => {
    await fetch(`http://127.0.0.1:8000/videos/${videoId}/like/${currentUserId}`, {
      method: "POST",
    });
  
    await fetchAllVideos();
    await fetchUserVideos(currentUserId);
  };
  
  const dislikeVideo = async (videoId) => {
    await fetch(`http://127.0.0.1:8000/videos/${videoId}/dislike/${currentUserId}`, {
      method: "POST",
    });
  
    await fetchAllVideos();
    await fetchUserVideos(currentUserId);
  };

  const currentUser = users.find((user) => user.id === currentUserId);

  if (!currentUserId) {
    return (
      <LoginView
        users={users}
        onLogin={handleLogin}
      />
    );
  }

  if (selectedVideo) {
    return (
      <VideoPlayerView
        video={selectedVideo}
        currentUser={currentUser}
        currentUserId={currentUserId}
        onBack={() => setSelectedVideo(null)}
        onSubscribe={subscribeToChannel}
        onLikeVideo={likeVideo}
        onDislikeVideo={dislikeVideo}
      />
    );
  }

  if (currentPage === "home") {
    return (
      <HomeView
        currentUser={currentUser}
        currentUserId={currentUserId}
        videos={allVideos}
        onOpenProfile={() => setCurrentPage("profile")}
        onSelectVideo={(video) => {
          setSelectedVideo({
            ...video,
            localUrl: localVideoUrls[video.id],
          });
        }}
        onLikeVideo={likeVideo}
        onDislikeVideo={dislikeVideo}
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