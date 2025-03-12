import { Box, Button, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/image.png"; 

const Hero = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, md: 6 },
        background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)", 
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              color="primary"
              component={motion.h2}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              BlogNest
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 1,
                color: "gray",
                textAlign: { xs: "center", md: "left" },
              }}
              component={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Where ideas take flight!
            </Typography>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  px: 4,
                  py: 1,
                  display: "block",
                  mx: { xs: "auto", md: "0" },
                }}
                onClick={() => navigate("/login")}
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
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={heroImage}
              alt="Hero"
              style={{
                width: "100%",
                maxWidth: "450px",
                borderRadius: "10px",
                boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
              }}
            />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
