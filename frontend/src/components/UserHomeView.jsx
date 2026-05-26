import ChannelCard from "./ChannelCard";
import PublishVideoForm from "./PublishVideoForm";

function UserHomeView({
    users,
    currentUser,
    currentUserId,
    onLogout,
    onSubscribe,
    onPublishVideo,
    userVideos,
}) {
  return (
    <div style={{ padding: 32 }}>
      <h1>YouTube Fake</h1>

      <div
        style={{
          border: "1px solid gray",
          padding: 16,
          marginBottom: 24,
        }}
      >
        <h2>Usuário logado</h2>

        <p>
          <strong>{currentUser?.name}</strong>
        </p>

        <p>{currentUser?.channelName}</p>

        <button onClick={onLogout}>
          Trocar usuário
        </button>

        <PublishVideoForm onPublish={onPublishVideo} />

        <h3>Vídeos publicados</h3>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {userVideos.map((video) => (
                <div
                key={video.id}
                style={{
                    border: "1px solid gray",
                    padding: 12,
                    minWidth: 160,
                }}
                >
                <strong>{video.title}</strong>

                <p>{video.fileName}</p>
                </div>
            ))}
        </div>
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