import ProtectedRoute from "./ProtectedRoute";

const CustomerRoute = () => (
  <ProtectedRoute allowedRoles={["CUSTOMER", "SELLER"]} />
);

export default CustomerRoute;
