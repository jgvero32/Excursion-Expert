import React from "react";

export function Login() {
  return(
    <>
      <h1>Login</h1>
      <form action="/users/register" method="POST">
        <div>
          <input type="username" id="username" name="username" placeholder="Username" required />
        </div>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="password2"
            name="password2"
            placeholder="Confirm Password"
            required
          />
        </div>
        <div>
          <input type="submit" value="Register" />
        </div>
      </form>
    </>
  );
}