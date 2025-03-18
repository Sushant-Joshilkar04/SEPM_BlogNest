import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Hero from './pages/HeroPage';
import ProtectedRoute from './ProtectedRoute';
import ClickSpark from './components/ClickSpark';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import About from './pages/About'
import Contact from './pages/Contact'
import Preloader from './components/Preloader';
import Community from './pages/Community';
import Profile from './pages/Profile';
import CreateBlog from './pages/CreateBlog';
import Blog from './pages/Blog'
import UserBlog from './pages/UserBlog';
import NotFound from './pages/NotFound';

// Create a wrapper component to handle layout
const AppLayout = ({ children }) => {
  const location = useLocation();
  const is404Page = location.pathname !== '/' && !Object.keys(routes).includes(location.pathname);

  if (is404Page) {
    return children;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

// Define your routes object for easy checking
const routes = {
  '/': Hero,
  '/login': Login,
  '/signup': Signup,
  '/about': About,
  '/contact': Contact,
  '/dashboard': Dashboard,
  '/join-community': Community,
  '/create-blog': CreateBlog,
  '/profile': Profile,
  '/blog': Blog,
  '/profile/blog': UserBlog,
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <Preloader />
      ) : (
        <div>
          <ClickSpark />
          <AppLayout>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path='/join-community' element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path='/create-blog' element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
              <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/blog/:id" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
              <Route path="/profile/blog/:id" element={<ProtectedRoute><UserBlog /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </div>
      )}
    </Router>
  );
};

export default App;
