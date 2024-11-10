import { useState } from 'react';
import "./Login.scss";
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from "@mui/material";

export function Login() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form was submitted");

    const formData = {
      username,
      password,
    };

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data.token);
        localStorage.setItem('token', data.token); // Store token locally
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate("/start-an-adventure");
      } else {
        const msg = await response.text();
        setStatus(msg);
        console.error('Login error:', msg);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setStatus("Something is wrong");
    }
  };

  return (       
    <div className="login-container">
      <h1 className="login-title">Log in</h1>
      <form className="login-form" action="/api/login" method="POST" onSubmit={handleSubmit}> 
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            placeholder="Enter your username here"
            required
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        {status && <div style={{ color: "red" }}>{status}</div>}
        <div className="submit-group">
          <button type="submit" className="submit-button">Log In</button>
        </div>
        <p className="link"> Don't have an account? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
}