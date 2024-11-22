import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext";
import "./Register.scss";

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
    confirmedPassword: "",
  });

  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        username: formData.username,
      });
      navigate("/start-an-adventure");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    }
  };

  return (
    <Box className="register">
      <Box className="register-container">
        <Typography variant="h4" className="register-title">
          Register an Account
        </Typography>
        <Box component="form" className="register-form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            name="email"
            placeholder="Enter email address here"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              style: { backgroundColor: "#ffffff", borderRadius: "8px" },
            }}
          />
          <TextField
            label="Username"
            name="username"
            placeholder="Enter username here"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              style: { backgroundColor: "#ffffff", borderRadius: "8px" },
            }}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password here"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              style: { backgroundColor: "#ffffff", borderRadius: "8px" },
            }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmedPassword"
            placeholder="Enter password again"
            fullWidth
            value={formData.confirmedPassword}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              style: { backgroundColor: "#ffffff", borderRadius: "8px" },
            }}
          />
          {error && (
            <Typography color="error" style={{ marginBottom: "16px" }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="submit-button"
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>
        </Box>
        <Typography className="link" style={{ marginTop: "20px" }}>
          Already have an account?{" "}
          <MuiLink
            component={Link}
            to="/login"
            underline="hover"
            color="#3B3B4F"
          >
            Login here
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
