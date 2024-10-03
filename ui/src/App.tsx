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

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedRoutes />
          }
        />
      </Routes>
    </Router>
  );
}

const ProtectedRoutes = () => {
  return(
    <>
      <NavBar />
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/start-an-adventure" element={<StartAnAdventure />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
