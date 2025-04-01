import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserDock } from '../components/Dock';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const UserBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/getuser/${id}`);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts/getallpost');
      if (response.data.success) {
        const userPosts = response.data.data.filter(post => 
          post.author && post.author._id === id
        );
        setPosts(userPosts);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setError('Failed to fetch user posts');
    } finally {
      setLoading(false);
    }
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
          justifyContent: "center", 
          alignItems: "center",
          background: "linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)"
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
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
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card 
              elevation={0}
              sx={{ 
                mb: 6, 
                borderRadius: 3,
                p: 3,
                background: "white",
                boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
                border: "1px solid rgba(77, 97, 252, 0.08)"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
                <Avatar
                  src={user.avatar || 'https://via.placeholder.com/100'}
                  alt={user.firstName}
                  sx={{ 
                    width: 100, 
                    height: 100,
                    border: "4px solid rgba(77, 97, 252, 0.1)"
                  }}
                />
                <Box>
                  <Typography 
                    variant="h4" 
                    fontWeight={700}
                    color="#333"
                    sx={{ mb: 0.5 }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2, borderColor: "rgba(0, 0, 0, 0.06)" }} />
              
              <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#2D31FA"
                    }}
                  >
                    {posts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    posts
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#2D31FA"
                    }}
                  >
                    {user.followers?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    followers
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#2D31FA"
                    }}
                  >
                    {user.following?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    following
                  </Typography>
                </Box>
              </Box>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography
            variant="h4"
            fontWeight="700"
            color="#2D31FA"
            sx={{
              mb: 4,
              letterSpacing: "0.02em",
            }}
          >
            Posts
          </Typography>
            </motion.div>

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
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      minHeight: "3rem",
                      color: "#333"
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
                      <CalendarTodayIcon sx={{ color: "#2D31FA", fontSize: 16 }} />
                      <Typography variant="caption" sx={{ color: "#555" }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FavoriteIcon sx={{ color: "#ff4081", fontSize: 16 }} />
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
        
        {posts.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No posts found.
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

export default UserBlog;