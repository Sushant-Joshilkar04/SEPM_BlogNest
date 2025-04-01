import React from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';

const FAQ = () => {
  const theme = useTheme();

  const faqs = [
    {
      question: "What is BlogNest?",
      answer: "BlogNest is a modern blogging platform that allows you to create, share, and discover engaging content. It provides an intuitive interface for writers and readers to connect through meaningful stories and ideas."
    },
    {
      question: "How do I get started with writing?",
      answer: "Getting started is easy! Simply sign up for an account, click on the 'Create Post' button in your dashboard, and start writing. You can use our rich text editor to format your content, add images, and more."
    },
    {
      question: "Is BlogNest free to use?",
      answer: "Yes, BlogNest offers a free tier that includes all essential features. We also offer premium plans with additional features for professional writers and organizations."
    },
    {
      question: "Can I customize my blog's appearance?",
      answer: "Absolutely! You can customize your blog's theme, colors, layout, and typography. We provide various templates and customization options to help you create a unique look for your blog."
    },
    {
      question: "How can I grow my audience?",
      answer: "BlogNest provides various tools to help grow your audience: SEO optimization, social media sharing, email newsletters, and community features. You can also engage with other writers and readers through comments and follows."
    },
    {
      question: "What type of content can I publish?",
      answer: "You can publish various types of content including articles, stories, tutorials, reviews, and more. We support text, images, embedded videos, and code snippets. All content must comply with our community guidelines."
    },
    {
      question: "How secure is my blog content?",
      answer: "We take security seriously. Your content is encrypted, regularly backed up, and protected by industry-standard security measures. You have full control over your content's privacy settings."
    },
    {
      question: "Can I monetize my blog?",
      answer: "Yes, premium users can monetize their content through various methods including subscriptions, sponsored posts, and affiliate marketing. We provide tools to help you manage and track your earnings."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)',
        py: 10,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Wave Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(180deg, rgba(77, 97, 252, 0.1) 0%, rgba(77, 97, 252, 0.02) 100%)",
          borderBottomLeftRadius: "50% 20%",
          borderBottomRightRadius: "50% 20%",
          transform: "scale(1.5)",
          zIndex: 1,
        }}
      />
    
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 2 
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              component={motion.h2}
              variants={itemVariants}
              variant="h2"
              sx={{
                fontWeight: 800,
                color: '#2D31FA',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3rem' },
                letterSpacing: '0.02em',
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              component={motion.p}
              variants={itemVariants}
              variant="h6"
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                color: '#555',
                fontSize: '1.1rem',
                mb: 2,
              }}
            >
              Find answers to common questions about BlogNest
            </Typography>
          </Box>

          {/* FAQ Accordions */}
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Accordion
                  sx={{
                    mb: 2,
                    borderRadius: '8px !important',
                    overflow: 'hidden',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(77, 97, 252, 0.1)',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      boxShadow: '0px 6px 20px rgba(45, 49, 250, 0.1)',
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon sx={{ color: '#2D31FA' }} />
                    }
                    sx={{
                      background: 'rgba(77, 97, 252, 0.02)',
                      '& .MuiAccordionSummary-content': {
                        my: 1.5
                      }
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#333',
                        fontSize: '1.1rem',
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{ 
                        color: '#555',
                        lineHeight: 1.7,
                        fontSize: '1rem', 
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FAQ;
