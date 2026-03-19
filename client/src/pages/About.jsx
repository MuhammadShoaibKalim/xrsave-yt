import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            About <span className="text-brand-500">Us</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Empowering users with the best tools to download, extract, and save YouTube content efficiently.
          </p>
        </div>

        <div className="bg-dark-800/50 border border-dark-600 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-display font-semibold text-white">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            XRSave-YT was created with a simple mission: to provide a fast, reliable, and completely free platform for downloading YouTube content. Whether you need an MP3 for your playlist, a perfectly cropped Thumbnail for your project, or exact Subtitles for translation—we've got you covered.
          </p>

          <h2 className="text-2xl font-display font-semibold text-white mt-8">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>100% Free with no hidden charges.</li>
            <li>No registration required—download instantly.</li>
            <li>High-quality formats (MP4, MP3, WebP, etc.).</li>
            <li>Fast processing and clean UI/UX without intrusive ads.</li>
            <li>Privacy-focused (we do not log your download history on our servers).</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
