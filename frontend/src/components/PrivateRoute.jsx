// components/PrivateRoute.jsx
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // or a loading spinner
  return isSignedIn ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
