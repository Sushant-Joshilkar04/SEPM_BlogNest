import React from "react";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import { Link as ScrollLink, Element } from "react-scroll"; // Import for smooth scrolling
import Hero from "../components/Hero";
import FAQ from "../components/FAQ";
import BlogCard from "../components/BlogCard";

const HeroPage = () => {
  return (
    <Box sx={{ scrollBehavior: "smooth", overflowX: "hidden" }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Element name="hero">
          <Box mb={8}> {/* Adds bottom margin */}
            <Hero />
          </Box>
        </Element>
      </motion.div>

      

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <Element name="blogs">
          <Box mb={8}>
            <BlogCard />
          </Box>
        </Element>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <Element name="faq">
          <Box mb={8}>
            <FAQ />
          </Box>
        </Element>
      </motion.div>
    </Box>
  );
};

export default HeroPage;
