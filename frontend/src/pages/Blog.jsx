import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
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
  Snackbar 
} from '@mui/material';
import { motion } from 'framer-motion';
import { ThumbUp, Flag } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
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
        console.log(response.data.data[0])
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
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error || !post) {
    return (
      <Typography color="error" className="text-center mt-8">
        {error || 'Post not found'}
      </Typography>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:ml-64 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full h-[400px] rounded-lg overflow-hidden"
            >
              <img
                src={post.banner}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <Typography variant="h4" gutterBottom>
                {post.title}
              </Typography>
              
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                By {[post.author?.firstName, " ",post.author?.lastName]|| 'Unknown Author'}
              </Typography>

              <div className="flex flex-wrap gap-2 my-4">
                {post.tags?.map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={tag}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </div>

              <Typography variant="body1" className="mt-4 flex-grow">
                {post.content}
              </Typography>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <IconButton 
                    color={isLiked ? "primary" : "default"}
                    onClick={handleLike}
                    disabled={isLiked}
                  >
                    <ThumbUp />
                  </IconButton>
                  <Typography variant="body2">
                    {post.likes || 0} likes
                  </Typography>
                </div>
                
                <IconButton 
                  color="error" 
                  onClick={() => setReportDialogOpen(true)}
                >
                  <Flag />
                </IconButton>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Report Dialog */}
        <Dialog
          open={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
        >
          <DialogTitle>Report Post</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to report this post? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReport} color="error">Report</Button>
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
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
};

export default Blog;