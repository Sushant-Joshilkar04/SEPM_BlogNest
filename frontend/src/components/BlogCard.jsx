import { Card, CardContent, Avatar, Typography, Box, Chip } from "@mui/material";
import { motion } from "framer-motion";

const cardVariants = {
  hover: { 
    scale: 1.03, 
    boxShadow: "0px 10px 25px rgba(45, 49, 250, 0.15)",
    transition: { duration: 0.3 }
  },
};

const blogs = [
  {
    avatar: "https://source.unsplash.com/100x100/?face",
    title: "The Future of Web Development",
    description: "Exploring the latest trends and frameworks shaping the modern web.",
    author: "John Doe",
    date: "March 12, 2025",
    category: "Technology",
  },
  {
    avatar: "https://source.unsplash.com/100x100/?person",
    title: "How AI is Transforming Blogging",
    description: "A deep dive into AI-generated content and its impact on digital publishing.",
    author: "Jane Smith",
    date: "March 10, 2025",
    category: "AI & Blogging",
  },
  {
    avatar: "https://source.unsplash.com/100x100/?developer",
    title: "Best Practices for Writing Technical Blogs",
    description: "Tips and tricks to make your technical blogs more engaging and informative.",
    author: "Emily Carter",
    date: "March 8, 2025",
    category: "Writing & Tech",
  },
];

const BlogCard = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
      gap={4}
      mt={6}
      mb={6}
      px={2}
    >
      {blogs.map((blog, index) => (
        <motion.div key={index} whileHover="hover" variants={cardVariants}>
          <Card 
            sx={{ 
              borderRadius: "12px", 
              overflow: "hidden",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: "1px solid rgba(77, 97, 252, 0.1)",
              background: "white",
              transition: "all 0.3s ease",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box 
              sx={{ 
                p: 3, 
                pb: 2, 
                display: "flex", 
                alignItems: "center", 
                borderBottom: "1px solid rgba(77, 97, 252, 0.1)" 
              }}
            >
              <Avatar
                src={blog.avatar}
                alt={blog.author}
                sx={{ 
                  width: 50, 
                  height: 50, 
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" 
                }}
              />
              <Box sx={{ ml: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#333"
                  }}
                >
                  {blog.author}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#666",
                    fontSize: "0.75rem"
                  }}
                >
                  {blog.date}
                </Typography>
              </Box>
            </Box>
            
            <CardContent sx={{ p: 3, pt: 2, flexGrow: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1.5,
                  color: "#2D31FA",
                  lineHeight: 1.3
                }}
              >
                {blog.title}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#555", 
                  mb: 2,
                  lineHeight: 1.5
                }}
              >
                {blog.description}
              </Typography>
              
              <Chip 
                label={blog.category} 
                size="small" 
                sx={{ 
                  backgroundColor: "rgba(77, 97, 252, 0.1)", 
                  color: "#2D31FA",
                  fontWeight: 500,
                  borderRadius: "50px"
                }} 
              />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};

export default BlogCard;
