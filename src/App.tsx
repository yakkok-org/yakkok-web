import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SharePage from "./pages/SharePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/share/:code" element={<SharePage />} />
    </Routes>
  );
}

export default App;
