import { Routes, Route, Navigate } from "react-router";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { useRefreshToken } from "./hooks/useRefreshToken";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import BlogDetails from "./pages/BlogDetails";

function App() {
  useRefreshToken();
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={<PublicRoute><Login /></PublicRoute> }
      />

      <Route
        path="/register"
        element={<PublicRoute><Register /></PublicRoute> }
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route
        path="/blogs/:id"
        element={<BlogDetails />}
      />
    </Routes>
  );
}

export default App;