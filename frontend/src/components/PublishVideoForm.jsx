import { useState } from "react";

function PublishVideoForm({ onPublish }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !fileName) {
      alert("Preencha o título e selecione um arquivo.");
      return;
    }

    onPublish({title, description, fileName,});

    setTitle("");
    setDescription("");
    setFileName("");
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
          const file = event.target.files[0];
          setFileName(file ? file.name : "");
        }}
      />

      <br /><br />

      <button type="submit">Publicar</button>
    </form>
  );
}

export default PublishVideoForm;