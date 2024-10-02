import React from "react";

export function Register() {
  return(
    <>
      <h1>Register</h1>
      <form action="/users/register" method="POST">
      <div>
        <input type="text" id="username" name="username" placeholder="Username" required />
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
          id="password"
          name="password"
          placeholder="Password"
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

      <a href="/users/login">Already registered? Login here</a>
    </form>
    </>
  );
}