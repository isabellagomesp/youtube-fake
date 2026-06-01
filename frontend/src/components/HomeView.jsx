import SearchBar from "./SearchBar";

function HomeView({
    currentUser,
    currentUserId,
    videos,
    searchText,
    onSearchChange,
    onOpenProfile,
    onSelectVideo
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

         <SearchBar
            searchText={searchText}
            onSearchChange={onSearchChange}
        />

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
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 12,
                        color: "gray",
                    }}
                >
                    <span>👍 {video.likesCount || 0}</span>
                    <span>👎 {video.dislikesCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default HomeView;