import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, MessageSquarePlus, ExternalLink } from 'lucide-react';

const Suggestions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 w-full"
      >
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-500/30">
            <Lightbulb className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Feature <span className="text-brand-500">Suggestions</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            We are constantly looking to improve XRSave-YT. 
            Got a crazy idea or a feature request? Let us know below!
          </p>
        </div>

        <div className="bg-dark-800/50 border border-brand-600/20 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto backdrop-blur-sm relative overflow-hidden group shadow-[0_0_30px_rgba(239,68,68,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="bg-dark-700/50 p-4 rounded-xl border border-dark-600">
              <MessageSquarePlus className="w-8 h-8 text-brand-400" />
            </div>
            
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-semibold text-white">Help us grow</h3>
              <p className="text-gray-400 text-sm">Fill out our suggestion form and help shape the future of XRSave-YT.</p>
            </div>
            
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSf_Zuuw3OSp5gO62LdSzpCtnOtAk0ScdeqYROY2L3bxMleDPg/viewform?usp=sharing&ouid=104244025915331567842" 
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

export default Suggestions;
