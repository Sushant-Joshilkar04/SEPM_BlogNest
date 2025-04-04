import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import { AdminDock } from '../components/Dock';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalReports: 0,
    blogsDeleted: 0,
    totalBlogs: 0,
    pendingBlogs: 0,
    highlyReportedBlogs: 0,
    totalUsers: 0
  });
  const [blogTrendData, setBlogTrendData] = useState({
    labels: [],
    datasets: []
  });
  const [communityTrendData, setCommunityTrendData] = useState({
    labels: [],
    datasets: []
  });
  const [reportTypeData, setReportTypeData] = useState({
    labels: [],
    datasets: []
  });
  const [topReportedBlogs, setTopReportedBlogs] = useState([]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    if (!token || userRole !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/auth');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all posts
        const postsResponse = await axios.get('http://localhost:5000/api/posts/getallpost', { headers });
        const posts = postsResponse.data.data;

        // Fetch all users
        const usersResponse = await axios.get('http://localhost:5000/api/auth/getalluser', { headers });
        const users = usersResponse.data.data;

        // Fetch reported posts
        const reportedResponse = await axios.get('http://localhost:5000/api/auth/getreportedpost', { headers });
        const reportedPosts = reportedResponse.data.data;

        // Fetch all communities
        const communitiesResponse = await axios.get('http://localhost:5000/api/community/getallcommunities', { headers });
        const communities = communitiesResponse.data.data;

        // Calculate dashboard stats
        const stats = {
          totalReports: posts.reduce((sum, post) => sum + (post.reportCount || 0), 0),
          blogsDeleted: posts.filter(post => !post.isValid).length,
          totalBlogs: posts.length,
          pendingBlogs: reportedPosts.length,
          highlyReportedBlogs: posts.filter(post => post.reportCount >= 10).length,
          totalUsers: users.filter(user => user.role === 'user').length
        };
        setDashboardStats(stats);

        // Process blog trend data (last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const blogTrends = {
          labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
          datasets: [{
            label: 'Blogs Posted',
            data: last7Days.map(date => 
              posts.filter(post => 
                post.createdAt.split('T')[0] === date
              ).length
            ),
            borderColor: '#2D31FA',
            backgroundColor: 'rgba(45, 49, 250, 0.2)',
            tension: 0.4
          }]
        };
        setBlogTrendData(blogTrends);

        // Process community post trends (last 7 days)
        const communityTrends = {
          labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
          datasets: [{
            label: 'Community Posts',
            data: last7Days.map(date => 
              posts.filter(post => 
                post.createdAt.split('T')[0] === date && post.community
              ).length
            ),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            tension: 0.4
          }]
        };
        setCommunityTrendData(communityTrends);

        // Get top reported blogs
        const sortedReportedBlogs = [...posts]
          .filter(post => post.reportCount > 0)
          .sort((a, b) => (b.reportCount || 0) - (a.reportCount || 0))
          .slice(0, 5)
          .map(post => ({
            title: post.title,
            reports: post.reportCount,
            author: post.author?.email
          }));
        setTopReportedBlogs(sortedReportedBlogs);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

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
        display: "flex",
        flexDirection: "column",
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
          height: "40%",
          background: "linear-gradient(180deg, rgba(77, 97, 252, 0.1) 0%, rgba(77, 97, 252, 0.02) 100%)",
          borderBottomLeftRadius: "50% 40%",
          borderBottomRightRadius: "50% 40%",
          transform: "scale(1.5)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, pt: 8, pb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            fontWeight="800"
            color="#2D31FA"
            sx={{
              mb: 4,
              letterSpacing: "0.02em",
              fontSize: { xs: '2.5rem', md: '3rem' },
              textTransform: "uppercase"
            }}
          >
            Admin Dashboard
          </Typography>
        </motion.div>
          
          {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "white",
                  height: "100%",
                  boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
                  border: "1px solid rgba(77, 97, 252, 0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total Reports
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#333">
                    {dashboardStats.totalReports}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "white",
                  height: "100%",
                  boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
                  border: "1px solid rgba(77, 97, 252, 0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Blogs Deleted
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#333">
                    {dashboardStats.blogsDeleted}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "white",
                  height: "100%",
                  boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
                  border: "1px solid rgba(77, 97, 252, 0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total Blogs
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#333">
                    {dashboardStats.totalBlogs}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "white",
                  height: "100%",
                  boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
                  border: "1px solid rgba(77, 97, 252, 0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Pending Approval
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#333">
                    {dashboardStats.pendingBlogs}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

          {/* Charts Grid */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "white",
                  height: "100%",
                  boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
                  border: "1px solid rgba(77, 97, 252, 0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h5" 
                    fontWeight="600" 
                    color="#333" 
                    sx={{ mb: 3 }}
                  >
                    Blog Post Trends
                  </Typography>
                  <Line 
                    data={blogTrendData} 
                    options={{ 
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            font: {
                              family: "'Poppins', sans-serif",
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 10,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }} 
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  overflow: "hidden",
                  background: "white",
                  height: "100%",
                  boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
                  border: "1px solid rgba(77, 97, 252, 0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h5" 
                    fontWeight="600" 
                    color="#333" 
                    sx={{ mb: 3 }}
                  >
                    Community Post Trends
                  </Typography>
                  <Line 
                    data={communityTrendData} 
                    options={{ 
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            font: {
                              family: "'Poppins', sans-serif",
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 10,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }} 
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

          {/* Top Reported Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              overflow: "hidden",
              background: "white",
              boxShadow: "0 8px 25px rgba(77, 97, 252, 0.08)",
              border: "1px solid rgba(77, 97, 252, 0.08)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 30px rgba(45, 49, 250, 0.15)",
              },
              mb: 4
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                fontWeight="600" 
                color="#333" 
                sx={{ mb: 3 }}
              >
                Top Reported Blogs
              </Typography>
              
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          color: "#555", 
                          borderBottom: "2px solid rgba(77, 97, 252, 0.1)" 
                        }}
                      >
                        Blog Title
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          fontWeight: 600, 
                          color: "#555", 
                          borderBottom: "2px solid rgba(77, 97, 252, 0.1)" 
                        }}
                      >
                        Reports
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topReportedBlogs.length > 0 ? (
                      topReportedBlogs.map((blog, index) => (
                        <TableRow 
                          key={index}
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': { bgcolor: 'rgba(77, 97, 252, 0.03)' }
                          }}
                        >
                          <TableCell sx={{ py: 2 }}>{blog.title}</TableCell>
                          <TableCell 
                            align="right" 
                            sx={{ 
                              color: "#d32f2f", 
                              fontWeight: 600, 
                              py: 2 
                            }}
                          >
                            {blog.reports}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                          <Typography variant="body1" color="text.secondary">
                            No reported blogs
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
      
      {/* Wave Background - Bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(180deg, rgba(77, 97, 252, 0.02) 0%, rgba(77, 97, 252, 0.1) 100%)",
          borderTopLeftRadius: "50% 40%",
          borderTopRightRadius: "50% 40%",
          transform: "scale(1.5)",
          zIndex: 0,
        }}
      />

      <AdminDock />
    </Box>
  );
};

export default Admin;
