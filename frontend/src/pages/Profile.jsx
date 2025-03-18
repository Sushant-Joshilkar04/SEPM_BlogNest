import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Avatar, 
  Button,
  CircularProgress,
  IconButton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Delete, Article } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setUser(response.data.data[0]);
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
      fetchUserProfile(); // Refresh profile after deletion
    } catch (error) {
      console.error('Error deleting blog:', error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
     <Sidebar/>
      <main className="flex-1 p-4 md:ml-64 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Profile Header */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <Avatar 
                src={user?.avatar} 
                alt={user?.name}
                sx={{ width: 100, height: 100 }}
              />
              <div>
                <Typography variant="h4">{user?.name}</Typography>
                <Typography variant="body1" color="textSecondary">
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.posts?.length || 0} Posts
                </Typography>
              </div>
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <Typography variant="h5" gutterBottom>
            My Blogs
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {user?.posts?.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent>
                      <Typography variant="h6" gutterBottom className="line-clamp-2">
                        {post.title}
                      </Typography>
                      
                      <div className="flex flex-wrap gap-1 my-2">
                        {post.tags?.map((tag, idx) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </div>

                      <div className="flex justify-between mt-4">
                        <Button
                          startIcon={<Article />}
                          onClick={() => navigate(`/profile/blog/${post._id}`)}
                        >
                          View
                        </Button>
                        <div>
                          {/* <IconButton 
                            color="primary"
                            onClick={() => navigate(`/edit-blog/${post._id}`)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error"
                            onClick={() => handleDeleteBlog(post._id)}
                          >
                            <Delete />
                          </IconButton> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;