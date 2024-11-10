import { useState } from 'react';
import "./Register.scss";
import { Link, useNavigate } from 'react-router-dom';

export function Register() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("")
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form was submbitted");

    const formData = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });


      if (response.ok) {
        const data = await response.json();
        console.log('Register successful:', data.token);
        localStorage.setItem('token', data.token); // Store token locally
        localStorage.setItem('user', JSON.stringify(data.user));
        //TODO: ssetToken(data.token); store token jelena
        navigate("/start-an-adventure");
      } else {
        // Handle errors (e.g., show error message)
        const msg = await response.text()
        setStatus(msg)
        console.error('Register error:', msg);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setStatus("Something is wrong")
    }
  };


  return (
    <div className="register-container">
      <h1 className="register-title">Register an Account</h1>
      <form className="register-form" action="/api/register" method="POST" onSubmit={handleSubmit}> 
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
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmedPassword"> Confirm Password</label>
          <input
            type="password"
            id="confirmedPassword"
            name="confirmedPassword"
            placeholder="Enter your password here"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        {status && <div style={{ color: "red" }}>{status}</div>}
        <div className="submit-group">
          <button type="submit" className="submit-button">Register</button>
        </div>
        <p className="link"> Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
}
