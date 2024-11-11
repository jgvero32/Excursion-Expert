import { useState } from 'react';
import "./Register.scss";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/authContext';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
 }

export function Register() {
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmedPassword: ""
  });

  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
 
    // Validate passwords match
    if (formData.password !== formData.confirmedPassword) {
      setError("Passwords do not match");
      return;
    }
 
    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
 
    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username
      });
      navigate("/start-an-adventure"); // or wherever you want to redirect after registration
    } catch (err: any) {
      setError(err.message || "Failed to register");
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register an Account</h1>
      <form className="register-form" onSubmit={handleSubmit}> 
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            placeholder="Enter your username here"
            required
            onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
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
            value={formData.password}
            onChange={handleChange}
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
            value={formData.confirmedPassword}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="submit-group">
          <button type="submit" className="submit-button">Register</button>
        </div>
        <p className="link"> Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
}
