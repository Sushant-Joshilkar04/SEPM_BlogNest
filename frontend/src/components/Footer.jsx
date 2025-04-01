import { Box, Typography, Container, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)',
        color: '#2D31FA',
        py: 5,
        width: "100%",
        borderTop: '1px solid rgba(45, 49, 250, 0.1)',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wave Background */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: "linear-gradient(180deg, rgba(77, 97, 252, 0.05) 0%, rgba(77, 97, 252, 0.1) 100%)",
          borderTopLeftRadius: "50% 80%",
          borderTopRightRadius: "50% 80%",
          transform: "scale(1.5)",
          zIndex: 1,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h4" 
                align="center"
                sx={{
                  fontWeight: "800",
                  color: "#2D31FA",
                  fontSize: "2rem",
                  mb: 1,
                  letterSpacing: "0.02em",
                }}
              >
                BlogNest
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography 
                variant="body1" 
                align="center"
                sx={{ 
                  fontSize: "1rem",
                  color: '#555',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  mb: 1,
                }}
              >
              </Typography>
              <Typography 
                variant="body2" 
                align="center"
                sx={{ 
                  fontSize: "0.9rem",
                  color: '#666',
                  mt: 1
                }}
              >
                &copy; {new Date().getFullYear()} BlogNest. All rights reserved.
              </Typography>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;