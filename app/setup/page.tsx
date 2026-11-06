import { createInitialAdmin } from "./actions";

export default function SetupPage() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <form
        action={createInitialAdmin}
        style={{
          width: "400px",
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,.1)",
        }}
      >
        <h1>Initial Application Setup</h1>

        <p>Create the first administrator account.</p>

        <div style={{ marginTop: "1.5rem" }}>
          <label>Email</label>

          <input
            type="email"
            name="email"
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              marginBottom: "16px",
            }}
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            name="password"
            required
            minLength={8}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              marginBottom: "20px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Create Administrator
        </button>
      </form>
    </main>
  );
}