import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  const currentUserId = "6a13a26e0a49fd252d75b9d1";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const subscribeToChannel = async (channelOwnerId) => {
    await fetch(
      `http://127.0.0.1:8000/users/${currentUserId}/subscribe/${channelOwnerId}`,
      {
        method: "POST",
      }
    );

    const response = await fetch("http://127.0.0.1:8000/users");
    const data = await response.json();

    setUsers(data);
  };

  const currentUser = users.find(
    (user) => user.id === currentUserId
  );

  return (
    <div style={{ padding: 32 }}>
      <h1>YouTube Fake</h1>

      <h2>Canais disponíveis</h2>

      {users
        .filter((user) => user.id !== currentUserId)
        .map((user) => {
          const isSubscribed =
            currentUser?.subscribedChannels?.includes(user.id);

          return (
            <div
              key={user.id}
              style={{border: "1px solid gray", padding: 16, marginBottom: 16,}}
            >
              <h3>{user.channelName}</h3>

              <p>Dono: {user.name}</p>

              <button
                onClick={() => subscribeToChannel(user.id)}
                disabled={isSubscribed}
              >
                {isSubscribed ? "Inscrito" : "Inscrever-se"}
              </button>
            </div>
          );
        })}
    </div>
  );
}

export default App;