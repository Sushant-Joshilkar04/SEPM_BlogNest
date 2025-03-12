import React from 'react';
import { motion } from 'framer-motion';

const ParticlesBackground = () => {
  const particles = [
    { content: "✍️", size: 24 },
    { content: "📝", size: 28 },
    { content: "📖", size: 26 },
    { content: "💭", size: 24 },
    { content: "✨", size: 20 },
    { content: "Write", size: 16 },
    { content: "📚", size: 26 },
    { content: "💡", size: 24 },
    { content: "Stories", size: 16 },
    { content: "✏️", size: 24 },
    { content: "Ideas", size: 16 },
  ];

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0.3,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
          }}
          transition={{
            duration: Math.random() * 10 + 10, 
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            fontSize: particle.size,
            color: '#1976d2',
            opacity: 0.2,
            fontFamily: 'Arial',
          }}
        >
          {particle.content}
        </motion.div>
      ))}
    </div>
  );
};

export default ParticlesBackground; 