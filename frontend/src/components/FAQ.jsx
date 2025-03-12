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
    <Container maxWidth="lg" sx={{ py: 8 }}>
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
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            component={motion.p}
            variants={itemVariants}
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto' }}
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
                  boxShadow: theme.shadows[2],
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    boxShadow: theme.shadows[4],
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: 'primary.main' }} />
                  }
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      my: 2
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pb: 3 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
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
  );
};

export default FAQ;
