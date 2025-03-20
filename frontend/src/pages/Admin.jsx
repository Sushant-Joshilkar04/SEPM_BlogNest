import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);

  // Check if user is admin on component mount
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    if (!token || userRole !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const usersResponse = await axios.get('http://localhost:5000/api/auth/getalluser', { headers });
        setUsers(usersResponse.data.data);

        const reportedResponse = await axios.get('http://localhost:5000/api/auth/getreportedpost', { headers });
        setReportedPosts(reportedResponse.data.data);

      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Error loading admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleApprovePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/approvepost', 
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Post approved successfully');
      // Refresh reported posts
      const reportedResponse = await axios.get('http://localhost:5000/api/auth/getreportedpost');
      setReportedPosts(reportedResponse.data.data);
    } catch (error) {
      console.error('Error approving post:', error);
      toast.error('Failed to approve post');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Users Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b">Name</th>
                  <th className="px-6 py-3 border-b">Email</th>
                  <th className="px-6 py-3 border-b">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 border-b">{`${user.firstName} ${user.lastName}`}</td>
                    <td className="px-6 py-4 border-b">{user.email}</td>
                    <td className="px-6 py-4 border-b">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reported Posts Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Reported Posts</h2>
          <div className="space-y-4">
            {reportedPosts.map((post) => (
              <div key={post._id} className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-600 mt-2">{post.content}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleApprovePost(post._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
