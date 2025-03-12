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
    <Container maxWidth="lg" sx={{ py: 8 }}>
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
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            About BlogNest
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
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
          <Typography variant="h4" gutterBottom align="center">
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ maxWidth: '800px', mx: 'auto' }}>
            At BlogNest, we believe in the power of words to inspire, educate, and connect people across the globe. Our platform is designed to provide writers and readers with a seamless, engaging experience that fosters meaningful conversations and knowledge sharing.
          </Typography>
        </Box>
      </motion.div>

      {/* Team Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
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
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={member.image}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        border: '4px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
          <Typography variant="h4" gutterBottom align="center">
            Our Values
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Innovation
                </Typography>
                <Typography variant="body2">
                  Constantly evolving and improving our platform for the best user experience.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Community
                </Typography>
                <Typography variant="body2">
                  Building meaningful connections between writers and readers worldwide.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Quality
                </Typography>
                <Typography variant="body2">
                  Maintaining high standards for content and user experience.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Container>
  );
};

export default About;
