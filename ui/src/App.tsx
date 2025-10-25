import { Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { HomePage } from "./routes/HomePage";
import { ProfilePage } from "./routes/ProfilePage";
import { CreatePage } from "./routes/CreatePage";
import { DashboardPage } from "./routes/DashboardPage";
import { NotFoundPage } from "./routes/NotFoundPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <Header />

      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "var(--spacing-xxl) var(--spacing-xl)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
