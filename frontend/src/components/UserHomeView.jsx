import { useState } from "react";
import PublishVideoForm from "./PublishVideoForm";

function UserHomeView({
  users,
  currentUser,
  onLogout,
  onPublishVideo,
  userVideos,
  likedVideos,
  onSelectVideo,
  onBackHome,
}) {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("posts");

  const subscribersCount = currentUser?.subscribers?.length || 0;

  const subscribedChannels = users.filter((user) =>
    currentUser?.subscribedChannels?.includes(user.id)
  );

  const handlePublishVideo = (video) => {
    onPublishVideo(video);
    setIsPublishModalOpen(false);
  };

  const videosToShow = selectedTab === "posts" ? userVideos : likedVideos;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "24px 32px",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onBackHome}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 24,
            }}
          >
            ←
          </button>

          <h1
            style={{
              color: "#ff0000",
              margin: 0,
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            YouTube Fake
          </h1>
        </div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          style={{
            border: "none",
            background: "white",
            padding: "12px 20px",
            borderRadius: 24,
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          + Criar
        </button>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 32,
        }}
      >
        <aside
          style={{
            background: "white",
            borderRadius: 18,
            padding: 20,
            height: "fit-content",
            textAlign: "left",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Inscrições</h3>

          {subscribedChannels.length === 0 ? (
            <p style={{ color: "#666" }}>Nenhum canal inscrito.</p>
          ) : (
            <div>
              {subscribedChannels.map((channel, index) => (
                <div key={channel.id}>
                  <p style={{ margin: "12px 0" }}>
                    {channel.channelName}
                  </p>

                  {index !== subscribedChannels.length - 1 && (
                    <div
                      style={{
                        height: 1,
                        background: "#e0e0e0",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>

        <main>
          <section
            style={{
              background: "white",
              borderRadius: 24,
              padding: 32,
              textAlign: "left",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              marginBottom: 24,
            }}
          >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                }}
                >
                <h2
                    style={{
                    margin: 0,
                    fontSize: 32,
                    color: "#111",
                    }}
                >
                    {currentUser?.channelName}
                </h2>

                <button
                    onClick={onLogout}
                    style={{
                    border: "none",
                    background: "#f5f7fb",
                    padding: "10px 18px",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontWeight: "bold",
                    }}
                >
                    Trocar usuário
                </button>
            </div>

            <p
              style={{
                marginTop: 8,
                color: "#666",
                wordBreak: "break-all",
              }}
            >
              ID: {currentUser?.id} · {subscribersCount} inscritos
            </p>

            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 28,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <button
                onClick={() => setSelectedTab("posts")}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "0 0 12px",
                  cursor: "pointer",
                  fontWeight: selectedTab === "posts" ? "bold" : "normal",
                  borderBottom:
                    selectedTab === "posts"
                      ? "3px solid #111"
                      : "3px solid transparent",
                }}
              >
                Posts
              </button>

              <button
                onClick={() => setSelectedTab("playlists")}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "0 0 12px",
                  cursor: "pointer",
                  fontWeight: selectedTab === "playlists" ? "bold" : "normal",
                  borderBottom:
                    selectedTab === "playlists"
                      ? "3px solid #111"
                      : "3px solid transparent",
                }}
              >
                Playlists
              </button>

              <button
                onClick={() => setSelectedTab("liked")}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "0 0 12px",
                  cursor: "pointer",
                  fontWeight: selectedTab === "liked" ? "bold" : "normal",
                  borderBottom:
                    selectedTab === "liked"
                      ? "3px solid #111"
                      : "3px solid transparent",
                }}
              >
                Curtidos
              </button>
            </div>

            {selectedTab === "playlists" ? (
              <p style={{ marginTop: 24, color: "#666" }}>
                Nenhuma playlist criada ainda.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 18,
                  marginTop: 24,
                }}
              >
                {videosToShow.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => onSelectVideo(video)}
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      background: "#f5f7fb",
                      cursor: "pointer",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        background: "black",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                      }}
                    >
                      Thumbnail não disponível
                    </div>

                    <div style={{ padding: 12 }}>
                      <strong>{video.title}</strong>

                      <p
                        style={{
                          marginTop: 6,
                          color: "#666",
                          fontSize: 13,
                        }}
                      >
                        {video.channelName}
                      </p>

                      <p
                        style={{
                          marginTop: 6,
                          color: "#666",
                          fontSize: 13,
                        }}
                      >
                        👍 {video.likesCount || 0} · 👎{" "}
                        {video.dislikesCount || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {isPublishModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 24,
              borderRadius: 16,
              minWidth: 420,
            }}
          >
            <PublishVideoForm
                onPublish={handlePublishVideo}
                onClose={() => setIsPublishModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHomeView;