function VideoPlayerView({ video, currentUser, onBack, onSubscribe }) {
    const isOwnVideo = video.ownerId === currentUser?.id;
  
    const isSubscribed =
      currentUser?.subscribedChannels?.includes(video.ownerId);
  
    return (
      <div style={{ padding: 32 }}>
        <button onClick={onBack}>Voltar</button>
  
        <div style={{ marginTop: 24 }}>
          {video.localUrl ? (
            <video
              src={video.localUrl}
              controls
              width="800"
              style={{
                display: "block",
                background: "black",
                marginBottom: 16,
              }}
            />
          ) : (
            <div
              style={{
                width: 800,
                height: 450,
                background: "black",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              Arquivo de vídeo não disponível nesta sessão
            </div>
          )}
  
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