import { useState } from "react";
import { TextField, Button, MenuItem, Box, Typography, Paper, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person } from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields.");
      return;
    }

    try {
        const response = await axios.post("http://localhost:5000/api/auth/login", formData);
        toast.success("Login successful!");
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000); 
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed!");
        console.error("Login Error:", error);
      }

    
  };

  return (
  

    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f4f6f8"
    >
      <Paper elevation={3} sx={{ p: 4, width: 350, borderRadius: 3 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Login
        </Typography>

        {error && (
          <Typography color="error" textAlign="center" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
     
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            required
          />
          
          <TextField
            fullWidth
            select
            label="Select Role"
            variant="outlined"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
          />

          
         
     
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
             Don't have an account? <a href="/signup" style={{ color: "blue", textDecoration: "none" }}>Sign Up</a>
    </Typography>
      </Paper>
      <ToastContainer position="top-right" autoClose={3000} />

    </Box>

  );
};

export default Login;
