import ChannelCard from "./ChannelCard";

function UserHomeView({
  users,
  currentUser,
  currentUserId,
  onLogout,
  onSubscribe,
}) {
  return (
    <div style={{ padding: 32 }}>
      <h1>YouTube Fake</h1>

      <div
        style={{border: "1px solid gray", padding: 16,marginBottom: 24,}}
      >
        <h2>Usuário logado</h2>

        <p>
          <strong>{currentUser?.name}</strong>
        </p>

        <p>{currentUser?.channelName}</p>

        <button onClick={onLogout}>
          Trocar usuário
        </button>
      </div>

      <h2>Canais disponíveis</h2>

      {users
        .filter((user) => user.id !== currentUserId)
        .map((user) => {
          const isSubscribed =
            currentUser?.subscribedChannels?.includes(user.id);

          return (
            <ChannelCard
              key={user.id}
              user={user}
              isSubscribed={isSubscribed}
              onSubscribe={onSubscribe}
            />
          );
        })}
    </div>
  );
}

export default UserHomeView;