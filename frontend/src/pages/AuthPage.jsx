import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FaGoogle, FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
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
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        firstName: username.split(' ')[0],
        lastName: username.split(' ')[1] || '',
        email: email,
        password: password,
        confirmPassword: confirmPassword
      });
      
      if (response.data.success) {
        toast.success('Signup successful! Please login.');
        setIsRegisterActive(false);
        
        setLoginEmail(email);
        setLoginPassword(password);
        setError('');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Registration failed');
      toast.error(err.response?.data?.message || 'Registration failed');
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 " style={{ background: 'linear-gradient(90deg, #e2e2e2, #c9d6ff)' }}>
      {isMobile && (
        <div className="fixed top-4 left-0 right-0 flex justify-center z-50">
          <div className="bg-white px-4 py-2 rounded-full shadow-md">
            <button
              onClick={() => setIsRegisterActive(!isRegisterActive)}
              className="text-blue-500 font-medium"
            >
              {isRegisterActive ? 'Switch to Login' : 'Switch to Register'}
            </button>
          </div>
        </div>
      )}
      
      <div className="relative w-full max-w-5xl h-[550px] bg-white rounded-3xl shadow-xl overflow-hidden">

        <div 
          className={`absolute inset-0 flex transition-transform duration-700 ease-in-out ${
            isRegisterActive ? 'translate-x-[-50%]' : 'translate-x-0'
          }`}
          style={{ width: '200%' }}
        >
          {/* Login Panel */}
          <div className="flex min-w-[50%] h-full">
            {/* Left Blue Panel - Login State */}
            <div className="w-1/2 bg-blue-400 flex flex-col justify-center items-center text-white p-8">
                <h1 className="text-4xl font-bold mb-2">Hello, Welcome!</h1>
                <p className="mb-6 text-center">Don't have an account?</p>
                <button 
                    onClick={() => setIsRegisterActive(true)}
                    className="px-10 py-2 border-2 border-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
                >
                    Register
                </button>
            </div>

            <div className="w-1/2 flex flex-col justify-center items-center p-8">
                <div className="w-full max-w-md"></div>
              <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
                
                {error && !isRegisterActive && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="relative">
                    <input 
                      type="email" 
                      className="w-full bg-gray-100 rounded-lg py-3 px-4 pl-12 outline-none"
                      placeholder="Username"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>

                  <div className="relative">
                    <select
                      className="w-full bg-gray-100 rounded-lg py-3 px-4 pl-12 outline-none appearance-none cursor-pointer"
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  
                    <div className="relative">
                    <input 
                      type="password" 
                      className="w-full bg-gray-100 rounded-lg py-3 px-4 pl-12 outline-none"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  
                  <div className="text-right">
                    <a href="#" className="text-sm text-gray-600 hover:text-blue-500">Forgot Password?</a>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
                
                {/* <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-3">or login with social platforms</p>
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaGoogle className="text-xl text-red-500" />
                    </a>
                    <a href="#" className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaFacebook className="text-xl text-blue-600" />
                    </a>
                    <a href="#" className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaGithub className="text-xl" />
                    </a>
                    <a href="#" className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaLinkedin className="text-xl text-blue-700" />
                    </a>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Register Panel */}
          <div className="flex min-w-[50%] h-full">
            {/* Register Form */}
            <div className="w-1/2 flex flex-col justify-center items-center p-8">
              <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Registration</h1>
                
                {error && isRegisterActive && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full bg-gray-100 rounded-lg py-3 px-4 pl-12 outline-none"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="email" 
                      className="w-full bg-gray-100 rounded-lg py-3 px-4 pl-12 outline-none"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="password" 
                      className="w-full bg-gray-100 rounded-lg py-3 px-4 pl-12 outline-none"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="password" 
                      className="w-full bg-gray-100 rounded-lg py-3 px-4 pl-12 outline-none"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </form>
              </div>
            </div>
            {/* Right Blue Panel - Register State */}
            <div className="w-1/2 bg-blue-400 flex flex-col justify-center items-center text-white p-8">
              <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
              <p className="mb-6 text-center">Already have an account?</p>
              <button 
                onClick={() => setIsRegisterActive(false)}
                className="px-10 py-2 border-2 border-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
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
