import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Spinner } from "./components/Spinner";
import { useAuth } from "./context/AuthContext";
import { AuthPage } from "./pages/AuthPage";
import { BoardPage } from "./pages/BoardPage";
import { BoardsPage } from "./pages/BoardsPage";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner fullPage />;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:id" element={<BoardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/boards" replace />} />
    </Routes>
  );
}
