import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import GeneratePage from "./pages/GeneratePage.jsx";
import ProblemsPage from "./pages/ProblemsPage.jsx";
import SolvePage from "./pages/SolvePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<GeneratePage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/solve/:problemId" element={<SolvePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;