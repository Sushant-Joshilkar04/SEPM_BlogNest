import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminDock } from '../components/Dock';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  TextField,
  InputAdornment,
  CircularProgress,
  Grid,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Admin_manageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
    const token = localStorage.getItem('token');
      if (!token) {
        setError('Unauthorized: No token found');
        setLoading(false);
      return;
    }

      const response = await axios.get('http://localhost:5000/api/auth/getalluser', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError('Failed to fetch users');
      }
      } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        'http://localhost:5000/api/auth/deleteuser',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId }
        }
      );

      if (response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const handleToggleAdmin = async (userId, currentRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/toggleadmin',
        { userId, role: currentRole === 'admin' ? 'user' : 'admin' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setUsers(users.map(user => 
          user._id === userId 
            ? { ...user, role: currentRole === 'admin' ? 'user' : 'admin' }
            : user
        ));
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
      setError('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              fontWeight="700"
              color="#2D31FA"
              sx={{
                letterSpacing: "0.02em",
              }}
            >
              Manage Users
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TextField
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#2D31FA" }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 2,
                  bgcolor: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(77, 97, 252, 0.2)"
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(77, 97, 252, 0.5)"
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2D31FA"
                  }
                }
              }}
              sx={{ width: { xs: '100%', sm: 250 } }}
            />
          </motion.div>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {filteredUsers.length === 0 ? (
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
              <PersonIcon sx={{ fontSize: 60, color: "rgba(77, 97, 252, 0.2)", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No users found.
              </Typography>
            </motion.div>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredUsers.map((user, index) => (
              <Grid item xs={12} md={6} lg={4} key={user._id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Card
                    sx={{
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
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar
                          src={user.avatar || 'https://via.placeholder.com/100'}
                          alt={user.firstName}
                          sx={{ 
                            width: 60, 
                            height: 60,
                            bgcolor: user.role === 'admin' ? "rgba(77, 97, 252, 0.1)" : "rgba(0, 0, 0, 0.04)",
                            border: user.role === 'admin' ? "2px solid rgba(77, 97, 252, 0.3)" : "none"
                          }}
                        />
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              color: "#333",
                              display: "flex",
                              alignItems: "center",
                              gap: 1
                            }}
                          >
                            {user.firstName} {user.lastName}
                            {user.role === 'admin' && (
                              <AdminPanelSettingsIcon 
                                sx={{ 
                                  color: "#2D31FA", 
                                  fontSize: 20 
                                }} 
                              />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2, borderColor: "rgba(0, 0, 0, 0.06)" }} />

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Chip 
                          label={user.role.toUpperCase()}
                          size="small"
                          sx={{ 
                            bgcolor: user.role === 'admin' ? "rgba(77, 97, 252, 0.1)" : "rgba(0, 0, 0, 0.04)",
                            color: user.role === 'admin' ? "#2D31FA" : "#555",
                            fontWeight: 600,
                            borderRadius: 1
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "#555",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5
                          }}
                        >
                          <Box 
                            component="span" 
                            sx={{ 
                              color: "#2D31FA",
                              fontWeight: 600 
                            }}
                          >
                            {user.posts?.length || 0}
                          </Box> 
                          posts
                        </Typography>
                      </Box>

                      {/* <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => handleToggleAdmin(user._id, user.role)}
                          sx={{
                            borderColor: user.role === 'admin' ? "rgba(245, 124, 0, 0.5)" : "rgba(77, 97, 252, 0.5)",
                            color: user.role === 'admin' ? "#F57C00" : "#2D31FA",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            py: 1,
                            "&:hover": {
                              borderColor: user.role === 'admin' ? "#F57C00" : "#2D31FA",
                              bgcolor: user.role === 'admin' ? "rgba(245, 124, 0, 0.04)" : "rgba(45, 49, 250, 0.04)"
                            }
                          }}
                        >
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleDeleteUser(user._id)}
                          sx={{
                            bgcolor: "#d32f2f",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            py: 1,
                            "&:hover": {
                              bgcolor: "#b71c1c"
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </Box> */}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
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

      <AdminDock />
    </Box>
  );
};

export default Admin_manageUser;
