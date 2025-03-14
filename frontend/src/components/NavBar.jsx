import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <AppBar position="sticky" sx={{ background: "#1976D2", paddingX: 2 }}>
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
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#fff" }}>
            BlogNest
          </Typography>
        </Box>

       
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
          {[
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/contact" },
          ].map((item, index) => (
            <Typography
              key={index}
              component={motion.p}
              whileHover={{ scale: 1.1, color: "#FFD700" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: "pointer",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              {item.name}
            </Typography>
          ))}
        </Box>

       
        <Box sx={{ display: "flex", gap: 2 }}>
          {
            !token && 
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="outlined" sx={{ color: "#fff", borderColor: "#fff" }} onClick={() => navigate("/login")}>
                Login
              </Button>
            </motion.div>
          }
          
          {
            !token && 
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="contained" sx={{ backgroundColor: "#FFC107" }} onClick={() => navigate("/signup")}>
                Signup
              </Button>
            </motion.div>
          }

          {
            token && 
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="outlined" sx={{ color: "#fff", borderColor: "#fff" }} onClick={() => navigate("/community")}>
                Join Community
              </Button>
            </motion.div>
          }

          {
            token && 
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="contained" sx={{ backgroundColor: "#FFC107" }} onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            </motion.div>
          }


        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
