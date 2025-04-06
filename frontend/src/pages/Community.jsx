import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserDock } from '../components/Dock';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardMedia, 
  CardContent, 
  CircularProgress,
  TextField,
  InputAdornment,
  Grid,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Community = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [joiningInProgress, setJoiningInProgress] = useState(null);

  useEffect(() => {
    fetchCommunities();
    fetchUserJoinedCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/community/getAllCommunities');
      if (response.data.success) {
        setCommunities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      setError('Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserJoinedCommunities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/community/getUserCommunities', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Store IDs of joined communities for easy checking
        const joinedIds = response.data.data.map(community => community._id);
        setJoinedCommunities(joinedIds);
      }
    } catch (error) {
      console.error('Error fetching joined communities:', error);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to join communities');
        return;
      }

      setJoiningInProgress(communityId);
      
      const response = await axios.post(
        'http://localhost:5000/api/community/joinCommunity',
        { communityId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Add to joined communities
        setJoinedCommunities([...joinedCommunities, communityId]);
        toast.success('Successfully joined community!');
      }
    } catch (error) {
      console.error('Error joining community:', error);
      toast.error(error.response?.data?.message || 'Failed to join community');
    } finally {
      setJoiningInProgress(null);
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to leave communities');
        return;
      }

      setJoiningInProgress(communityId);
      
      const response = await axios.post(
        'http://localhost:5000/api/community/leaveCommunity',
        { communityId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Remove from joined communities
        setJoinedCommunities(joinedCommunities.filter(id => id !== communityId));
        toast.success('Left community successfully');
      }
    } catch (error) {
      console.error('Error leaving community:', error);
      toast.error(error.response?.data?.message || 'Failed to leave community');
    } finally {
      setJoiningInProgress(null);
    }
  };

  const handleCreateCommunity = () => {
    toast.info('Creating new community...', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate('/create-community');
  };

  const handleCommunityClick = (communityId) => {
    if (!communityId) {
        console.error('No community ID provided');
        return;
    }
    console.log('Navigating to community:', communityId);
    navigate(`/community/${communityId}/blogs`);
  };

  const isJoined = (communityId) => joinedCommunities.includes(communityId);

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
          <Box>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h3"
                fontWeight="700"
                color="#2D31FA"
                sx={{
                  letterSpacing: "0.02em",
                  mb: 2
                }}
              >
                Browse communities
              </Typography>
            </motion.div>
            <TextField
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                maxWidth: 400,
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
                    <SearchIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateCommunity}
              sx={{
                bgcolor: "#2D31FA",
                px: 3,
                py: 1.2,
                borderRadius: "50px",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                boxShadow: "0 4px 10px rgba(45, 49, 250, 0.3)",
                "&:hover": {
                  bgcolor: "#2024c9",
                },
              }}
            >
              Create Community
            </Button>
          </motion.div>
        </Box>

        <Grid container spacing={2}>
          {filteredCommunities.map((community, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={community._id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => handleCommunityClick(community._id)}
                style={{ height: '100%' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(77, 97, 252, 0.1)",
                    border: "1px solid rgba(77, 97, 252, 0.08)",
                    transition: "box-shadow 0.3s ease",
                    cursor: "pointer",
                    maxWidth: "100%",
                    "&:hover": {
                      boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                    }
                  }}
                >
                  <Box sx={{ position: "relative", height: "120px", overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      image={community.banner || 'https://via.placeholder.com/400x200'}
                      alt={community.name}
                      sx={{ 
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center" 
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: "#333",
                        mb: 1,
                        fontSize: "1rem",
                        lineHeight: 1.3
                      }}
                    >
                      {community.name}
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
                        WebkitBoxOrient: "vertical",
                        fontSize: "0.8rem",
                        flexGrow: 1,
                        lineHeight: 1.4
                      }}
                    >
                      {community.description}
                    </Typography>
                    
                    <Divider sx={{ my: 1, borderColor: "rgba(45, 49, 250, 0.08)" }} />
                    
                    <Box 
                      sx={{ 
                        display: "flex", 
                        flexDirection: "column",
                        gap: 1
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center"
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <PeopleAltIcon sx={{ fontSize: 16, color: "#2D31FA" }} />
                          <Typography variant="caption" sx={{ color: "#2D31FA", fontWeight: 500 }}>
                            {community.members?.length || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <ArticleIcon sx={{ fontSize: 16, color: "#2D31FA" }} />
                          <Typography variant="caption" sx={{ color: "#2D31FA", fontWeight: 500 }}>
                            {community.posts?.length || 0}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Button
                        variant={isJoined(community._id) ? "outlined" : "contained"}
                        size="small"
                        startIcon={isJoined(community._id) ? <CheckCircleIcon /> : null}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isJoined(community._id)) {
                            handleLeaveCommunity(community._id);
                          } else {
                            handleJoinCommunity(community._id);
                          }
                        }}
                        sx={{
                          mt: 1,
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          py: 0.5,
                          ...(isJoined(community._id) 
                            ? {
                                color: "#2D31FA",
                                borderColor: "rgba(45, 49, 250, 0.5)",
                                "&:hover": { borderColor: "#2D31FA", bgcolor: "rgba(45, 49, 250, 0.04)" }
                              }
                            : {
                                bgcolor: "#2D31FA",
                                "&:hover": { bgcolor: "#2024c9" }
                              }
                          )
                        }}
                        disabled={joiningInProgress === community._id}
                      >
                        {joiningInProgress === community._id ? (
                          <CircularProgress size={14} sx={{ color: isJoined(community._id) ? "#2D31FA" : "white" }} />
                        ) : (
                          isJoined(community._id) ? "Joined" : "Join Community"
                        )}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
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

export default Community;
