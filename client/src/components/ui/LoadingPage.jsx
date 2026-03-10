import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const LoadingPage = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-2 border-dark-600 border-t-brand-500"
      />
      <p className="text-gray-500 text-sm">Loading...</p>
    </motion.div>
  </div>
);

export default LoadingPage;
