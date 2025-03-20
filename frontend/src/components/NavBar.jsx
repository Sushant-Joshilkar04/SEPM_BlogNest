import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(90deg, #e2e2e2, #c9d6ff)',
        padding: "1rem 0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          display="flex"
          alignItems="center"
          component={motion.div}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: "'Abril Fatface', cursive",
              color: '#1976D2',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '1px'
            }}
          >
            BlogNest
          </Typography>
        </Box>

        <Box sx={{ 
          display: { xs: "none", md: "flex" }, 
          gap: 4,
          alignItems: 'center'
        }}>
          {[
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/contact" },
          ].map((item, index) => (
            <Typography
              key={index}
              component={motion.p}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: "pointer",
                color: '#1976D2',
                fontSize: "1rem",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "500",
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '0%',
                  height: '2px',
                  bottom: -2,
                  left: 0,
                  backgroundColor: '#1976D2',
                  transition: 'width 0.3s ease'
                },
                '&:hover::after': {
                  width: '100%'
                }
              }}
            >
              {item.name}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          {!token && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="contained" 
                onClick={() => navigate("/auth")}
                sx={{
                  background: 'linear-gradient(45deg, #1976D2, #2196F3)',
                  borderRadius: '50px',
                  padding: '8px 24px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565C0, #1976D2)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                  }
                }}
              >
                Sign In
              </Button>
            </motion.div>
          )}

          {token && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="contained"
                onClick={() => navigate("/profile")}
                sx={{
                  background: 'linear-gradient(45deg, #1976D2, #2196F3)',
                  borderRadius: '50px',
                  padding: '8px 24px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565C0, #1976D2)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                  }
                }}
              >
                Profile
              </Button>
            </motion.div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;