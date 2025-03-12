import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "#1976D2",
        color: "#fff",
        textAlign: "center",
        padding: "10px 0",
        position: "relative",
        bottom: 0,
        width: "100%",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="body1" sx={{ fontSize: "14px" }}>
          &copy; {new Date().getFullYear()} BlogNest. All rights reserved.
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Footer;
