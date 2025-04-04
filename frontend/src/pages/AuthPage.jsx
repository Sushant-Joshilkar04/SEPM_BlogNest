import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FaGoogle, FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = () => {
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userRole, setUserRole] = useState('user');

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
        role: userRole
      });
      
      if (response.data.token) {
        const token = response.data.token;
        const user = response.data.user;
        
        // Store auth data without role verification
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userRole', userRole); // Store selected role
  
        // Show success toast and navigate
        toast.success(`Login successful!`, {
          onClose: () => {
            // Redirect based on selected role
            if (userRole === 'admin') {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          }
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!username.includes(' ')) {
      toast.error('Please enter both first name and last name with a space between them');
      return;
    }

    const [firstName, ...lastNameParts] = username.split(' ');
    const lastName = lastNameParts.join(' ');

    if (!firstName || !lastName) {
      toast.error('Please enter both first name and last name');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      });
      
      // Check if registration was successful
      if (response.data) {
        toast.success('Registration successful! Please login with your credentials', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset form and switch to login after a short delay
        setTimeout(() => {
          setIsRegisterActive(false);
          setLoginEmail(email);
          setLoginPassword('');
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }, 1000);
      }
    } catch (err) {
      console.error('Register error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateLoginForm = () => {
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return false;
    }
    
    if (!['user', 'admin'].includes(userRole)) {
      toast.error('Please select a valid role');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const validateRegisterForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      await handleLogin(e);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      await handleRegister(e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 relative overflow-hidden" 
      style={{ background: 'linear-gradient(90deg, #f0f2ff 0%, #e6e9ff 100%)' }}>
      
      {/* Wave Background */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 z-0"
        style={{ 
          background: 'linear-gradient(180deg, rgba(77, 97, 252, 0.1) 0%, rgba(77, 97, 252, 0.4) 100%)',
          borderTopLeftRadius: '50% 40%',
          borderTopRightRadius: '50% 40%',
          transform: 'scale(1.5)'
        }}>
      </div>
      
      {isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-24 left-0 right-0 flex justify-center z-50"
        >
          <div className="bg-white px-4 py-2 rounded-full shadow-md border border-[rgba(77,97,252,0.1)]">
            <button
              onClick={() => setIsRegisterActive(!isRegisterActive)}
              className="text-[#2D31FA] font-medium"
            >
              {isRegisterActive ? 'Switch to Login' : 'Switch to Register'}
            </button>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-5xl h-[550px] bg-white rounded-3xl shadow-xl overflow-hidden z-10"
        style={{ 
          boxShadow: '0px 10px 30px rgba(45, 49, 250, 0.1)',
          border: '1px solid rgba(77, 97, 252, 0.1)'
        }}
      >
        <div 
          className={`absolute inset-0 flex transition-transform duration-700 ease-in-out ${
            isRegisterActive ? 'translate-x-[-50%]' : 'translate-x-0'
          }`}
          style={{ width: '200%' }}
        >
          {/* Login Panel */}
          <div className="flex min-w-[50%] h-full">
            {/* Left Blue Panel - Login State */}
            <div className="w-1/2 flex flex-col justify-center items-center text-white p-8"
              style={{ background: 'linear-gradient(135deg, #2D31FA, #5D61FF)' }}
            >
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl font-bold mb-2"
              >
                Hello, Welcome!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6 text-center"
              >
                Don't have an account?
              </motion.p>
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRegisterActive(true)}
                className="px-10 py-2 border-2 border-white rounded-full hover:bg-white/10 transition-colors font-semibold"
              >
                Register
              </motion.button>
            </div>

            <div className="w-1/2 flex flex-col justify-center items-center p-8">
              <div className="w-full max-w-md">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl font-bold text-[#2D31FA] mb-6"
                >
                  Login
                </motion.h1>
                
                {error && !isRegisterActive && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-100"
                  >
                    {error}
                  </motion.div>
                )}
                
                <motion.form 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  onSubmit={handleLoginSubmit} 
                  className="space-y-4"
                >
                  <div className="relative">
                    <input 
                      type="email" 
                      className="w-full bg-[rgba(77,97,252,0.05)] rounded-lg py-3 px-4 pl-12 outline-none border border-[rgba(77,97,252,0.1)] focus:border-[#2D31FA] transition-colors"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D31FA]" />
                  </div>

                  <div className="relative">
                    <select
                      className="w-full bg-[rgba(77,97,252,0.05)] rounded-lg py-3 px-4 pl-12 outline-none border border-[rgba(77,97,252,0.1)] focus:border-[#2D31FA] transition-colors appearance-none cursor-pointer"
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D31FA]" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2D31FA]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="password" 
                      className="w-full bg-[rgba(77,97,252,0.05)] rounded-lg py-3 px-4 pl-12 outline-none border border-[rgba(77,97,252,0.1)] focus:border-[#2D31FA] transition-colors"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D31FA]" />
                  </div>
                  
                  <div className="text-right">
                    <a href="#" className="text-sm text-[#2D31FA] hover:underline">Forgot Password?</a>
                  </div>
                  
                  <motion.button 
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-[#2D31FA] hover:bg-[#2024c9] text-white py-3 rounded-full font-semibold transition-colors"
                    style={{ boxShadow: '0 4px 10px rgba(45, 49, 250, 0.3)' }}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </motion.button>
                </motion.form>
              </div>
            </div>
          </div>

          {/* Register Panel */}
          <div className="flex min-w-[50%] h-full">
            {/* Register Form */}
            <div className="w-1/2 flex flex-col justify-center items-center p-8">
              <div className="w-full max-w-md">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl font-bold text-[#2D31FA] mb-6"
                >
                  Registration
                </motion.h1>
                
                {error && isRegisterActive && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-100"
                  >
                    {error}
                  </motion.div>
                )}
                
                <motion.form 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  onSubmit={handleRegisterSubmit} 
                  className="space-y-4"
                >
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full bg-[rgba(77,97,252,0.05)] rounded-lg py-3 px-4 pl-12 outline-none border border-[rgba(77,97,252,0.1)] focus:border-[#2D31FA] transition-colors"
                      placeholder="Enter first name and last name (e.g. John Doe)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D31FA]" />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="email" 
                      className="w-full bg-[rgba(77,97,252,0.05)] rounded-lg py-3 px-4 pl-12 outline-none border border-[rgba(77,97,252,0.1)] focus:border-[#2D31FA] transition-colors"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D31FA]" />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="password" 
                      className="w-full bg-[rgba(77,97,252,0.05)] rounded-lg py-3 px-4 pl-12 outline-none border border-[rgba(77,97,252,0.1)] focus:border-[#2D31FA] transition-colors"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D31FA]" />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="password" 
                      className="w-full bg-[rgba(77,97,252,0.05)] rounded-lg py-3 px-4 pl-12 outline-none border border-[rgba(77,97,252,0.1)] focus:border-[#2D31FA] transition-colors"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D31FA]" />
                  </div>
                  
                  <motion.button 
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-[#2D31FA] hover:bg-[#2024c9] text-white py-3 rounded-full font-semibold transition-colors"
                    style={{ boxShadow: '0 4px 10px rgba(45, 49, 250, 0.3)' }}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </motion.button>
                </motion.form>
              </div>
            </div>
            {/* Right Blue Panel - Register State */}
            <div className="w-1/2 flex flex-col justify-center items-center text-white p-8"
              style={{ background: 'linear-gradient(135deg, #2D31FA, #5D61FF)' }}
            >
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl font-bold mb-2"
              >
                Welcome Back!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6 text-center"
              >
                Already have an account?
              </motion.p>
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRegisterActive(false)}
                className="px-10 py-2 border-2 border-white rounded-full hover:bg-white/10 transition-colors font-semibold"
              >
                Login
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
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
      />
    </div>
  );
};

export default AuthPage;
