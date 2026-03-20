import React from 'react';
import { motion } from 'framer-motion';
import { Database, MonitorPlay, Headphones, Image as ImageIcon, FileText, CheckCircle } from 'lucide-react';

const formats = [
  {
    title: 'Video Formats',
    icon: MonitorPlay,
    badges: ['MP4', 'WEBM', 'MKV'],
    qualities: ['4K (2160p)', '1440p (2K)', '1080p (FHD)', '720p (HD)', '480p', '360p', '144p'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Audio formats',
    icon: Headphones,
    badges: ['MP3', 'M4A', 'WAV', 'AAC'],
    qualities: ['320 kbps', '256 kbps', '192 kbps', '128 kbps', '64 kbps'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Thumbnails',
    icon: ImageIcon,
    badges: ['WEBP', 'JPG'],
    qualities: ['Max Resolution (1080p)', 'Standard Definition', 'High Quality', 'Medium Quality'],
    color: 'from-orange-500 to-amber-500'
  },
  {
    title: 'Subtitles & Captions',
    icon: FileText,
    badges: ['SRT', 'VTT', 'TXT'],
    qualities: ['All Available Languages', 'Auto-Generated Captions', 'Plain Text Extract'],
    color: 'from-green-500 to-emerald-500'
  }
];

const Formats = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-500/30">
            <Database className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Supported <span className="text-brand-500">Formats</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            We support a massive range of qualities and file extensions. From uncompressed 4K video to pure 320kbps MP3 audio streams, we handle it all.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {formats.map((feat, idx) => (
            <div key={idx} className="bg-dark-800/50 border border-dark-700 p-8 rounded-3xl hover:border-dark-500 transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-lg`}>
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-wrap gap-2 justify-end max-w-[150px]">
                  {feat.badges.map(b => (
                    <span key={b} className="text-[10px] font-bold tracking-wider px-2 py-1 bg-dark-900 border border-dark-600 rounded text-gray-400">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              
              <h3 className="text-2xl font-display font-bold text-white mb-4">{feat.title}</h3>
              
              <ul className="space-y-3">
                {feat.qualities.map((q, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Formats;
