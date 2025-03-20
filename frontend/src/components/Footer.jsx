import { Box, Typography, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(90deg, #e2e2e2, #c9d6ff)',
        color: '#1976D2',
        py: 3,
        width: "100%",
        borderTop: '1px solid rgba(25, 118, 210, 0.1)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h6" 
                align="center"
                sx={{
                  fontFamily: "'Abril Fatface', cursive",
                  fontSize: "1.5rem",
                  mb: 1,
                  background: 'linear-gradient(45deg, #1976D2, #2196F3)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.05)'
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
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.9rem",
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                Made with <FaHeart style={{ color: '#e91e63' }} /> by Team BlogNest
              </Typography>
              <Typography 
                variant="body2" 
                align="center"
                sx={{ 
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.8rem",
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