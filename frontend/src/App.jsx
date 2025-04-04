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
import AuthPage from './pages/AuthPage';
import Admin from './pages/Admin';
import ReportedBlog from './Admin_Components/ReportedBlog';
import Admin_ManageUser from './Admin_Components/Admin_manageUser';
import CreateCommunity from './pages/CreateCommunity';
import CommunityBlogs from './pages/CommunityBlogs';


const AppLayout = ({ children }) => {
  const location = useLocation();
  const is404Page = location.pathname !== '/' && !Object.keys(routes).includes(location.pathname);
  
  const hasDock = [
    '/dashboard',
    '/join-community',
    '/create-blog',
    '/profile',
    '/admin',
    '/admin/reported-posts',
    '/admin/manage-users',
    '/blog',
    '/community',
    '/create-community',
    '/profile/blog'
  ].some(path => location.pathname.startsWith(path));
  

  if (is404Page) {
    return children;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Navbar />
      </header>
      <main className={`flex-grow ${hasDock ? 'pb-20' : ''}`}>
        {children}
      </main>
      {!hasDock && <Footer />}
    </div>
  );
};

const routes = {
  '/': Hero,
  '/login': Login,
  '/signup': Signup,
  '/auth': AuthPage,
  '/about': About,
  '/contact': Contact,
  '/dashboard': Dashboard,
  '/join-community': Community,
  '/create-blog': CreateBlog,
  '/profile': Profile,
  '/blog': Blog,
  '/profile/blog': UserBlog,
  '/admin': Admin,
  '/admin/reported-posts': ReportedBlog,
  '/admin/manage-users': Admin_ManageUser,
  '/community': Community,
  '/create-community': CreateCommunity,
  '/community/:communityId/blogs': CommunityBlogs
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <Preloader />
      ) : (
        <div className="min-h-screen bg-gray-50">
          <ClickSpark />
          <AppLayout>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/admin" element={<ProtectedRoute adminRoute={true}><Admin /></ProtectedRoute>} />
              <Route path="/admin/reported-posts" element={<ProtectedRoute adminRoute={true}><ReportedBlog /></ProtectedRoute>} />
              <Route path="/admin/manage-users" element={<ProtectedRoute adminRoute={true}><Admin_ManageUser /></ProtectedRoute>} />

              <Route path="/dashboard" element={<ProtectedRoute userRoute={true}><Dashboard /></ProtectedRoute>} />
              <Route path="/join-community" element={<ProtectedRoute userRoute={true}><Community /></ProtectedRoute>} />
              <Route path="/create-blog" element={<ProtectedRoute userRoute={true}><CreateBlog /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute userRoute={true}><Profile /></ProtectedRoute>} />
              <Route path="/blog/:id" element={<ProtectedRoute userRoute={true}><Blog /></ProtectedRoute>} />
              <Route path="/profile/blog/:id" element={<ProtectedRoute userRoute={true}><UserBlog /></ProtectedRoute>} />
              <Route path="/create-community" element={<ProtectedRoute userRoute={true}><CreateCommunity /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute userRoute={true}><Community /></ProtectedRoute>} />
              <Route path="/community/:communityId/blogs" element={<ProtectedRoute userRoute={true}><CommunityBlogs /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </div>
      )}
    </Router>
  );
};

export default App;
