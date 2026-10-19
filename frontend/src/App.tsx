import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ProjectsPage from "./pages/ProjectsPage";
import ClinicsPage from "./pages/ClinicsPage";
import LoginPage from "./pages/LoginPage";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/projects/:projectId/clinics"
          element={<ClinicsPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;