import { Route, Routes } from "react-router-dom";
import "./App.css";
import SharePage from "./pages/SharePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<>약꼭</>} />
      <Route path="/share/:code" element={<SharePage />} />
    </Routes>
  );
}

export default App;
