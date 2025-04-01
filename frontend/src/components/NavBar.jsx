import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)',
        padding: "0.8rem 0",
        borderBottom: '1px solid rgba(77, 97, 252, 0.1)',
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Box
          display="flex"
          alignItems="center"
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "800",
              color: "#2D31FA",
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              letterSpacing: "0.02em",
            }}
          >
            BlogNest
          </Typography>
        </Box>

        {/* Navigation Links - Centered on Desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {[{ name: "Home", path: "/" }, { name: "About us", path: "/about" }, { name: "Contact Us", path: "/contact" }].map((item, index) => (
            <Typography
              key={index}
              component={motion.p}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: "pointer",
                color: '#333',
                fontSize: "1rem",
                fontWeight: "500",
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '0%',
                  height: '2px',
                  bottom: -2,
                  left: 0,
                  backgroundColor: '#2D31FA',
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

        {/* Hamburger Menu for Mobile/Tablet */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton onClick={handleMenuOpen}>
            <MenuIcon sx={{ color: "#2D31FA" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                background: 'linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)',
                boxShadow: '0px 4px 20px rgba(45, 49, 250, 0.1)',
              }
            }}
          >
            {[{ name: "Home", path: "/" }, { name: "About us", path: "/about" }, { name: "Contact", path: "/contact" }].map((item, index) => (
              <MenuItem key={index} onClick={() => { navigate(item.path); handleMenuClose(); }}>
                {item.name}
              </MenuItem>
            ))}
            <MenuItem onClick={() => { navigate(token ? "/profile" : "/auth"); handleMenuClose(); }}>
              {token ? "Profile" : "Sign In"}
            </MenuItem>
          </Menu>
        </Box>

        {/* Sign In / Profile Button - Right Aligned on Desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate(token ? "/profile" : "/auth")}
              sx={{
                background: '#2D31FA',
                borderRadius: '50px',
                padding: '8px 24px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                boxShadow: '0 4px 15px rgba(45, 49, 250, 0.2)',
                '&:hover': {
                  background: '#2024c9',
                  boxShadow: '0 6px 20px rgba(45, 49, 250, 0.3)',
                }
              }}
            >
              {token ? "Profile" : "Get Started"}
            </Button>
          </motion.div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;