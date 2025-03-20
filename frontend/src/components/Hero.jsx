import { Box, Button, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/image.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, md: 6 },
        background: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(243,244,246,0.95), rgba(229,231,235,0.9))',
          zIndex: 1
        }
      }}
    >
      <Grid 
        container 
        spacing={4} 
        alignItems="center" 
        sx={{ 
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              fontWeight="bold"
              color="primary"
              component={motion.h1}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              sx={{
                textAlign: { xs: "center", md: "left" },
                fontSize: { xs: '3rem', md: '4rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                mb: 2
              }}
            >
              BlogNest
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 1,
                color: 'text.secondary',
                textAlign: { xs: "center", md: "left" },
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 500,
                lineHeight: 1.4
              }}
              component={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Where ideas take flight!
            </Typography>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 4,
                  px: 6,
                  py: 2,
                  display: "block",
                  mx: { xs: "auto", md: "0" },
                  fontSize: '1.25rem',
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,118,255,0.39)'
                  }
                }}
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        </Grid>

        {/* Right Column - Animated Image */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -1, 1, -1, 0],
              transition: { duration: 0.5 }
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="Hero"
              sx={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                transform: 'perspective(1000px) rotateY(-5deg)',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'perspective(1000px) rotateY(0deg)'
                }
              }}
            />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;