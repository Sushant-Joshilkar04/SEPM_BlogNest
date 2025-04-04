import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserDock } from '../components/Dock';
import axios from 'axios';
import { Box, Container, Typography, Button, Card, CardMedia, CardContent, CircularProgress, Avatar, Chip, Grid, TextField, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArticleIcon from '@mui/icons-material/Article';
import SearchIcon from '@mui/icons-material/Search';

const CommunityBlogs = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const defaultImage = "https://via.placeholder.com/400x200/f0f2ff/2D31FA?text=BlogNest";

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

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pt: 8, pb: 4 }}>
        {community && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Card 
              sx={{ 
                mb: 4, 
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 8px 25px rgba(77, 97, 252, 0.12)",
                border: "1px solid rgba(77, 97, 252, 0.08)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h4" 
                  fontWeight="700" 
                  sx={{ 
                    color: "#2D31FA",
                    mb: 1.5,
                  }}
                >
                  {community.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mb: 2, fontSize: "0.9rem" }}>
                  {community.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PeopleAltIcon sx={{ color: "#2D31FA", fontSize: 16 }} />
                    <Typography variant="caption" fontWeight="500" sx={{ color: "#2D31FA" }}>
                      {community.members?.length || 0} members
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ArticleIcon sx={{ color: "#2D31FA", fontSize: 16 }} />
                    <Typography variant="caption" fontWeight="500" sx={{ color: "#2D31FA" }}>
                      {posts.length} posts
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h4"
                fontWeight="700"
                color="#2D31FA"
                sx={{ letterSpacing: "0.02em", mb: 2 }}
              >
                Community Posts
              </Typography>
            </motion.div>

            <TextField
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                maxWidth: 400,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "white",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2D31FA"
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

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

        <Grid container spacing={2}>
          {filteredPosts.map((post, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={post._id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => handlePostClick(post._id)}
                style={{ height: '100%', cursor: 'pointer' }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(77, 97, 252, 0.1)",
                    border: "1px solid rgba(77, 97, 252, 0.08)",
                    transition: "box-shadow 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                    }
                  }}
                >
                  <Box sx={{ position: "relative", height: "120px" }}>
                    <CardMedia
                      component="img"
                      image={post.banner || defaultImage}
                      alt={post.title}
                      sx={{ 
                        height: "100%", 
                        objectFit: "cover",
                        objectPosition: "center"  
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: "#333",
                        fontSize: "1rem",
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.3
                      }}
                    >
                      {post.title}
                    </Typography>
                    
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                      <Avatar 
                        sx={{ 
                          width: 20, 
                          height: 20,
                          bgcolor: "rgba(45, 49, 250, 0.1)",
                          color: "#2D31FA",
                          fontSize: "0.6rem",
                          fontWeight: "bold"
                        }}
                      >
                        {post.author?.firstName?.[0]}{post.author?.lastName?.[0]}
                      </Avatar>
                      <Typography variant="caption" sx={{ color: "#666", fontSize: "0.7rem" }}>
                        {post.author?.firstName} {post.author?.lastName}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: "flex", 
                      flexWrap: "wrap", 
                      gap: 0.5, 
                      mt: "auto"
                    }}>
                      {post.tags?.slice(0, 2).map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          size="small"
                          sx={{ 
                            background: "rgba(45, 49, 250, 0.06)",
                            borderColor: "rgba(45, 49, 250, 0.3)",
                            color: "#2D31FA",
                            fontWeight: 500,
                            height: "20px",
                            fontSize: "0.7rem",
                          }}
                        />
                      ))}
                      {post.tags?.length > 2 && (
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          +{post.tags.length - 2} more
                        </Typography>
                      )}
                    </Box>
                    
                    <Box sx={{ 
                      display: "flex", 
                      justifyContent: "flex-end", 
                      mt: 1.5
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FavoriteIcon sx={{ color: "#ff4081", fontSize: 14, mr: 0.5 }} />
                        <Typography variant="caption" sx={{ color: "#555", fontSize: "0.7rem" }}>
                          {post.likes || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                  </motion.div>
            </Grid>
          ))}
        </Grid>
        
        {filteredPosts.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No posts found in this community.
            </Typography>
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

export default CommunityBlogs;