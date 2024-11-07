import React from "react";
import "./Login.scss";

export function Login() {
  return (
    <div className="login-container">
      <h1 className="login-title">Log in</h1>
      <form className="login-form" action="/users/register" method="POST">
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username here test"
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
            placeholder="Enter password here"
            required
            className="input-field"
          />
        </div>
        <div className="submit-group">
          <button type="submit" className="submit-button">Log In</button>
        </div>
      </form>
    </div>
  );
}
