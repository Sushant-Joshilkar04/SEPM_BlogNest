import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserDock } from '../components/Dock';
import axios from 'axios';
import { Box, Container, Typography, Button, Card, CardMedia, CardContent, CircularProgress, Avatar, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArticleIcon from '@mui/icons-material/Article';

const CommunityBlogs = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to validate MongoDB ObjectId
  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  useEffect(() => {
    if (!communityId) {
      setError('Community ID is required');
      setLoading(false);
      return;
    }

    if (!isValidObjectId(communityId)) {
      setError('Invalid community ID format');
      setLoading(false);
      return;
    }

    fetchCommunity();
    fetchPosts();
  }, [communityId]);

  const fetchCommunity = async () => {
    try {
      console.log('Fetching community with ID:', communityId);
      const response = await axios.get(`http://localhost:5000/api/community/getcommunity/${communityId}`);
      console.log('Community response:', response.data);
      
      if (response.data.success) {
        if (!response.data.data || response.data.data.length === 0) {
          setError('Community not found');
          return;
        }
        setCommunity(response.data.data[0]);
      } else {
        setError(response.data.message || 'Failed to fetch community details');
      }
    } catch (error) {
      console.error('Error fetching community:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.message || 'Failed to fetch community details');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        setError('Error setting up request');
      }
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view community posts');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/posts/getcommunityposts/${communityId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setPosts(response.data.data);
      } else {
        setError('Failed to fetch community posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.message || 'Failed to fetch community posts');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        setError('Error setting up request');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate('/create-blog', { state: { communityId: communityId } });
  };

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: "100vh", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          background: "linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)"
        }}
      >
        <CircularProgress sx={{ color: "#2D31FA" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center",
          background: "linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)",
          gap: 2
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/community')}
          sx={{
            bgcolor: "#2D31FA",
            "&:hover": {
              bgcolor: "#2024c9",
            },
          }}
        >
          Back to Communities
        </Button>
      </Box>
    );
  }

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
        {community && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Card 
              sx={{ 
                mb: 6, 
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 8px 25px rgba(77, 97, 252, 0.12)",
                border: "1px solid rgba(77, 97, 252, 0.08)"
              }}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="240"
                  image={community.banner || 'https://via.placeholder.com/1200x300'}
                  alt={community.name}
                  sx={{ objectFit: "cover" }}
                />
                <Box 
                  sx={{ 
                    position: "absolute", 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    height: "50%",
                    display: "flex",
                    alignItems: "flex-end",
                    p: 3
                  }}
                >
                  <Typography 
                    variant="h3" 
                    fontWeight="700" 
                    sx={{ 
                      color: "white",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                    }}
                  >
                    {community.name}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ mb: 2, color: "#555" }}>
                  {community.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PeopleAltIcon sx={{ color: "#2D31FA", fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="500" sx={{ color: "#2D31FA" }}>
                      {community.members?.length || 0} members
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ArticleIcon sx={{ color: "#2D31FA", fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="500" sx={{ color: "#2D31FA" }}>
                      {posts.length} posts
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              fontWeight="700"
              color="#2D31FA"
              sx={{ letterSpacing: "0.02em" }}
            >
              Community Posts
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePost}
              sx={{
                bgcolor: "#2D31FA",
                px: 3,
                py: 1.2,
                borderRadius: "50px",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                boxShadow: "0 4px 10px rgba(45, 49, 250, 0.3)",
                "&:hover": {
                  bgcolor: "#2024c9",
                },
              }}
            >
              Create Post
            </Button>
          </motion.div>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
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
              onClick={() => handlePostClick(post._id)}
              style={{ cursor: "pointer" }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(77, 97, 252, 0.1)",
                  border: "1px solid rgba(77, 97, 252, 0.08)",
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={post.banner || 'https://via.placeholder.com/400x200'}
                  alt={post.title}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      minHeight: "3rem"
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical"
                    }}
                  >
                    {post.content}
                  </Typography>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 28, 
                          height: 28,
                          bgcolor: "rgba(45, 49, 250, 0.1)",
                          color: "#2D31FA",
                          fontSize: "0.8rem",
                          fontWeight: "bold"
                        }}
                      >
                        {post.author?.firstName?.[0]}{post.author?.lastName?.[0]}
                      </Avatar>
                      <Typography variant="caption" sx={{ color: "#555" }}>
                        {post.author?.firstName} {post.author?.lastName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FavoriteIcon sx={{ color: "#ff4081", fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: "#555" }}>
                        {post.likes || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
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

export default CommunityBlogs;