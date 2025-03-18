import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          <Navbar/>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='/join-community' element={<ProtectedRoute> <Community /> </ProtectedRoute>}/>
            <Route path='/create-blog' element={<ProtectedRoute> <CreateBlog /> </ProtectedRoute>}/>
            <Route path='/user-profile' element={<ProtectedRoute> <Profile /> </ProtectedRoute>}/>
          </Routes>
          <Footer/>
        </div>
      )}
    </Router>
  );
};

export default App;
