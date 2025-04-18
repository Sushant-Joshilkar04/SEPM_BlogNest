import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Chip, CircularProgress, Card, CardContent, CardMedia, Grid, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDock } from '../components/Dock';
import SearchIcon from '@mui/icons-material/Search';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts/getallpost');
      if (response.data.success) {
        // Filter out draft posts and posts associated with communities
        const filteredPosts = response.data.data.filter(post => 
          !post.isDraft && !post.community
        );
        setPosts(filteredPosts);
        
        // Extract all unique tags
        const tagsSet = new Set();
        filteredPosts.forEach(post => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => tagsSet.add(tag));
          }
        });
        setAllTags(Array.from(tagsSet));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag) => {
    setActiveTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag) // Remove tag if already active
        : [...prev, tag] // Add tag if not active
    );
  };

  // Filter posts based on search query and active tags
  const filteredPosts = posts.filter(post => {
    // Check if post matches search query
    const matchesSearch = searchQuery === '' || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if post has all active tags
    const matchesTags = activeTags.length === 0 || 
      (post.tags && activeTags.every(tag => post.tags.includes(tag)));
    
    return matchesSearch && matchesTags;
  });

  const defaultImage = "https://via.placeholder.com/400x200/f0f2ff/2D31FA?text=BlogNest";

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
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          mb: 4,
          gap: 2
        }}>
          {/* Title on left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              fontWeight="700"
              color="#2D31FA"
              sx={{
                letterSpacing: "0.02em",
              }}
            >
              Latest Articles
            </Typography>
          </motion.div>

          {/* Search in middle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                width: "400px",
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
                    <SearchIcon sx={{ fontSize: 18, color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          {/* Tags on right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FormControl size="small" sx={{ width: "200px" }}>
              <InputLabel id="tags-select-label">Select Tags</InputLabel>
              <Select
                labelId="tags-select-label"
                multiple
                value={activeTags}
                onChange={(event) => setActiveTags(event.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          background: "#2D31FA",
                          color: "white",
                          fontSize: "0.75rem"
                        }}
                      />
                    ))}
                  </Box>
                )}
                sx={{
                  bgcolor: "white",
                }}
              >
                {allTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {activeTags.length > 0 && (
              <Chip
                label="Clear"
                size="small"
                variant="outlined"
                onClick={() => setActiveTags([])}
                sx={{ 
                  borderColor: "#ff4081",
                  color: "#ff4081",
                  fontSize: "0.75rem",
                  height: "24px",
                  '&:hover': {
                    background: "rgba(255, 64, 129, 0.08)",
                  }
                }}
              />
            )}
          </motion.div>
        </Box>

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
            {filteredPosts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredPosts.map((post, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={post._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      onClick={() => navigate(`/blog/${post._id}`)}
                      style={{ height: '100%', cursor: 'pointer' }}
                    >
                      <Card sx={{ 
                        height: "100%", 
                        borderRadius: 3, 
                        boxShadow: "0 8px 20px rgba(77, 97, 252, 0.1)",
                        border: "1px solid rgba(77, 97, 252, 0.08)",
                        transition: "box-shadow 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        "&:hover": {
                          boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                        }
                      }}>
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
                        <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", flexGrow: 1 }}>
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
                          
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: "#666",
                              fontSize: "0.8rem",
                              mb: 1.5
                            }}
                          >
                            By {post.author?.firstName || ''} {post.author?.lastName || 'Unknown'}
                          </Typography>
                          
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
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No articles found matching your search criteria
                </Typography>
              </Box>
            )}
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