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
        <div style={{ padding: 32 }}>
        <button onClick={onBack}>Voltar</button>
  
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              width: 800,
              aspectRatio: "16 / 9",
              background: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
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
            style={{marginBottom: 12,textAlign: "left",}}
            >
            {video.title}
            </h2>

            <p
            style={{marginTop: 0,marginBottom: 24,color: "gray",textAlign: "left",}}
            >
            {video.description}
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <button onClick={() => onLikeVideo(video.id)}>
                    {video.likedBy?.includes(currentUserId) ? "👍" : "👍🏻"} {video.likesCount || 0}
                </button>

                <button onClick={() => onDislikeVideo(video.id)}>
                    {video.dislikedBy?.includes(currentUserId) ? "👎" : "👎🏻"} {video.dislikesCount || 0}
                </button>
            </div>
  
          <div
            style={{
              border: "1px solid gray",
              padding: 16,
              marginTop: 24,
              width: 768,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{video.channelName}</strong>
              <p style={{ margin: 0 }}>Canal do vídeo</p>
            </div>
  
            {!isOwnVideo && (
              <button
                onClick={() => onSubscribe(video.ownerId)}
                disabled={isSubscribed}
              >
                {isSubscribed ? "Inscrito" : "Inscrever-se"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  export default VideoPlayerView;