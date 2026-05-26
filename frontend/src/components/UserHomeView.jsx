import { useState } from "react";
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
  onSelectVideo,
}) {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const subscribersCount = currentUser?.subscribers?.length || 0;

  const subscribedChannels = users.filter((user) =>
    currentUser?.subscribedChannels?.includes(user.id)
  );

  const handlePublishVideo = (video) => {
    onPublishVideo(video);
    setIsPublishModalOpen(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>YouTube Fake</h1>

      <div style={{ border: "1px solid gray", padding: 24, marginBottom: 24 }}>
        <div
          style={{display: "flex", justifyContent: "space-between",alignItems: "flex-start", gap: 16, }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h2 style={{ margin: 0 }}>{currentUser?.channelName}</h2>

              <button onClick={onLogout}>
                Trocar usuário
              </button>
            </div>

            <p>
              <strong>{subscribersCount}</strong> inscritos
            </p>

            <div>
              <strong>Canais inscritos:</strong>

              {subscribedChannels.length === 0 ? (
                <p>Nenhum canal inscrito.</p>
              ) : (
                <ul style={{ paddingLeft: 20 }}>
                  {subscribedChannels.map((channel) => (
                    <li key={channel.id}>{channel.channelName}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button onClick={() => setIsPublishModalOpen(true)}>
            Publicar vídeo
          </button>
        </div>

        <h3 style={{ marginTop: 24 }}>Vídeos publicados</h3>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {userVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              style={{border: "1px solid gray", padding: 12, minWidth: 160, cursor: "pointer", }}
            >
              <strong>{video.title}</strong>
              <p>{video.fileName}</p>
            </div>
          ))}
        </div>
      </div>

      {isPublishModalOpen && (
        <div
          style={{position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.4)", display: "flex", alignItems: "center", justifyContent: "center",}}
        >
          <div
            style={{background: "white", padding: 24, borderRadius: 8, minWidth: 420, }}
          >
            <button onClick={() => setIsPublishModalOpen(false)}>
              Fechar
            </button>

            <PublishVideoForm onPublish={handlePublishVideo} />
          </div>
        </div>
      )}

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