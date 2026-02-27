import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import BlogFeeds from "./pages/BlogFeeds.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/feeds" element={<BlogFeeds />} />
        <Route path="/feeds/:id" element={<BlogDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;