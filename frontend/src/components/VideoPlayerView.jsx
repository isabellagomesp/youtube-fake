function VideoPlayerView({
    video,
    currentUser,
    currentUserId,
    onBack,
    onSubscribe,
    onLikeVideo,
    onDislikeVideo,
  }) {
    const isOwnVideo = video.ownerId === currentUser?.id;
  
    const isSubscribed =
      currentUser?.subscribedChannels?.includes(video.ownerId);
  
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
            gap: 16,
            marginBottom: 24,
          }}
        >
          <button
            onClick={onBack}
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
        </header>
  
        <div style={{ maxWidth: 1000 }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              background: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              borderRadius: 18,
              overflow: "hidden",
            }}
          >
            {video.localUrl ? (
              <video
                src={video.localUrl}
                controls
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <p style={{ color: "white" }}>
                Arquivo de vídeo não disponível nesta sessão
              </p>
            )}
          </div>
  
          <h2
            style={{
              margin: "0 0 16px",
              textAlign: "left",
              fontSize: 24,
              color: "#111",
            }}
          >
            {video.title}
          </h2>
  
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <strong style={{ fontSize: 16 }}>
              {video.channelName}
            </strong>
  
            {!isOwnVideo && (
              <button
                onClick={() => onSubscribe(video.ownerId)}
                style={{
                  border: "none",
                  borderRadius: 20,
                  padding: "10px 18px",
                  background: isSubscribed ? "#e5e5e5" : "#111",
                  color: isSubscribed ? "#555" : "white",
                  cursor: isSubscribed ? "pointer" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {isSubscribed ? "Inscrito" : "Inscrever-se"}
              </button>
            )}
  
            <div style={{ flex: 1 }} />
  
            <button
              onClick={() => onLikeVideo(video.id)}
              style={{
                border: "none",
                borderRadius: 20,
                padding: "10px 16px",
                background: video.likedBy?.includes(currentUserId)
                  ? "#dbeafe"
                  : "white",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              👍 {video.likesCount || 0}
            </button>
  
            <button
              onClick={() => onDislikeVideo(video.id)}
              style={{
                border: "none",
                borderRadius: 20,
                padding: "10px 16px",
                background: video.dislikedBy?.includes(currentUserId)
                  ? "#fee2e2"
                  : "white",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              👎 {video.dislikesCount || 0}
            </button>
          </div>
  
          <div
            style={{
              background: "#e9edf5",
              padding: 16,
              borderRadius: 14,
              textAlign: "left",
              color: "#222",
            }}
          >
            <strong>Descrição</strong>
  
            <p style={{ marginTop: 8 }}>
              {video.description || "Sem descrição."}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  export default VideoPlayerView;