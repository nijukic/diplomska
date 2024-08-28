import SignInSide from "./pages/SignInSide";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Outlet,
} from "react-router-dom";
import PrivateRoutes from "./helpers/PrivateRoutes";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";

import { AuthProvider } from "./helpers/AuthContext";
import AdminRoute from "./helpers/AdminRoute";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<SignInSide />} />
            <Route element={<Outlet />}>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<Home />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/signUp" element={<SignUp />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
