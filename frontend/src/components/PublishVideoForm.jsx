import { useState } from "react";

function PublishVideoForm({ onPublish, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !file || !thumbnailFile) {
      alert("Preencha todos os campos.");
      return;
    }

    onPublish({
      title,
      description,
      fileName: file.name,
      thumbnailFileName: thumbnailFile.name,
      file,
      thumbnailFile,
    });

    setTitle("");
    setDescription("");
    setFile(null);
    setThumbnailFile(null);
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 24,
        width: 500,
        padding: 28,
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          border: "none",
          background: "transparent",
          fontSize: 22,
          cursor: "pointer",
          color: "#666",
        }}
      >
        ✕
      </button>

      <h2
        style={{
          marginTop: 0,
          marginBottom: 24,
          textAlign: "left",
          color: "#111",
        }}
      >
        Publicar vídeo
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <p
            style={{
              textAlign: "left",
              marginBottom: 8,
              fontWeight: "bold",
            }}
          >
            Título
          </p>

          <input
            type="text"
            placeholder="Digite o título do vídeo"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #d0d7de",
              fontSize: 15,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <p
            style={{
              textAlign: "left",
              marginBottom: 8,
              fontWeight: "bold",
            }}
          >
            Descrição
          </p>

          <textarea
            placeholder="Escreva uma descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "1px solid #d0d7de",
              fontSize: 15,
              resize: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <p
            style={{
              textAlign: "left",
              marginBottom: 8,
              fontWeight: "bold",
            }}
          >
            Thumbnail
          </p>

          <input
            type="file"
            accept="image/*"
            required
            onChange={(event) => {
              const selectedFile = event.target.files[0];
              setThumbnailFile(selectedFile);
            }}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <p
            style={{
              textAlign: "left",
              marginBottom: 8,
              fontWeight: "bold",
            }}
          >
            Arquivo de video
          </p>

          <input
            type="file"
            accept="video/*"
            required
            onChange={(event) => {
              const selectedFile = event.target.files[0];
              setFile(selectedFile);
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 999,
            border: "none",
            background: "#ff0000",
            color: "white",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Publicar vídeo
        </button>
      </form>
    </div>
  );
}

export default PublishVideoForm;