import { Card, CardContent, Avatar, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const cardVariants = {
  hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
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
      gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
      gap={4}
      mt={4}
      justifyContent="center"
    >
      {blogs.map((blog, index) => (
        <motion.div key={index} whileHover="hover" variants={cardVariants}>
          <Card sx={{ borderRadius: "16px", padding: 2, textAlign: "center" }}>
            <Avatar
              src={blog.avatar}
              alt={blog.author}
              sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
            />
            <CardContent>
              <Typography variant="h6" fontWeight="bold">{blog.title}</Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                {blog.description}
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ mt: 1, color: "#1976d2" }}>
                {blog.category}
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                ✍️ {blog.author} • 📅 {blog.date}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};

export default BlogCard;
