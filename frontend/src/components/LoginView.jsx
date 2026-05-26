import { useState } from "react";

function LoginView({ users, onLogin }) {
    const [inputUserId, setInputUserId] = useState("");

    const handleLogin = () => {
        const cleanedUserId = inputUserId.trim().replaceAll('"', "");

        const userExists = users.find((user) => user.id === cleanedUserId);

        if (!userExists) {
            alert("Usuário não encontrado. Verifique se o ID está correto.");
            return;
        }

        onLogin(cleanedUserId);
    };

  return (
    <div style={{ padding: 32 }}>
      <h1>YouTube Fake</h1>

      <h2>Entrar como usuário</h2>

      <p>Digite o ID do usuário para acessar o sistema:</p>

      <input
        type="text"
        placeholder="Cole o ID do usuário"
        value={inputUserId}
        onChange={(event) => setInputUserId(event.target.value)}
        style={{width: "400px", padding: 8, marginRight: 8,}}
      />

      <button onClick={handleLogin}>
        Entrar
      </button>

      <h3 style={{ marginTop: 32 }}>Usuários cadastrados</h3>

      {users.map((user) => (
        <div
          key={user.id}
          style={{border: "1px solid gray", padding: 12,marginBottom: 12,}}
        >
          <strong>{user.name}</strong>
          <p>{user.channelName}</p>
          <small>ID: {user.id}</small>
        </div>
        ))}
    </div>
  );
}

export default LoginView;