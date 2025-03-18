import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../404/style.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page_404"
    >
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <motion.div 
                className="four_zero_four_bg"
                initial={{ scale: 0.5, y: -100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  duration: 0.6
                }}
              >
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  404
                </motion.h1>
              </motion.div>

              <motion.div 
                className="contant_box_404"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.4,
                  duration: 0.6
                }}
              >
                <h3 className="h2">Look like you're lost</h3>
                <p>The page you are looking for is not available!</p>
                <motion.a
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="link_404"
                >
                  Go to Home
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;