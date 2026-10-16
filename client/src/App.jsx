
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Skills from "./pages/Skills";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Roadmap from "./pages/Roadmap";
import Resume from "./pages/Resume";
import Practice from "./pages/Practice";
import Interview from "./pages/Interview";
import PeerInterview from "./pages/PeerInterview";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/mock-interview" element={<Interview />} />
          <Route path="/peer-interview" element={<PeerInterview />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
