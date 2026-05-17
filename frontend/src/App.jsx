import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Admin from "./pages/Admin.jsx";
import Bookings from "./pages/Bookings.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import SkillCreate from "./pages/SkillCreate.jsx";
import SkillDetail from "./pages/SkillDetail.jsx";
import Skills from "./pages/Skills.jsx";

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="skills" element={<Skills />} />
      <Route path="skills/:id" element={<SkillDetail />} />
      <Route path="skills/new" element={<SkillCreate />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="profile" element={<Profile />} />
      <Route path="admin" element={<Admin />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
