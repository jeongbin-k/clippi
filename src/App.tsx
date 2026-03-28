import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Homepage from "./pages/Homepage";
import DashboardPage from "./pages/DashboardPage";
import NoticePage from "./pages/NoticePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feed" element={<Homepage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/notice" element={<NoticePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
