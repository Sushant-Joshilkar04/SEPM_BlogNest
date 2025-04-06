import React, { useState, useEffect, useRef } from 'react';
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
  InputLabel,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Plus, Image as ImageIcon, Bold, Italic } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Uploadfile from '../utils/UploadFile';
import { UserDock } from '../components/Dock';
import Groq from "groq-sdk"; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [genAiInput, setGenAiInput] = useState('Hi');
  const [openAIDialog, setOpenAIDialog] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const contentEditorRef = useRef(null);

  const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

  async function generateUsingAi() {
    try {
      setIsGenerating(true);
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: genAiInput,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });
      
      const generatedText = chatCompletion.choices[0]?.message?.content || "No response received from the AI.";
      setGeneratedContent(generatedText);
    } catch (error) {
      console.error("Error generating AI completion:", error);
      setError("Failed to generate content with AI");
    } finally {
      setIsGenerating(false);
    }
  }

  const handleAcceptContent = () => {
    setContent(generatedContent);
    setOpenAIDialog(false);
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/community/getUserCommunities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setCommunities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user communities:', error);
      toast.error('Failed to load your communities');
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
    e.stopPropagation();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Function to handle formatting
  const applyFormatting = (format) => {
    const textarea = contentEditorRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newContent = content;
    
    let prefix = '';
    let suffix = '';
    
    switch (format) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        break;
      case 'italic':
        prefix = '_';
        suffix = '_';
        break;
      default:
        return;
    }
    
    newContent = 
      content.substring(0, start) + 
      prefix + selectedText + suffix + 
      content.substring(end);
    
    setContent(newContent);
    
    // Focus back on textarea after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          applyFormatting('bold');
          break;
        case 'i':
          e.preventDefault();
          applyFormatting('italic');
          break;
        default:
          break;
      }
    }
  };
  
  // Function to convert markdown to HTML (for preview)
  const parseMarkdown = (text) => {
    if (!text) return '';
    
    // Bold: **text** or __text__
    let formattedText = text.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
    
    // Italic: *text* or _text_
    formattedText = formattedText.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
    
    return formattedText;
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) {
        toast.error("Please login to create a blog");
        navigate('/login');
        return;
      }

      const blogData = {
        title: title.trim(),
        content: content.trim(),
        tags: JSON.stringify(tags),
        community: community || null,
        bannerUrl: imageUrl,
        isDraft: isDraft
      };

      const response = await axios.post(
        "http://localhost:5000/api/posts/createpost",
        blogData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Show different toast messages based on isDraft
        toast.success(isDraft ? "Blog saved as draft!" : "Blog published successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Navigate after a delay to allow toast to be visible
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

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
              Create New Blog
            </Typography>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Alert 
                  severity="error" 
                  onClose={() => setError('')}
                  sx={{ 
                    borderRadius: 2,
                    mb: 3,
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" 
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Alert 
                  severity="success" 
                  onClose={() => setSuccess('')}
                  sx={{ 
                    borderRadius: 2,
                    mb: 3,
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" 
                  }}
                >
                  {success}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Box 
            sx={{ 
              display: "grid", 
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4
            }}
          >
            {/* Left Column - Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  minHeight: "420px",
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
                        height: "350px",
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
                        Upload Blog Banner
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
            </motion.div>

            {/* Right Column - Blog Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "white",
                  boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
                  border: "1px solid rgba(77, 97, 252, 0.08)"
                }}
              >
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          sx={{
                            background: "rgba(45, 49, 250, 0.06)",
                            borderColor: "rgba(45, 49, 250, 0.3)",
                            color: "#2D31FA",
                            fontWeight: 500,
                          }}
                          size="small"
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(e);
                          }
                        }}
                        placeholder="Add a tag and press enter"
                        variant="outlined"
                        size="small"
                        fullWidth
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
                      <IconButton
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        size="small"
                        sx={{
                          color: "#2D31FA",
                          bgcolor: "rgba(45, 49, 250, 0.08)",
                          "&.Mui-disabled": {
                            color: "rgba(0, 0, 0, 0.26)"
                          },
                          "&:hover": {
                            bgcolor: "rgba(45, 49, 250, 0.14)"
                          }
                        }}
                      >
                        <Plus size={20} />
                      </IconButton>
                    </Box>
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel id="community-select-label" sx={{ "&.Mui-focused": { color: "#2D31FA" } }}>
                      Community (Optional)
                    </InputLabel>
                    <Select
                      labelId="community-select-label"
                      value={community}
                      onChange={(e) => setCommunity(e.target.value)}
                      label="Community (Optional)"
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
                      <MenuItem value="">None</MenuItem>
                      {communities.length === 0 ? (
                        <MenuItem disabled value="">
                          <em>Join communities to post there</em>
                        </MenuItem>
                      ) : (
                        communities.map((comm) => (
                          <MenuItem key={comm._id} value={comm._id}>
                            {comm.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                      Blog Content
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Bold (Ctrl+B)">
                          <IconButton 
                            onClick={() => applyFormatting('bold')}
                            size="small"
                            sx={{
                              color: "#2D31FA",
                              "&:hover": { bgcolor: "rgba(45, 49, 250, 0.08)" }
                            }}
                          >
                            <Bold size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Italic (Ctrl+I)">
                          <IconButton 
                            onClick={() => applyFormatting('italic')}
                            size="small"
                            sx={{
                              color: "#2D31FA",
                              "&:hover": { bgcolor: "rgba(45, 49, 250, 0.08)" }
                            }}
                          >
                            <Italic size={18} />
                          </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => setOpenAIDialog(true)}
                        sx={{
                          color: "#2D31FA",
                          borderColor: "rgba(45, 49, 250, 0.5)",
                          "&:hover": {
                            borderColor: "#2D31FA",
                            bgcolor: "rgba(45, 49, 250, 0.04)"
                          }
                        }}
                      >
                        Generate using AI ✨
                      </Button>
                    </Box>
                    <TextField
                      inputRef={contentEditorRef}
                      multiline
                      rows={8}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      variant="outlined"
                      fullWidth
                      required
                      error={!content.trim()}
                      helperText={!content.trim() ? 'Content is required' : 'Use **text** for bold and _text_ for italic, or use Ctrl+B and Ctrl+I shortcuts'}
                      placeholder="Write your blog content here..."
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
                    
                    {content && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                          Preview
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "rgba(45, 49, 250, 0.02)",
                            border: "1px solid rgba(45, 49, 250, 0.08)"
                          }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}></div>
                        </Paper>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ flexGrow: 1 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleSubmit(false)}
                          disabled={loading || !title.trim() || !content.trim() || !banner}
                          fullWidth
                          sx={{
                            bgcolor: "#2D31FA",
                            py: 1.5,
                            borderRadius: "50px",
                            textTransform: "none",
                            fontSize: "1rem",
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
                          {loading ? 'Publishing...' : 'Publish Blog'}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ flexGrow: 1 }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleSubmit(true)}
                          disabled={loading}
                          fullWidth
                          sx={{
                            color: "#2D31FA",
                            py: 1.5,
                            borderRadius: "50px",
                            borderColor: "rgba(45, 49, 250, 0.5)",
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                            "&:hover": {
                              borderColor: "#2D31FA",
                              bgcolor: "rgba(45, 49, 250, 0.04)"
                            }
                          }}
                        >
                          Save as Draft
                        </Button>
                      </motion.div>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </Container>

        {/* AI Content Generation Dialog */}
        <Dialog 
          open={openAIDialog} 
          onClose={() => setOpenAIDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 25px rgba(77, 97, 252, 0.15)",
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Generate Blog Content with AI</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={genAiInput}
              onChange={(e) => setGenAiInput(e.target.value)}
              placeholder="Enter your prompt for the AI..."
              sx={{ mb: 2, mt: 1 }}
            />
            
            {generatedContent && (
              <TextField
                fullWidth
                multiline
                rows={8}
                value={generatedContent}
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(77, 97, 252, 0.02)"
                  }
                }}
              />
            )}
            
            {isGenerating && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress sx={{ color: "#2D31FA" }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button 
              onClick={() => setOpenAIDialog(false)}
              sx={{ color: "text.secondary" }}
            >
              Cancel
            </Button>
            {!generatedContent ? (
              <Button
                onClick={generateUsingAi}
                disabled={isGenerating || !genAiInput.trim()}
                variant="contained"
                sx={{
                  bgcolor: "#2D31FA",
                  "&:hover": { bgcolor: "#2024c9" }
                }}
              >
                Generate
              </Button>
            ) : (
              <Button
                onClick={handleAcceptContent}
                variant="contained"
                sx={{
                  bgcolor: "#2D31FA",
                  "&:hover": { bgcolor: "#2024c9" }
                }}
              >
                Use This Content
              </Button>
            )}
          </DialogActions>
        </Dialog>

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
    </Box>
  );
};

export default CreateBlog;