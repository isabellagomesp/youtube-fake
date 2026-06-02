import { useState } from "react";

function VideoPlayerView({
    video,
    currentUser,
    currentUserId,
    onBack,
    onSubscribe,
    onLikeVideo,
    onDislikeVideo,
    onCreateComment,
  }) {
    const [commentText, setCommentText] = useState("");
    const isOwnVideo = video.ownerId === currentUser?.id;
  
    const isSubscribed =
      currentUser?.subscribedChannels?.includes(video.ownerId);

    const handleSubmitComment = async () => {
      const text = commentText.trim();

      if (!text) {
        return;
      }

      await onCreateComment(video.id, text);
      setCommentText("");
    };

    const formatCommentDate = (createdAt) => {
      if (!createdAt) {
        return "";
      }

      return new Date(createdAt).toLocaleString("pt-BR");
    };
  
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

          <div
            style={{
              marginTop: 20,
              background: "white",
              padding: 16,
              borderRadius: 14,
              textAlign: "left",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 14 }}>
              Comentarios
            </h3>

            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Escreva um comentario"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #d4d4d8",
                }}
              />

              <button
                onClick={handleSubmitComment}
                style={{
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 16px",
                  background: "#111",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Comentar
              </button>
            </div>

            {(video.comments || []).length === 0 ? (
              <p style={{ margin: 0, color: "#666" }}>
                Ainda nao ha comentarios neste video.
              </p>
            ) : (
              (video.comments || []).map((comment, index) => (
                <div
                  key={`${comment.userId}-${comment.createdAt}-${index}`}
                  style={{
                    borderTop: "1px solid #ececf1",
                    paddingTop: 10,
                    marginTop: 10,
                  }}
                >
                  <p style={{ margin: "0 0 4px" }}>
                    <strong>{comment.userName}</strong>: {comment.text}
                  </p>
                  <small style={{ color: "#666" }}>
                    {formatCommentDate(comment.createdAt)}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
  
  export default VideoPlayerView;