import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Founder & CEO',
    image: 'https://source.unsplash.com/random/200x200?face-1',
    description: 'Passionate about creating meaningful content platforms.',
  },
  {
    name: 'Jane Smith',
    role: 'Chief Editor',
    image: 'https://source.unsplash.com/random/200x200?face-2',
    description: 'Expert in content curation and editorial strategy.',
  },
  {
    name: 'Mike Johnson',
    role: 'Tech Lead',
    image: 'https://source.unsplash.com/random/200x200?face-3',
    description: 'Bringing innovative solutions to content delivery.',
  },
];

const About = () => {
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
        {/* Hero Section */}
        <Box sx={{ mb: 8 }}>
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
                letterSpacing: '0.02em'
              }}
            >
              About BlogNest
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ 
                mb: 4,
                color: '#333',
                fontWeight: 600
              }}
            >
              Empowering voices, connecting minds
            </Typography>
          </motion.div>
        </Box>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Box sx={{ mb: 8 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              align="center"
              sx={{
                color: '#2D31FA',
                fontWeight: 700,
                mb: 3
              }}
            >
              Our Mission
            </Typography>
            <Typography 
              variant="body1" 
              paragraph 
              align="center" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                color: '#555',
                fontSize: '1.1rem',
                lineHeight: 1.7
              }}
            >
              At BlogNest, we believe in the power of words to inspire, educate, and connect people across the globe. Our platform is designed to provide writers and readers with a seamless, engaging experience that fosters meaningful conversations and knowledge sharing.
            </Typography>
          </Box>
        </motion.div>

        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 4,
              color: '#2D31FA',
              fontWeight: 700
            }}
          >
            Meet Our Team
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} md={4} key={member.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.6 }}
                >
                  <Card
                    component={motion.div}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    sx={{ 
                      height: '100%',
                      borderRadius: '12px',
                      border: '1px solid rgba(77, 97, 252, 0.1)',
                      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <Avatar
                        src={member.image}
                        sx={{
                          width: 120,
                          height: 120,
                          mx: 'auto',
                          mb: 3,
                          border: '4px solid',
                          borderColor: 'rgba(77, 97, 252, 0.1)',
                        }}
                      />
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          color: '#333'
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        gutterBottom
                        sx={{
                          color: '#2D31FA',
                          fontWeight: 600,
                          mb: 2
                        }}
                      >
                        {member.role}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: '#555',
                          lineHeight: 1.5
                        }}
                      >
                        {member.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              align="center"
              sx={{
                color: '#2D31FA',
                fontWeight: 700,
                mb: 4
              }}
            >
              Our Values
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    p: 3,
                    borderRadius: '12px',
                    background: 'rgba(77, 97, 252, 0.05)',
                    border: '1px solid rgba(77, 97, 252, 0.1)',
                    height: '100%'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{
                      fontWeight: 700,
                      color: '#2D31FA',
                      mb: 2
                    }}
                  >
                    Innovation
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{
                      color: '#555',
                      lineHeight: 1.6
                    }}
                  >
                    Constantly evolving and improving our platform for the best user experience.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    p: 3,
                    borderRadius: '12px',
                    background: 'rgba(77, 97, 252, 0.05)',
                    border: '1px solid rgba(77, 97, 252, 0.1)',
                    height: '100%'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{
                      fontWeight: 700,
                      color: '#2D31FA',
                      mb: 2
                    }}
                  >
                    Community
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{
                      color: '#555',
                      lineHeight: 1.6
                    }}
                  >
                    Building meaningful connections between writers and readers worldwide.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    p: 3,
                    borderRadius: '12px',
                    background: 'rgba(77, 97, 252, 0.05)',
                    border: '1px solid rgba(77, 97, 252, 0.1)',
                    height: '100%'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{
                      fontWeight: 700,
                      color: '#2D31FA',
                      mb: 2
                    }}
                  >
                    Quality
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{
                      color: '#555',
                      lineHeight: 1.6
                    }}
                  >
                    Maintaining high standards for content and user experience.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </Container>
      
      {/* Bottom Wave */}
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

export default About;
