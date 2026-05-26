import { useState } from "react";

function PublishVideoForm({ onPublish }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !file) {
      alert("Preencha o título e selecione um arquivo.");
      return;
    }

    onPublish({
      title,
      description,
      fileName: file.name,
      file,
    });

    setTitle("");
    setDescription("");
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <h3>Publicar vídeo</h3>

      <input
        type="text"
        placeholder="Título do vídeo"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <br /><br />

      <input
        type="file"
        accept="video/*"
        onChange={(event) => {
          const selectedFile = event.target.files[0];
          setFile(selectedFile);
        }}
      />

      <br /><br />

      <button type="submit">Publicar</button>
    </form>
  );
}

export default PublishVideoForm;