import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  console.log(formData)
  const serviceID = 'service_o2sxuja';
  const templateID = 'template_ubg6mnh';
  const publicKey = 'w1tSitK2IZs5W-kEe';

  const data = `
     Name: ${formData.name}
     Email: ${formData.email}
     Subject: ${formData.subject}
     Message: ${formData.message}
  `

  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject,
    message: data,
    to_email: 'sushant.joshilkar22@pccoepune.org',
  };

  try {
    await emailjs.send(serviceID, templateID, templateParams, publicKey);
    alert('Email sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  } catch (error) {
    console.error('Email sending error:', error);
    alert('Failed to send email.');
  }
};


  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: '#2D31FA' }} />,
      title: 'Email',
      content: 'contact@blognest.com',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: '#2D31FA' }} />,
      title: 'Phone',
      content: '+91 9565545545',
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: '#2D31FA' }} />,
      title: 'Address',
      content: 'Pune, Maharashtra, India ',
    },
  ];

  return (
    <Box sx={{ 
      background: 'linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)',
      position: 'relative',
      overflow: 'hidden',
      py: 8
    }}>
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
      
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{ 
              fontWeight: 800, 
              color: '#2D31FA', 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '0.02em',
              mb: 2
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ 
              mb: 6,
              color: '#333',
              fontWeight: 600
            }}
          >
            We'd love to hear from you
          </Typography>
        </motion.div>

        <Grid container spacing={6}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Box sx={{ height: '100%' }}>
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card sx={{ 
                    mb: 2, 
                    height: '100%', 
                    borderRadius: '12px',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(77, 97, 252, 0.1)'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          sx={{ 
                            mr: 2, 
                            background: 'rgba(77, 97, 252, 0.05)',
                            '&:hover': {
                              background: 'rgba(77, 97, 252, 0.1)'
                            }
                          }}
                        >
                          {info.icon}
                        </IconButton>
                        <Box>
                          <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{
                              fontWeight: 700,
                              color: '#333'
                            }}
                          >
                            {info.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{
                              color: '#555'
                            }}
                          >
                            {info.content}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  p: 4,
                  borderRadius: '12px',
                  boxShadow: '0px 8px 30px rgba(45, 49, 250, 0.1)',
                  border: '1px solid rgba(77, 97, 252, 0.1)'
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        '.MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2D31FA'
                          }
                        },
                        '.MuiInputLabel-root.Mui-focused': {
                          color: '#2D31FA'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        '.MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2D31FA'
                          }
                        },
                        '.MuiInputLabel-root.Mui-focused': {
                          color: '#2D31FA'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        '.MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2D31FA'
                          }
                        },
                        '.MuiInputLabel-root.Mui-focused': {
                          color: '#2D31FA'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{
                        '.MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2D31FA'
                          }
                        },
                        '.MuiInputLabel-root.Mui-focused': {
                          color: '#2D31FA'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ 
                          py: 1.5,
                          background: '#2D31FA',
                          borderRadius: '50px',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                          boxShadow: '0 4px 10px rgba(45, 49, 250, 0.3)',
                          '&:hover': {
                            background: '#2024c9',
                          }
                        }}
                      >
                        Send Message
                      </Button>
                    </motion.div>
                  </Grid>
                </Grid>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      
      {/* Bottom Wave Background */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "20%",
          background: "linear-gradient(180deg, rgba(77, 97, 252, 0.05) 0%, rgba(77, 97, 252, 0.1) 100%)",
          borderTopLeftRadius: "50% 80%",
          borderTopRightRadius: "50% 80%",
          transform: "scale(1.5)",
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default Contact;
