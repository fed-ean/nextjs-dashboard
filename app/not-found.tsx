export default function NotFound() {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>404</h1>
        <p style={{ fontSize: "1.2rem" }}>Página no encontrada</p>
      </main>
    );
  }
  