import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box,
  Container,
  Card, 
  CardContent, 
  CardMedia,
  Chip, 
  Avatar, 
  Button,
  CircularProgress,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Delete, Article, Publish } from '@mui/icons-material';
import { UserDock } from '../components/Dock';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDrafts, setShowDrafts] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [success, setSuccess] = useState('');
  const [publishedCount, setPublishedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);
  const [selectedView, setSelectedView] = useState('blogs'); // 'blogs', 'drafts', 'communities'

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))._id;
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:5000/api/auth/getuser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const userData = response.data.data[0];
        setUser(userData);
        
        // Calculate counts
        const drafts = userData.posts.filter(post => post.isDraft).length;
        const published = userData.posts.filter(post => !post.isDraft).length;
        const communities = userData.communities?.length || 0;
        
        setDraftCount(drafts);
        setPublishedCount(published);
        setCommunityCount(communities);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/posts/deletepost', {
        headers: { Authorization: `Bearer ${token}` },
        data: { postId }
      });
      
      toast.success('Post deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchUserProfile(); // Refresh profile after deletion
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    }
  };

  const handleEditClick = (post) => {
    setEditedTitle(post.title);
    setEditedPost(post);
    setEditedContent(post.content);
    setEditMode(true);
  };

  const handlePublishDraft = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(localStorage.getItem('user'))._id;
      await axios.put('http://localhost:5000/api/posts/publishdraft', 
        { 
          postId,
          id: userId
        },
        { 
          headers: {  
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          } 
        }
      );

      toast.success('Draft published successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      fetchUserProfile(); // Refresh the profile to update the lists
      setShowDrafts(false); // Switch to posts view after publishing
    } catch (error) {
      console.error('Error publishing draft:', error);
      toast.error(error.response?.data?.message || 'Failed to publish draft');
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Update title
      await axios.put('http://localhost:5000/api/posts/updateposttitle', 
        { postId: editedPost._id, title: editedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update content
      await axios.put('http://localhost:5000/api/posts/updatepostcontent', 
        { postId: editedPost._id, content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditMode(false);
      setEditedPost(null);
      fetchUserProfile();
      setSuccess('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post');
    }
  };

  const getFilteredContent = () => {
    switch(selectedView) {
      case 'blogs':
        return user?.posts?.filter(post => !post.isDraft) || [];
      case 'drafts':
        return user?.posts?.filter(post => post.isDraft) || [];
      case 'communities':
        return user?.communities || [];
      default:
        return [];
    }
  };

  const filteredContent = getFilteredContent();

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
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Header */}
            <Card 
              elevation={0}
              sx={{ 
                mb: 6, 
                borderRadius: 3,
                overflow: "hidden",
                background: "white",
                boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
                border: "1px solid rgba(77, 97, 252, 0.08)"
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Avatar 
                    src={user?.avatar} 
                    alt={user?.name}
                    sx={{ 
                      width: 100, 
                      height: 100,
                      border: "4px solid rgba(77, 97, 252, 0.1)" 
                    }}
                  />
                  <Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: "#333",
                        mb: 0.5
                      }}
                    >
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      {user?.email}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight="600"
                          sx={{ color: "#2D31FA" }}
                        >
                          {publishedCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Published
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight="600"
                          sx={{ color: "#2D31FA" }}
                        >
                          {draftCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Drafts
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight="600"
                          sx={{ color: "#2D31FA" }}
                        >
                          {communityCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Communities
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography 
                variant="h4"
                fontWeight="700"
                color="#2D31FA"
                sx={{
                  letterSpacing: "0.02em",
                }}
              >
                {selectedView === 'drafts' ? 'My Drafts' : selectedView === 'communities' ? 'My Communities' : 'My Blogs'}
              </Typography>
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                  sx={{
                    color: '#2D31FA',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2D31FA',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2D31FA',
                    },
                  }}
                >
                  <MenuItem value="blogs">My Blogs</MenuItem>
                  <MenuItem value="drafts">My Drafts</MenuItem>
                  <MenuItem value="communities">My Communities</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </motion.div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              gap: 4,
            }}
          >
            <AnimatePresence>
              {filteredContent.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.03, y: -5 }}
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
                    {post.banner && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={post.banner}
                        alt={post.title}
                        sx={{ objectFit: "cover" }}
                      />
                    )}
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: "#333",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical"
                        }}
                      >
                        {post.title}
                      </Typography>
                      
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 2 }}>
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

                      <Divider sx={{ my: 2, borderColor: "rgba(0, 0, 0, 0.06)" }} />

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <Button
                          startIcon={<Article />}
                          onClick={() => navigate(`/blog/${post._id}`)}
                          sx={{
                            color: "#2D31FA",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                              background: "rgba(45, 49, 250, 0.05)"
                            }
                          }}
                        >
                          View
                        </Button>
                        <Box>
                          <IconButton 
                            sx={{
                              color: "#2D31FA",
                              "&:hover": {
                                background: "rgba(45, 49, 250, 0.05)"
                              }
                            }}
                            onClick={() => handleEditClick(post)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          {post.isDraft && (
                            <IconButton 
                              sx={{
                                color: "#4caf50",
                                "&:hover": {
                                  background: "rgba(76, 175, 80, 0.05)"
                                }
                              }}
                              onClick={() => handlePublishDraft(post._id)}
                            >
                              <Publish fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton 
                            sx={{
                              color: "#d32f2f",
                              "&:hover": {
                                background: "rgba(211, 47, 47, 0.05)"
                              }
                            }}
                            onClick={() => handleDeleteBlog(post._id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
          
          {filteredContent.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                {selectedView === 'blogs' ? 'No posts found.' : 
                 selectedView === 'drafts' ? 'No drafts found.' : 
                 'No communities joined.'}
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

        {/* Edit Dialog */}
        <Dialog 
          open={editMode} 
          onClose={() => setEditMode(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Post</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                fullWidth
                multiline
                rows={6}
                variant="outlined"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditMode(false)} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              variant="contained" 
              sx={{ 
                bgcolor: "#2D31FA",
                "&:hover": { bgcolor: "#2024c9" }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Profile;