function HomeView({
    currentUser,
    videos,
    searchText,
    onSearchChange,
    onOpenProfile,
    onSelectVideo,
    localThumbnailUrls,
  }) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f6f8fc",
          padding: "24px 32px",
        }}
      >
        <header
            style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr 220px",
                alignItems: "center",
                gap: 32,
                marginBottom: 20,
            }}
            >
            <h1
                style={{
                color: "#ff0000",
                margin: 0,
                fontSize: 32,
                textAlign: "left",
                }}
            >
                YouTube Fake
            </h1>

            <input
                type="text"
                placeholder="Pesquisar vídeos"
                value={searchText}
                onChange={(event) => onSearchChange(event.target.value)}
                style={{
                width: "100%",
                maxWidth: 700,
                justifySelf: "center",
                padding: "12px 18px",
                borderRadius: 24,
                border: "1px solid #d3d7de",
                fontSize: 16,
                outline: "none",
                backgroundColor: "white",
                }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                onClick={onOpenProfile}
                style={{
                    border: "none",
                    backgroundColor: "white",
                    padding: "12px 18px",
                    borderRadius: 24,
                    cursor: "pointer",
                    fontWeight: "bold",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}
                >
                {currentUser?.channelName}
                </button>
            </div>
            </header>
  
        <div
          style={{
            height: 1,
            backgroundColor: "#d9dee7",
            marginBottom: 28,
          }}
        />
  
        <h2
          style={{
            marginBottom: 24,
            textAlign: "left",
            fontSize: 24,
          }}
        >
          Vídeos sugeridos
        </h2>
  
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                transition: "0.2s",
              }}
            >
              {localThumbnailUrls?.[video.id] ? (
                <img
                  src={localThumbnailUrls[video.id]}
                  alt={video.title}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    backgroundColor: "black",
                  }}
                />
              ) : (
                <div
                    style={{
                        width: "100%",
                        height: 220,
                        backgroundColor: "#d9d9d9",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                    }}
                    >
                    Thumbnail não disponível
                </div>
              )}
  
              <div style={{ padding: 16 }}>
                <h3
                  style={{
                    margin: 0,
                    marginBottom: 8,
                    fontSize: 18,
                    textAlign: "left",
                  }}
                >
                  {video.title}
                </h3>
  
                <p
                  style={{
                    margin: 0,
                    color: "#606060",
                    fontSize: 14,
                    textAlign: "left",
                    marginBottom: 12,
                  }}
                >
                  {video.channelName}
                </p>
  
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    color: "#606060",
                    fontSize: 14,
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