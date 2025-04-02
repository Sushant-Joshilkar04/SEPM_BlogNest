import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserDock } from '../components/Dock';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Paper, 
  Alert,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Uploadfile from '../utils/UploadFile';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCommunity = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        setError('Image size should be less than 5MB');
        return;
      }
      handleImageUpload(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleImageUpload = async (file) => {
    setLoading(true);
    try {
      const uploadedImage = await Uploadfile(file);
      setImageUrl(uploadedImage.secure_url);
      setBanner(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image.");
    }
    setLoading(false);
  };

  const handleRemoveImage = () => {
    setBanner(null);
    setPreview(null);
    setImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) {
        setError('Please login to create a community');
        return;
      }

      if (!imageUrl) {
        setError('Please upload a banner image');
        setLoading(false);
        return;
      }

      const communityData = {
        name: name.trim(),
        description: description.trim(),
        banner: imageUrl,
        category,
        creator: user._id
      };

      const response = await axios.post(
        'http://localhost:5000/api/community/createcommunity',
        communityData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Community created successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Navigate after toast is shown
        setTimeout(() => {
          navigate('/community');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to create community');
      }
    } catch (error) {
      console.error('Error creating community:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Failed to create community');
      } else if (error.request) {
        toast.error('No response from server. Please try again.');
      } else {
        toast.error('Error creating community. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, pt: 8, pb: 4 }}>
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
              textAlign: "center",
              mb: 5,
              letterSpacing: "0.02em",
            }}
          >
            Create New Community
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              bgcolor: "white",
              boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
              border: "1px solid rgba(77, 97, 252, 0.08)",
              mb: 3
            }}
          >
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

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Banner Image Upload */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                  Community Banner
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    minHeight: "200px",
                    p: 3,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px dashed",
                    borderColor: preview ? "rgba(77, 97, 252, 0.2)" : "rgba(0, 0, 0, 0.12)",
                    bgcolor: "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: preview ? "rgba(77, 97, 252, 0.3)" : "rgba(77, 97, 252, 0.2)"
                    },
                    boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)"
                  }}
                >
                  {preview ? (
                    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                      <Box
                        component="img"
                        src={preview}
                        alt="Preview"
                        sx={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: 2,
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
                        }}
                      />
                      <IconButton
                        onClick={handleRemoveImage}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(255, 255, 255, 0.9)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 1)"
                          }
                        }}
                        size="small"
                      >
                        <X size={18} color="#d32f2f" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        textAlign: "center", 
                        cursor: "pointer" 
                      }} 
                      onClick={() => document.getElementById('banner-upload').click()}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ImageIcon size={64} className="mx-auto mb-4" style={{ color: "rgba(77, 97, 252, 0.6)" }} />
                        <Typography variant="h6" color="#333" gutterBottom fontWeight={600}>
                          Upload Community Banner
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                          Drag and drop or click to select (Max 5MB)
                        </Typography>
                      </motion.div>
                    </Box>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="banner-upload"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="banner-upload">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<Upload size={18} />}
                        sx={{
                          mt: 2,
                          color: "#2D31FA",
                          borderColor: "rgba(77, 97, 252, 0.5)",
                          "&:hover": {
                            borderColor: "#2D31FA",
                            bgcolor: "rgba(77, 97, 252, 0.04)"
                          }
                        }}
                      >
                        {preview ? "Change Image" : "Select Image"}
                      </Button>
                    </motion.div>
                  </label>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                  Community Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter a name for your community"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2D31FA"
                      }
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#2D31FA"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Describe what your community is about"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2D31FA"
                      }
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#2D31FA"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                  Category
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    displayEmpty
                    required
                    sx={{
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.23)"
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2D31FA"
                      }
                    }}
                  >
                    <MenuItem value="" disabled>Select a category</MenuItem>
                    <MenuItem value="Technology">Technology</MenuItem>
                    <MenuItem value="Science">Science</MenuItem>
                    <MenuItem value="Arts">Arts</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    type="button"
                    onClick={() => navigate(-1)}
                    variant="outlined"
                    sx={{
                      color: "#555",
                      py: 1.2,
                      px: 4,
                      borderRadius: "50px",
                      borderColor: "rgba(0, 0, 0, 0.23)",
                      textTransform: "none",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#555",
                        bgcolor: "rgba(0, 0, 0, 0.04)"
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !name.trim() || !description.trim() || !category || !banner}
                    sx={{
                      bgcolor: "#2D31FA",
                      py: 1.2,
                      px: 4,
                      borderRadius: "50px",
                      textTransform: "none",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      boxShadow: "0 4px 10px rgba(45, 49, 250, 0.3)",
                      "&:hover": {
                        bgcolor: "#2024c9",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "rgba(45, 49, 250, 0.4)",
                        color: "#fff"
                      }
                    }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? 'Creating...' : 'Create Community'}
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </Paper>
        </motion.div>
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

      <UserDock />
    </Box>
  );
};

export default CreateCommunity;