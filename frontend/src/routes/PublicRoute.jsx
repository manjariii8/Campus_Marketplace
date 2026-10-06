import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  // Allow logged-in users to access the seller application page.
  if (location.pathname === "/seller/register") {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  switch (user?.role) {
    case "ADMIN":
      return <Navigate to="/admin" replace />;

    case "SELLER":
      return <Navigate to="/seller" replace />;

    case "CUSTOMER":
    default:
      return <Navigate to="/" replace />;
  }
};

export default PublicRoute;
