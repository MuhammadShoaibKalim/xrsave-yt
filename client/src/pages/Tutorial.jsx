import React from 'react';
import { motion } from 'framer-motion';
import { Link2, MousePointerClick, Download, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Link2,
    title: '1. Copy the URL',
    desc: 'Open the YouTube app or website. Find the video, audio, or short you want to save. Tap on the "Share" button and select "Copy Link".'
  },
  {
    icon: MousePointerClick,
    title: '2. Paste in XRSave',
    desc: 'Go to XRSave-YT and paste the copied link into the search box at the top of the page. The system will automatically fetch the media information.'
  },
  {
    icon: Download,
    title: '3. Choose Format & Download',
    desc: 'Select your preferred format (MP4, MP3, WebP, etc.) and quality (up to 4K). Click the Download button and your file will be saved instantly to your device.'
  }
];

const Tutorial = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12 w-full"
      >
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            How to <span className="text-brand-500">Download</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Downloading your favorite YouTube videos, MP3s, and shorts is incredibly easy. Just follow these three simple steps to get started!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-dark-800 via-brand-500/50 to-dark-800 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="bg-dark-800/80 border border-dark-700 p-8 rounded-3xl relative z-10 flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,0,0,0.2)] backdrop-blur-sm">
              <div className="w-16 h-16 bg-dark-900 border border-dark-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <step.icon className="w-8 h-8 text-brand-500" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-brand-600/10 border border-brand-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto mt-12 shadow-[0_0_40px_rgba(239,68,68,0.05)]">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="w-10 h-10 text-brand-500 flex-shrink-0" />
            <div className="text-left">
              <h4 className="text-white font-semibold">Ready to start?</h4>
              <p className="text-gray-400 text-sm">Download your first video entirely for free.</p>
            </div>
          </div>
          <a href="/" className="btn-primary py-3 px-8 whitespace-nowrap shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            Start Downloading
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Tutorial;
