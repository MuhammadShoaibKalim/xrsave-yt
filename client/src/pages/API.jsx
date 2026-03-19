import React from 'react';
import { motion } from 'framer-motion';
import { Code2, ArrowRight } from 'lucide-react';

const API = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-brand-600/20 rounded-2xl flex items-center justify-center mb-4 border border-brand-500/30">
          <Code2 className="w-10 h-10 text-brand-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
          Developer <span className="text-brand-500">API</span>
        </h1>
        
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
          We are currently building a powerful, rate-limited public API to allow developers to integrate XRSave-YT directly into their applications.
        </p>

        <div className="mt-8 bg-dark-800/50 border border-dark-600 rounded-full px-6 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
          <span className="text-gray-300 font-medium">Will be available soon</span>
        </div>
        
        <p className="text-sm text-gray-500 mt-6 flex items-center gap-2">
          Want early access? Drop a message in our <a href="/contact" className="text-brand-400 hover:text-brand-300 flex items-center gap-1">Contact page <ArrowRight className="w-3 h-3" /></a>
        </p>
      </motion.div>
    </div>
  );
};

export default API;
