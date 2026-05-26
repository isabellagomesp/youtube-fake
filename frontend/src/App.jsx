import { useEffect, useState } from "react";
import LoginView from "./components/LoginView";
import UserHomeView from "./components/UserHomeView";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("http://127.0.0.1:8000/users");
    const data = await response.json();
    setUsers(data);
  };

  const handleLogin = (userId) => {
    setCurrentUserId(userId);
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
    />
  );
}

export default App;