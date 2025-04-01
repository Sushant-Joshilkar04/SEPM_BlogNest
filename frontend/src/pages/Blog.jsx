import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box,
  Container,
  Typography, 
  IconButton, 
  Chip, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { ThumbUp, Flag, AccessTime, Person } from '@mui/icons-material';
import { UserDock } from '../components/Dock';
import axios from 'axios';

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchPost();
    checkIfLiked();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/getpost/${id}`);
      if (response.data.success) {
        setPost(response.data.data[0]); 
        
        // Add impression
        await axios.post('http://localhost:5000/api/posts/addimpressions', { postId: id });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.likedPosts) {
      setIsLiked(user.likedPosts.includes(id));
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) {
        setSnackbar({
          open: true,
          message: 'Please login to like posts',
          severity: 'error'
        });
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/posts/addlike',
        { 
          postId: id,
          id: user._id 
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setIsLiked(true);
        setPost(prev => ({
          ...prev,
          likes: (prev.likes || 0) + 1
        }));
        setSnackbar({
          open: true,
          message: 'Post liked successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setSnackbar({
        open: true,
        message: 'Failed to like post',
        severity: 'error'
      });
    }
  };

  const handleReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) {
        setSnackbar({
          open: true,
          message: 'Please login to report posts',
          severity: 'error'
        });
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/posts/reportpost',
        { postId: id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setReportDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Post reported successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      setSnackbar({
        open: true,
        message: 'Failed to report post',
        severity: 'error'
      });
    }
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

  if (error || !post) {
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
          {error || 'Post not found'}
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
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3, 
            overflow: "hidden",
            bgcolor: "white",
            border: "1px solid rgba(77, 97, 252, 0.08)",
            boxShadow: "0 8px 25px rgba(77, 97, 252, 0.12)",
          }}
        >
          {/* Banner Image */}
          <Box 
            component="img"
            src={post.banner}
            alt={post.title}
            sx={{
              width: "100%",
              height: { xs: "200px", sm: "300px", md: "400px" },
              objectFit: "cover",
            }}
          />

          {/* Content Section */}
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  color: "#333",
                  mb: 3,
                  wordBreak: "break-word"
                }}
              >
                {post.title}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person sx={{ color: "#2D31FA", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    {post.author?.firstName} {post.author?.lastName || 'Unknown Author'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime sx={{ color: "#2D31FA", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
                {post.tags?.map((tag, idx) => (
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
              </Box>

              <Divider sx={{ my: 4, borderColor: "rgba(0, 0, 0, 0.08)" }} />

              <Typography 
                variant="body1" 
                sx={{ 
                  color: "#444",
                  lineHeight: 1.8,
                  fontSize: "1.05rem",
                  whiteSpace: "pre-line"
                }}
              >
                {post.content}
              </Typography>

              <Divider sx={{ my: 4, borderColor: "rgba(0, 0, 0, 0.08)" }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <IconButton 
                      onClick={handleLike}
                      disabled={isLiked}
                      sx={{
                        bgcolor: isLiked ? "rgba(45, 49, 250, 0.1)" : "transparent",
                        "&:hover": {
                          bgcolor: "rgba(45, 49, 250, 0.08)"
                        }
                      }}
                    >
                      <ThumbUp 
                        sx={{ 
                          color: isLiked ? "#2D31FA" : "#888",
                          fontSize: 22
                        }} 
                      />
                    </IconButton>
                  </motion.div>
                  <Typography variant="body2" fontWeight="500" sx={{ color: "#555" }}>
                    {post.likes || 0} likes
                  </Typography>
                </Box>
                
                <motion.div whileHover={{ scale: 1.1 }}>
                  <IconButton 
                    onClick={() => setReportDialogOpen(true)}
                    sx={{
                      "&:hover": {
                        bgcolor: "rgba(211, 47, 47, 0.08)"
                      }
                    }}
                  >
                    <Flag sx={{ color: "#d32f2f", fontSize: 22 }} />
                  </IconButton>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </Paper>
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

      {/* Report Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: "#f8f9ff", color: "#333", fontWeight: 600 }}>
          Report Post
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1">
            Are you sure you want to report this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setReportDialogOpen(false)}
            sx={{ 
              color: "#555",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)"
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleReport} 
            variant="contained"
            sx={{ 
              bgcolor: "#d32f2f",
              "&:hover": {
                bgcolor: "#b71c1c"
              }
            }}
          >
            Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            width: "100%" 
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <UserDock />
    </Box>
  );
};

export default Blog;