import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import GeneratePage from "./pages/GeneratePage.jsx";
import ProblemsPage from "./pages/ProblemsPage.jsx";
import SolvePage from "./pages/SolvePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<GeneratePage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/solve/:problemId" element={<SolvePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;