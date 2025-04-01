import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Chip, CircularProgress, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDock } from '../components/Dock';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts/getallpost');
      if (response.data.success) {
        // Filter out draft posts
        const publishedPosts = response.data.data.filter(post => !post.isDraft);
        setPosts(publishedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)",
        pb: 10,
        pt: 2,
      }}
    >
      {/* Wave Background - Top */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: "linear-gradient(180deg, rgba(77, 97, 252, 0.1) 0%, rgba(77, 97, 252, 0.02) 100%)",
          borderBottomLeftRadius: "50% 20%",
          borderBottomRightRadius: "50% 20%",
          transform: "scale(1.5)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, pt: 8, pb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            fontWeight="700"
            color="#2D31FA"
            sx={{
              textAlign: "center",
              mb: 4,
              letterSpacing: "0.02em",
            }}
          >
            Latest Articles
          </Typography>
        </motion.div>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#2D31FA" }} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 8 }}>
            {error}
          </Typography>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
                gap: 4,
              }}
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="cursor-pointer"
                  onClick={() => navigate(`/blog/${post._id}`)}
                >
                  <Card sx={{ 
                    height: "100%", 
                    borderRadius: 3, 
                    boxShadow: "0 8px 20px rgba(77, 97, 252, 0.1)",
                    border: "1px solid rgba(77, 97, 252, 0.08)",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="h6" 
                        fontWeight="600" 
                        gutterBottom 
                        className="line-clamp-2"
                        color="#333"
                        sx={{ minHeight: "3.5rem" }}
                      >
                        {post.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2 }}
                      >
                        By {[post.author?.firstName, " ", post.author?.lastName] || 'Unknown Author'}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 1 }}>
                        {post.tags?.slice(0, 3).map((tag, idx) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            sx={{ 
                              background: "rgba(45, 49, 250, 0.06)",
                              borderColor: "rgba(45, 49, 250, 0.3)",
                              color: "#2D31FA",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                        {post.tags?.length > 3 && (
                          <Chip
                            label={`+${post.tags.length - 3}`}
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
        )}
      </Container>

      {/* Wave Background - Bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: "linear-gradient(180deg, rgba(77, 97, 252, 0.02) 0%, rgba(77, 97, 252, 0.1) 100%)",
          borderTopLeftRadius: "50% 30%",
          borderTopRightRadius: "50% 30%",
          transform: "scale(1.5)",
          zIndex: 0,
        }}
      />

      <UserDock />
    </Box>
  );
};

export default Dashboard;