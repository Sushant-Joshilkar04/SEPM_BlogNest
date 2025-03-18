import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  TextField, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { Edit, Delete, ArrowBack } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const UserBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/getpost/${id}`);
      if (response.data.success) {
        const postData = response.data.data[0];
        setPost(postData);
        setEditedTitle(postData.title);
        setEditedContent(postData.content);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Update title
      await axios.put('http://localhost:5000/api/posts/updateposttitle', 
        { postId: id, title: editedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update content
      await axios.put('http://localhost:5000/api/posts/updatepostcontent',
        { postId: id, content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditMode(false);
      fetchPost();
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/posts/deletepost', {
        headers: { Authorization: `Bearer ${token}` },
        data: { postId: id }
      });
      navigate('/profile');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
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
          <div className="mb-4 flex items-center justify-between">
            <IconButton onClick={() => navigate('/profile')}>
              <ArrowBack />
            </IconButton>
            <div>
              <IconButton color="primary" onClick={() => setEditMode(!editMode)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => setDeleteDialog(true)}>
                <Delete />
              </IconButton>
            </div>
          </div>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full h-[400px] rounded-lg overflow-hidden"
            >
              <img
                src={post?.banner}
                alt={post?.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              {editMode ? (
                <>
                  <TextField
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    label="Title"
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    label="Content"
                    multiline
                    rows={8}
                    fullWidth
                    margin="normal"
                  />
                  <div className="flex gap-2 mt-4">
                    <Button variant="contained" onClick={handleUpdate}>
                      Save Changes
                    </Button>
                    <Button onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Typography variant="h4" gutterBottom>
                    {post?.title}
                  </Typography>
                  <Typography variant="body1" className="mt-4">
                    {post?.content}
                  </Typography>
                </>
              )}
            </motion.div>
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
              <Button onClick={handleDelete} color="error">Delete</Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </main>
    </div>
  );
};

export default UserBlog;