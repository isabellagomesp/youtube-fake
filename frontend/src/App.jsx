import { useEffect, useState } from "react";
import LoginView from "./components/LoginView";
import UserHomeView from "./components/UserHomeView";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userVideos, setUserVideos] = useState([]);

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
    await fetch(`http://127.0.0.1:8000/users/${currentUserId}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(video),
    });
  
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

  return (
    <UserHomeView
      users={users}
      currentUser={currentUser}
      currentUserId={currentUserId}
      onLogout={handleLogout}
      onSubscribe={subscribeToChannel}
      onPublishVideo={publishVideo}
      userVideos={userVideos}
    />
  );
}

export default App;