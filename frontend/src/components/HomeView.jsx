function HomeView({
    currentUser,
    currentUserId,
    videos,
    onOpenProfile,
    onSelectVideo,
    onLikeVideo,
    onDislikeVideo,
  }) {
    return (
      <div style={{ padding: 32 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <h1>YouTube Fake</h1>
  
          <button onClick={onOpenProfile}>
            {currentUser?.channelName}
          </button>
        </header>
  
        <h2>Vídeos sugeridos</h2>
  
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              style={{
                border: "1px solid gray",
                padding: 16,
                cursor: "pointer",
              }}
            >
              <h3>{video.title}</h3>
  
              <p>{video.description}</p>
  
              <p>
                <strong>{video.channelName}</strong>
              </p>
  
              <small>{video.fileName}</small>
  
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onLikeVideo(video.id);
                  }}
                >
                  {video.likedBy?.includes(currentUserId)
                    ? "👍"
                    : "👍🏻"}{" "}
                  {video.likesCount || 0}
                </button>
  
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onDislikeVideo(video.id);
                  }}
                >
                  {video.dislikedBy?.includes(currentUserId)
                    ? "👎"
                    : "👎🏻"}{" "}
                  {video.dislikesCount || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default HomeView;