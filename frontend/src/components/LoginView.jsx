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
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        style={{
          width: "900px",
          background: "white",
          borderRadius: 24,
          padding: 40,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <h1 style={{ color: "#ff0000", marginBottom: 32 }}>
            YouTube Fake
          </h1>

          <h2 style={{ marginBottom: 8 }}>
            Escolha uma conta
          </h2>

          <p style={{ color: "#666", marginBottom: 24 }}>
            Digite o ID do usuário para acessar o sistema.
          </p>

          <input
            type="text"
            placeholder="Cole o ID do usuário"
            value={inputUserId}
            onChange={(event) => setInputUserId(event.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              marginBottom: 16,
            }}
          />

          <button
            onClick={handleLogin}
            style={{
              padding: "10px 24px",
              borderRadius: 20,
              border: "none",
              background: "#ff0000",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Entrar
          </button>
        </div>

        <div style={{ textAlign: "left" }}>
          <h3 style={{ marginBottom: 20 }}>
            Usuários cadastrados
          </h3>

          <div>
            {users.map((user, index) => (
              <div key={user.id}>
                <div style={{ padding: "14px 0" }}>
                  <strong>{user.name}</strong>

                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#666",
                      fontSize: 13,
                      wordBreak: "break-all",
                    }}
                  >
                    ID: {user.id}
                  </p>
                </div>

                {index !== users.length - 1 && (
                  <div
                    style={{
                      height: 1,
                      background: "#e0e0e0",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginView;