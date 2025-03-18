import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  IconButton, 
  Box, 
  Chip, 
  CircularProgress, 
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Uploadfile from '../utils/UploadFile';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState('');
  const [community, setCommunity] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/community/getallcommunities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setCommunities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

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
      setSuccess("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image.");
    }
    setLoading(false);
  };

  const handleRemoveImage = () => {
    setBanner(null);
    setPreview(null);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (isDraft = false) => {
    try {
        setError("");
        setSuccess("");
        setLoading(true);

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
            setError("Please login to create a blog");
            navigate('/login');
            return;
        }

        const blogData = {
            title: title.trim(),
            content: content.trim(),
            tags: JSON.stringify(tags),
            community: community || null,
            bannerUrl: imageUrl,
            isDraft
            // Note: Don't need to send id in blogData as it will be extracted from token
        };

        const response = await fetch("http://localhost:5000/api/posts/createpost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(blogData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create blog");
        }

        if (data.success) {
            setSuccess(isDraft ? "Blog saved as draft!" : "Blog published successfully!");
            setTimeout(() => navigate('/dashboard'), 2000);
        }
    } catch (error) {
        console.error("Error:", error);
        setError(error.message || "Failed to create blog");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 md:ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <Typography variant="h4" className="mb-6 text-center font-bold">
            Create New Blog
          </Typography>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white hover:border-blue-500 transition-colors"
            >
              {preview ? (
                <div className="relative w-full h-full">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-[300px] object-cover rounded-lg shadow-lg"
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white shadow-lg hover:bg-red-50"
                    size="small"
                  >
                    <X className="text-red-500" />
                  </IconButton>
                </div>
              ) : (
                <div className="text-center cursor-pointer" onClick={() => document.getElementById('banner-upload').click()}>
                  <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Upload Blog Banner
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Drag and drop or click to select (Max 5MB)
                  </Typography>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="banner-upload"
              />
              <label htmlFor="banner-upload">
                <Button
                  variant="outlined"
                  component="span"
                  className="mt-4"
                  startIcon={<Upload />}
                >
                  Select Image
                </Button>
              </label>
            </motion.div>

            {/* Right Column - Blog Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-sm"
            >
              <TextField
                label="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                fullWidth
                required
                error={!title.trim()}
                helperText={!title.trim() ? 'Title is required' : ''}
                placeholder="Enter an engaging title for your blog"
              />

              <div className="flex flex-col gap-2">
                <Typography variant="subtitle2" className="font-semibold">Tags</Typography>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </div>
                <form onSubmit={handleAddTag} className="flex gap-2">
                  <TextField
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag and press enter"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <IconButton
                    type="submit"
                    color="primary"
                    disabled={!tagInput.trim()}
                    size="small"
                  >
                    <Plus />
                  </IconButton>
                </form>
              </div>

              <FormControl fullWidth>
                <InputLabel>Community (Optional)</InputLabel>
                <Select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  label="Community (Optional)"
                >
                  <MenuItem value="">None</MenuItem>
                  {communities.map((comm) => (
                    <MenuItem key={comm._id} value={comm._id}>
                      {comm.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="flex flex-col gap-2">
                <Typography variant="subtitle2" className="font-semibold">Blog Content</Typography>
                <TextField
                  multiline
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  variant="outlined"
                  fullWidth
                  required
                  error={!content.trim()}
                  helperText={!content.trim() ? 'Content is required' : ''}
                  placeholder="Write your blog content here..."
                  className="mb-4"
                />
              </div>

              <div className="flex gap-4 mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmit(false)}
                  disabled={loading || !title.trim() || !content.trim() || !banner}
                  fullWidth
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Publishing...' : 'Publish Blog'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  fullWidth
                >
                  Save as Draft
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateBlog;