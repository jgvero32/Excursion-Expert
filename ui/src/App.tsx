import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import "../src/styles/styles.scss";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { NavBar } from "./NavBar/NavBar";
import React from "react";
import { StartAnAdventure } from "./pages/StartAnAdventure/StartAnAdventure";
import { AboutUs } from "./pages/AboutUs/AboutUs";
import { AuthProvider } from "./auth/authContext";
import { RequireAuth } from "./auth/RequireAuth";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<></>} />
          <Route
            path="/*"
            element={
              // <RequireAuth>
                <ProtectedRoutes />
              // </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const ProtectedRoutes = () => {
  return(
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/itineraries" element={<Dashboard />} />
        <Route path="/start-an-adventure" element={<StartAnAdventure />} >
          <Route path=":city" element={<StartAnAdventure />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
