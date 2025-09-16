import React from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomeCard = () => {

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8"
    >
      
      {/* Floating Elements */}
      <motion.div 
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20"
      ></motion.div>
      <motion.div 
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20"
      ></motion.div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between">
        {/* Left Content */}
        <div className="flex-1 mb-6 lg:mb-0 lg:mr-8">
          {/* Welcome Message */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
              Welcome Back!
            </h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-4"
            >
             
              <p className="text-gray-600 text-sm leading-relaxed">
                Experience the power of intelligent chatbots that engage, assist, and delight your users. 
                Monitor performance, track insights, and watch your conversations transform into meaningful connections.
              </p>
            </motion.div>
          </motion.div>
          


        </div>

        {/* Right Side - Lottie Animation */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex-shrink-0 w-full lg:w-80 h-64 lg:h-80 mt-14"
        >
          <div className="relative w-full h-full">
            {/* Lottie Animation */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <DotLottiePlayer
                src="https://lottie.host/4980230b-a4a8-4ef0-ba36-8dbd327746ef/hXrDtum0XP.lottie"
                loop
                autoplay
                background="transparent"
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default WelcomeCard;
