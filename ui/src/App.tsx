import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import "../src/styles/styles.scss";
import { Itineraries } from "./pages/Itineraries/Itineraries";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { NavBar } from "./NavBar/NavBar";
import { StartAnAdventure } from "./pages/StartAnAdventure/StartAnAdventure";
import { AboutUs } from "./pages/AboutUs/AboutUs";
import { AuthProvider } from "./auth/authContext";
import { RequireAuth } from "./auth/RequireAuth";
import { Profile } from "./pages/Profile/Profile";
import { Contact } from "./pages/Contact/Contact";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <NavBar />
        <div className="app">
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <ProtectedRoutes />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

const ProtectedRoutes = () => {
  return(
    <Routes>
      <Route path="/" element={<Navigate replace to="/home" />} />
      <Route path="/itineraries" element={<Itineraries />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/start-an-adventure" element={<StartAnAdventure />} >
        <Route path=":city" element={<StartAnAdventure />} />
      </Route>
    </Routes>
  );
};

export default App;
