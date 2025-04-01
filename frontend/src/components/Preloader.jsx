import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import penPaperImage from '../assets/pen-paper.svg'; 


const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const LOADING_DURATION = 4000;

  useEffect(() => {
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / LOADING_DURATION) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    return () => {
      setProgress(0);
    };
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e8f0fe',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
  

      {/* Animated Pen and Paper */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          y: [0, -10, 0],
          filter: [
            'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))',
            'drop-shadow(0px 8px 16px rgba(25, 118, 210, 0.3))',
            'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1], 
        }}
        style={{
          width: '120px',
          height: '120px',
          marginBottom: '2rem',
          transformOrigin: 'center center',
        }}
      >
        <motion.div
          animate={{
            rotate: [-2, 2, -2], 
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img
            src={penPaperImage}
            alt="Loading"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </motion.div>
      </motion.div>

      
      <Typography
        variant="h6"
        component={motion.h6}
        animate={{ 
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        sx={{ 
          mb: 3, 
          color: '#1976d2',
          textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 1,
          letterSpacing: '0.5px',
          fontWeight: 500,
        }}
      >
        {progress < 100 ? 'Creating your blog space...' : 'Welcome to BlogNest!'}
      </Typography>

      
      <Box sx={{ width: '300px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(197, 214, 245, 0.7)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: '#1976d2',
                transition: 'transform 0.1s linear',
              },
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
        </motion.div>
      </Box>
    </Box>
  );
};

export default Preloader; 