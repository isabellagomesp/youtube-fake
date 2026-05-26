import { useEffect, useState } from "react";
import LoginView from "./components/LoginView";
import UserHomeView from "./components/UserHomeView";
import VideoPlayerView from "./components/VideoPlayerView";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userVideos, setUserVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [localVideoUrls, setLocalVideoUrls] = useState({});

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

  const handleLogin = async (userId) => {
    setCurrentUserId(userId);
  
    await fetchUserVideos(userId);
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
        onBack={() => setSelectedVideo(null)}
      />
    );
  }

  return (
    <UserHomeView
      users={users}
      currentUser={currentUser}
      currentUserId={currentUserId}
      onLogout={handleLogout}
      onSubscribe={subscribeToChannel}
      onPublishVideo={publishVideo}
      userVideos={userVideos}
      onSelectVideo={(video) => {
        setSelectedVideo({
          ...video,
          localUrl: localVideoUrls[video.id],
        });
      }}
    />
  );
}

export default App;