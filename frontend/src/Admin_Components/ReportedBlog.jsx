import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminDock } from '../components/Dock';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';

const ReportedBlog = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [blogId,setBlogId] = useState('');

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  function clickhandler() {
    console.log("clicked");
    navigate(`/blog/${blogId}`);
  }

    const fetchReportedPosts = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
        setError('Unauthorized: No token found');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/auth/getreportedpost', {
        headers: { Authorization: `Bearer ${token}` }, 
      });

      if (response.data.success) {
        console.log('Reported posts:', response.data.data);
        setBlogId(response.data.data[0]._id);
      setReportedPosts(response.data.data);
      } else {
        setError('Failed to fetch reported posts');
      }
    } catch (error) {
      console.error('Error fetching reported posts:', error);
      setError('Failed to fetch reported posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        'http://localhost:5000/api/posts/removepost',
        {
        headers: { Authorization: `Bearer ${token}` },
          data: { postId }
        }
      );

      if (response.data.success) {
        setReportedPosts(reportedPosts.filter(post => post._id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };

  const handleDismissReport = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/auth/approvepost',
        { postId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setReportedPosts(reportedPosts.filter(post => post._id !== postId));
      }
    } catch (error) {
      console.error('Error dismissing report:', error);
      setError('Failed to dismiss report');
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
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
          height: "40%",
          background: "linear-gradient(180deg, rgba(77, 97, 252, 0.1) 0%, rgba(77, 97, 252, 0.02) 100%)",
          borderBottomLeftRadius: "50% 40%",
          borderBottomRightRadius: "50% 40%",
          transform: "scale(1.5)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, pt: 8, pb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            fontWeight="800"
            color="#2D31FA"
            sx={{
              mb: 5,
              letterSpacing: "0.02em",
              fontSize: { xs: '2.5rem', md: '3rem' },
              textTransform: "uppercase"
            }}
          >
            Reported Posts
          </Typography>
        </motion.div>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)"
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
          
          {reportedPosts.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: "center", 
              py: 10,
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
              border: "1px solid rgba(77, 97, 252, 0.08)"
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ReportIcon sx={{ fontSize: 60, color: "rgba(77, 97, 252, 0.2)", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
              No reported posts found.
              </Typography>
            </motion.div>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {reportedPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
                    border: "1px solid rgba(77, 97, 252, 0.08)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                    }
                  }}
                  onClick={clickhandler}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={post.banner || 'https://via.placeholder.com/400x200'}
                    alt={post.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        color: "#333",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        fontSize: "1rem",
                        lineHeight: 1.4
                      }}
                    >
                      {post.title}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: "#666",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        fontSize: "0.8rem"
                      }}
                    >
                          By {post.author && post.author.firstName ? 
         `${post.author.firstName} ${post.author.lastName || ''}` : 
         'Unknown Author'}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<DeleteIcon sx={{ fontSize: 18 }} />}
                        onClick={() => handleDeletePost(post._id)}
                        fullWidth
                        size="small"
                        sx={{
                          bgcolor: "#d32f2f",
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          fontSize: "0.8rem",
                          "&:hover": {
                            bgcolor: "#b71c1c"
                          }
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                        onClick={() => handleDismissReport(post._id)}
                        fullWidth
                        size="small"
                        sx={{
                          borderColor: "rgba(0, 0, 0, 0.23)",
                          color: "#555",
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          fontSize: "0.8rem",
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.04)",
                            borderColor: "rgba(0, 0, 0, 0.23)"
                          }
                        }}
                      >
                        Dismiss
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
          height: "40%",
          background: "linear-gradient(180deg, rgba(77, 97, 252, 0.02) 0%, rgba(77, 97, 252, 0.1) 100%)",
          borderTopLeftRadius: "50% 40%",
          borderTopRightRadius: "50% 40%",
          transform: "scale(1.5)",
          zIndex: 0,
        }}
      />

      <AdminDock />
    </Box>
  );
};

export default ReportedBlog;
