import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the AuthContext type
interface AuthContextType {
  idUporabnika: number;
  uporabniskoImeUporabnika: string;
  vlogaUporabnika: string;
  idStrankeUporabnika: number;
  themeMode: boolean;
  setThemeMode: (mode: boolean) => void;
  isAuthenticated: boolean;
  login: (
    token: string,
    userData: {
      idUporabnika: number;
      uporabniskoImeUporabnika: string;
      vlogaUporabnika: string;
      idStrankeUporabnika: number;
    },
    rememberMe: boolean
  ) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const defaultContext = {
  idUporabnika: 0,
  uporabniskoImeUporabnika: "guest",
  vlogaUporabnika: "guest",
  idStrankeUporabnika: 0,
  themeMode: true,
  setThemeMode: () => {},
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  checkAuth: async () => Promise.resolve(),
};

// Create the AuthContext with a default value, default value will never be used it is only required for initialization so values are not null
export const AuthContext = createContext<AuthContextType>(defaultContext);

// Define the AuthProvider props type
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component which we will wrap around all components that need access to it
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [idUporabnika, setIdUporabnika] = useState<number>(0);
  const [uporabniskoImeUporabnika, setUporabniskoImeUporabnika] =
    useState<string>("guest");
  const [vlogaUporabnika, setVlogaUporabnika] = useState<string>("guest");
  const [idStrankeUporabnika, setIdStrankeUporabnika] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (
    token: string,
    userData: {
      idUporabnika: number;
      uporabniskoImeUporabnika: string;
      vlogaUporabnika: string;
      idStrankeUporabnika: number;
    },
    rememberMe: boolean
  ) => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    rememberMe
      ? localStorage.setItem("accessToken", token)
      : sessionStorage.setItem("accessToken", token);

    setIdUporabnika(userData.idUporabnika);
    setUporabniskoImeUporabnika(userData.uporabniskoImeUporabnika);
    setVlogaUporabnika(userData.vlogaUporabnika);
    setIdStrankeUporabnika(userData.idStrankeUporabnika);
    setIsAuthenticated(true);
    if (rememberMe) {
      localStorage.setItem("username", userData.uporabniskoImeUporabnika);
    } else {
      localStorage.removeItem("username");
    }

    if (localStorage.getItem("themeMode") == "dark") {
      setThemeMode(false);
    }
  };

  const logout = () => {
    const destroyRefreshToken = async () => {
      try {
        await axios.post(
          "http://localhost:3001/refresh-token/destroy",
          {},
          {
            withCredentials: true,
          }
        );
      } catch (refreshError) {
        console.error(refreshError);
      }
    };
    destroyRefreshToken();
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setIdUporabnika(0);
    setUporabniskoImeUporabnika("guest");
    setVlogaUporabnika("guest");
    setIdStrankeUporabnika(0);
  };

  const checkAuth = async () => {
    if (localStorage.getItem("themeMode") == "dark") {
      setThemeMode(false);
    }
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    try {
      const response = await axios.post("http://localhost:3001/auth", {
        accessToken: token,
      });
      setIsAuthenticated(true);
      setIdUporabnika(response.data.idUporabnika);
      setUporabniskoImeUporabnika(response.data.uporabniskoImeUporabnika);
      setVlogaUporabnika(response.data.vlogaUporabnika);
      setIdStrankeUporabnika(response.data.idStrankeUporabnika);
    } catch (error: any) {
      if (error.response.status === 403) {
        // Attempt to refresh token
        try {
          const refreshResponse = await axios.post(
            "http://localhost:3001/refresh-token",
            {},
            {
              withCredentials: true,
            }
          );
          if (sessionStorage.getItem("accessToken")) {
            sessionStorage.setItem(
              "accessToken",
              refreshResponse.data.accessToken
            );
          } else {
            localStorage.setItem(
              "accessToken",
              refreshResponse.data.accessToken
            );
          }
          setIsAuthenticated(true);
          setIdUporabnika(refreshResponse.data.idUporabnika);
          setUporabniskoImeUporabnika(
            refreshResponse.data.uporabniskoImeUporabnika
          );
          setVlogaUporabnika(refreshResponse.data.vlogaUporabnika);
          setIdStrankeUporabnika(refreshResponse.data.idStrankeUporabnika);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          logout();
        }
      } else {
        console.error("Authentication check failed:", error);
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        idUporabnika,
        uporabniskoImeUporabnika,
        vlogaUporabnika,
        idStrankeUporabnika,
        isAuthenticated,
        themeMode,
        setThemeMode,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
