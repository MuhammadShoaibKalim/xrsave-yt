import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Video, Music, Image, FileText, Zap, PlaySquare, List,
  ArrowRight, Shield, Globe, Download, Subtitles
} from 'lucide-react';
import PageWrapper from '../components/ui/PageWrapper';

const features = [
  {
    icon: Video,
    label: 'Video Download',
    desc: '360p to 4K quality',
    to: '/video',
    color: 'from-red-500 to-rose-600',
  },
  {
    icon: Music,
    label: 'Audio MP3',
    desc: '128kbps to 320kbps',
    to: '/audio',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Image,
    label: 'Thumbnail',
    desc: 'HD & maxres quality',
    to: '/thumbnail',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: PlaySquare,
    label: 'Shorts',
    desc: 'YouTube Shorts downloader',
    to: '/shorts',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Subtitles,
    label: 'Subtitles',
    desc: 'SRT, VTT, TXT formats',
    to: '/subtitle',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: List,
    label: 'Playlist',
    desc: 'Batch download playlists',
    to: '/playlist',
    color: 'from-orange-500 to-amber-600',
  },
  {
    icon: FileText,
    label: 'Extract Info',
    desc: 'Title, description & more',
    to: '/extract',
    color: 'from-teal-500 to-cyan-600',
  },
];

const steps = [
  { n: '01', title: 'Paste URL', desc: 'Copy the YouTube video URL and paste it in the input field.' },
  { n: '02', title: 'Choose Format', desc: 'Select your preferred quality, format, and output type.' },
  { n: '03', title: 'Download', desc: 'Click download and your file will be saved instantly.' },
];

const Home = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleQuickStart = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    if (/youtube\.com\/shorts/.test(url)) return navigate(`/shorts?url=${encodeURIComponent(url)}`);
    if (/list=/.test(url)) return navigate(`/playlist?url=${encodeURIComponent(url)}`);
    navigate(`/video?url=${encodeURIComponent(url)}`);
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>XRSave-YT - Free YouTube Video Downloader Online</title>
        <meta name="description" content="Download YouTube videos in HD, MP3 audio, thumbnails, subtitles and Shorts for free. No signup required. Fast and reliable." />
        <meta property="og:title" content="XRSave-YT - Free YouTube Downloader" />
        <meta property="og:description" content="Free YouTube downloader for videos, MP3, thumbnails, subtitles and playlists." />
        <link rel="canonical" href="https://xrsave-yt.app/" />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-dark-700 border border-dark-500 rounded-full px-4 py-1.5 text-sm text-gray-400 mb-6"
          >
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            Fast & free — no account required
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
          >
            Download{' '}
            <span className="text-brand-500">YouTube</span>
            <br />
            anything, instantly.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          >
            Videos, audio MP3, thumbnails, subtitles and playlists.
            No watermarks, no limits, no bullshit.
          </motion.p>

          {/* Quick URL input */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleQuickStart}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          >
            <div className="flex-1 flex items-center bg-dark-700 border-2 border-dark-500 hover:border-dark-400 focus-within:border-brand-500/50 rounded-2xl transition-all duration-300 px-4">
              <Download className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 bg-transparent py-4 text-white placeholder-gray-500 focus:outline-none text-sm"
              />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap flex items-center gap-2 justify-center">
              Download <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link
                  to={f.to}
                  className="group card p-5 flex flex-col gap-3 hover:border-dark-400 transition-all duration-200 glow-hover"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-white text-sm group-hover:text-brand-400 transition-colors">{f.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 bg-dark-800/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-dark-700 border border-dark-500 flex items-center justify-center mb-4">
                  <span className="font-display font-bold text-brand-400 text-lg">{step.n}</span>
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Secure', desc: 'No files stored on our servers. Downloads are streamed directly to you.' },
              { icon: Zap, title: 'Fast', desc: 'Direct streaming with no intermediate processing delays.' },
              { icon: Globe, title: 'Free', desc: 'All features available free. No account required for basic downloads.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 card">
                <item.icon className="w-6 h-6 text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Home;
