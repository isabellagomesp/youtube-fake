function VideoPlayerView({ video, onBack }) {
    return (
      <div style={{ padding: 32 }}>
        <button onClick={onBack}>Voltar</button>
  
        <h1>{video.title}</h1>
  
        {video.localUrl ? (
          <video
            src={video.localUrl}
            controls
            width="700"
            style={{ display: "block", marginBottom: 24 }}
          />
        ) : (
          <div
            style={{width: 700, height: 400, border: "1px solid gray", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,}}
          >
            Arquivo de vídeo não disponível nesta sessão
          </div>
        )}
  
        <p>
          <strong>Arquivo:</strong> {video.fileName}
        </p>
  
        <p>
          <strong>Descrição:</strong> {video.description}
        </p>
      </div>
    );
  }
  
  export default VideoPlayerView;