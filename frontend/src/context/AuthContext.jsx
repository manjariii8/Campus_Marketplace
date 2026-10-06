import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import authService from "../services/authService";

import {
  getToken,
  saveToken,
  removeToken,
  getUser,
  saveUser,
  removeUser,
} from "../utils/token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUser());
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /*
   * Authentication is determined by the token.
   */
  const isAuthenticated = Boolean(getToken());

  /*
   * Initialize authentication state
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        const token = getToken();

        // No token means user is not authenticated
        if (!token) {
          setUser(null);
          return;
        }

        // Token exists, check for stored user
        const storedUser = getUser();

        if (storedUser) {
          setUser(storedUser);
        } else {
          // Token exists but user information is missing
          removeToken();
          removeUser();
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Auth initialization failed:",
          error
        );

        removeToken();
        removeUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  /*
   * LOGIN
   */
  const login = async (credentials) => {
    const response = await authService.login(credentials);

    const authData = response.data?.data;

    if (!authData) {
      throw new Error(
        "Login succeeded but authentication information was not returned."
      );
    }

    const token = authData.token;

    const loggedInUser = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,

      // Campus information returned by the backend
      campusId: authData.campusId,
      campusName: authData.campusName,
      campusCity: authData.campusCity,
      campusState: authData.campusState,
    };

    if (!token) {
      throw new Error(
        "Login succeeded but token was not returned."
      );
    }

    if (!loggedInUser.email) {
      throw new Error(
        "Login succeeded but user information was not returned."
      );
    }

    // Save authentication information
    saveToken(token);
    saveUser(loggedInUser);

    // Update React state
    setUser(loggedInUser);

    return loggedInUser;
  };

  /*
   * REGISTER
   */
  const register = async (payload) => {
    return authService.register(payload);
  };

  /*
   * LOGOUT
   */
  const logout = () => {
    removeToken();
    removeUser();

    setUser(null);

    navigate("/login", {
      replace: true,
    });
  };

  /*
   * UPDATE USER
   */
  const updateUser = (updatedData) => {
    const currentUser = getUser();

    const updatedUser = {
      ...currentUser,
      ...updatedData,
    };

    saveUser(updatedUser);
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    register,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/*
 * CUSTOM AUTH HOOK
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default useAuth;