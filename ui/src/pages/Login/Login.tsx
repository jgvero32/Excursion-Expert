import { useState } from 'react';
import "./Login.scss";
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/authContext';

type LocationState = { redirectedFrom: string };

export function Login() {
  const { logIn, authenticated, authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const locationState = location.state as LocationState;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData(event.currentTarget);
      const username = data.get("username")?.toString();
      const password = data.get("password")?.toString();

      if (username && password) {
        await logIn(username, password);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authenticated) {
    return <Navigate to={locationState?.redirectedFrom || "/home"} />;
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Log in</h1>
      <form className="login-form" onSubmit={handleSubmit}> 
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username here"
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password here"
            required
            className="input-field"
          />
        </div>
        {authError && <div style={{ color: "red" }}>{authError}</div>}
        <div className="submit-group">
          <button type="submit" disabled={isLoading} className="submit-button">{isLoading ? "Logging in..." : "Login"}</button>
        </div>
        <p className="link"> Don't have an account? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
}
