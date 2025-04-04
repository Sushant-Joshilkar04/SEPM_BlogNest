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
import { ThumbUp, ThumbUpOffAlt, Flag, FlagOutlined, AccessTime, Person } from '@mui/icons-material';
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
  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      checkUserInteractions();
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
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

  const checkUserInteractions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Check if user has liked the post
      const likeResponse = await axios.get(
        `http://localhost:5000/api/posts/checklike/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (likeResponse.data.success) {
        setIsLiked(likeResponse.data.isLiked);
      }

      // Check if user has reported the post
      const reportResponse = await axios.get(
        `http://localhost:5000/api/posts/checkreport/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (reportResponse.data.success) {
        setIsReported(reportResponse.data.isReported);
      }
    } catch (error) {
      console.error('Error checking user interactions:', error);
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

      const endpoint = isLiked ? 'removelike' : 'addlike';
      const response = await axios.post(
        `http://localhost:5000/api/posts/${endpoint}`,
        { 
          postId: id,
          id: user._id 
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Toggle the like state
        setIsLiked(!isLiked);
        
        // Update post like count
        setPost(prev => ({
          ...prev,
          likes: isLiked ? Math.max((prev.likes || 0) - 1, 0) : (prev.likes || 0) + 1
        }));
        
        setSnackbar({
          open: true,
          message: isLiked ? 'Post unliked successfully!' : 'Post liked successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      let errorMessage = 'Failed to update like status';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else {

        errorMessage = error.message || errorMessage;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleReport = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Please login to report posts',
          severity: 'error'
        });
        return;
      }

      const endpoint = isReported ? 'unreportpost' : 'reportpost';
      const response = await axios.post(
        `http://localhost:5000/api/posts/${endpoint}`,
        { postId: id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Toggle the report state
        setIsReported(!isReported);
        setReportDialogOpen(false);
        
        setSnackbar({
          open: true,
          message: isReported ? 'Post unreported successfully' : 'Post reported successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error toggling report:', error);
      let errorMessage = 'Failed to update report status';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || errorMessage;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
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
            src={post.banner || "https://via.placeholder.com/1200x600/f0f2ff/2D31FA?text=BlogNest"}
            alt={post.title}
            sx={{
              width: "100%",
              height: { xs: "200px", sm: "300px", md: "400px" },
              objectFit: "contain",
              objectPosition: "center",
              backgroundColor: "#f0f2ff",
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
                      sx={{
                        bgcolor: isLiked ? "rgba(45, 49, 250, 0.1)" : "transparent",
                        "&:hover": {
                          bgcolor: "rgba(45, 49, 250, 0.08)"
                        }
                      }}
                    >
                      {isLiked ? (
                        <ThumbUp sx={{ color: "#2D31FA", fontSize: 22 }} />
                      ) : (
                        <ThumbUpOffAlt sx={{ color: "#888", fontSize: 22 }} />
                      )}
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
                        bgcolor: isReported ? "rgba(211, 47, 47, 0.08)" : "rgba(211, 47, 47, 0.08)"
                      }
                    }}
                  >
                    {isReported ? (
                      <Flag sx={{ color: "#d32f2f", fontSize: 22 }} />
                    ) : (
                      <FlagOutlined sx={{ color: "#888", fontSize: 22 }} />
                    )}
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
          {isReported ? 'Unreport Post' : 'Report Post'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1">
            {isReported 
              ? 'Are you sure you want to remove your report from this post?'
              : 'Are you sure you want to report this post?'}
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
              bgcolor: isReported ? "#2D31FA" : "#d32f2f",
              "&:hover": {
                bgcolor: isReported ? "#2024c9" : "#b71c1c"
              }
            }}
          >
            {isReported ? 'Unreport' : 'Report'}
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