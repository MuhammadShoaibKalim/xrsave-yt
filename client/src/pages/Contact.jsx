import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, ExternalLink } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 w-full"
      >
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-500/30">
            <Mail className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Contact <span className="text-brand-500">Us</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Have a question, business inquiry, or found a bug? 
            Reach out to us using the form below and we will get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-dark-800/50 border border-dark-600 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="bg-dark-700/50 p-4 rounded-xl border border-dark-600">
              <MessageSquare className="w-8 h-8 text-brand-400" />
            </div>
            
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-semibold text-white">We'd love to hear from you</h3>
              <p className="text-gray-400 text-sm">Fill out our quick response form and our team will get back to you within 24 hours.</p>
            </div>
            
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLScOZgD3BbFAtlKh4wtOI8xh0MhvLFEEV29SszY-HPbgXi43jA/viewform?usp=sharing&ouid=104244025915331567842" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 btn-primary px-8 py-4 w-full sm:w-auto shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all text-sm font-medium"
            >
              <span>Click here to fill the form</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
