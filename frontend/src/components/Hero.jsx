import { Box, Button, Typography, Grid, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/image.png";

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (token) {
      // Navigate based on user role
      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'moderator':
          navigate('/moderator/dashboard');
          break;
        default:
          navigate('/dashboard');
          break;
      }
    } else {
      // If no token, navigate to auth page
      navigate('/auth');
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)",
      }}
    >
      {/* Wave Background */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "linear-gradient(180deg, rgba(77, 97, 252, 0.1) 0%, rgba(77, 97, 252, 0.4) 100%)",
          borderTopLeftRadius: "50% 40%",
          borderTopRightRadius: "50% 40%",
          transform: "scale(1.5)",
          zIndex: 1,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Column - Text Content */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                fontWeight="800"
                color="#2D31FA"
                sx={{
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textTransform: "uppercase",
                  mb: 1,
                  letterSpacing: "0.02em",
                }}
              >
                BlogNest
              </Typography>
              
              <Typography
                variant="h4"
                sx={{
                  color: "#333",
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: '1.8rem', md: '2.3rem' },
                  fontWeight: 600,
                  mb: 2,
                  letterSpacing: "0.02em",
                }}
              >
                Where ideas take flight!
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  textAlign: { xs: "center", md: "left" },
                  mb: 4,
                  color: "#555",
                  maxWidth: "80%",
                  mx: { xs: "auto", md: 0 },
                }}
              >
                At BlogNest, every idea finds its wings—whether you're sharing stories, insights, or sparking meaningful conversations.
              </Typography>

              <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" } }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#2D31FA",
                      px: 4,
                      py: 1.5,
                      borderRadius: "50px",
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      boxShadow: "0 4px 10px rgba(45, 49, 250, 0.3)",
                      "&:hover": {
                        bgcolor: "#2024c9",
                      },
                    }}
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Column - Illustration */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box
                component="img"
                src={heroImage}
                alt="Blog collaboration"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "550px",
                  display: "block",
                  mx: "auto",
                  borderRadius: "10px",
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
