function HomeView({ currentUser, videos, onOpenProfile, onSelectVideo }) {
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
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default HomeView;