import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Heart } from 'lucide-react';

const Footer = () => {
  const tools = [
    { to: '/video', label: 'Video Downloader' },
    { to: '/audio', label: 'MP3 Downloader' },
    { to: '/thumbnail', label: 'Thumbnail Downloader' },
    { to: '/shorts', label: 'Shorts Downloader' },
    { to: '/subtitle', label: 'Subtitle Downloader', disabled: true },
    { to: '/playlist', label: 'Playlist Downloader', disabled: true },
    { to: '/extract', label: 'Info Extractor' },
  ];

  return (
    <footer className="bg-dark-950 border-t border-dark-800 mt-20 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center group-hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/20">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                xrsave <span className="text-brand-500">YT</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The ultimate toolkit for downloading YouTube videos, audio, thumbnails, and subtitles seamlessly. Fast, reliable, and completely free forever.
            </p>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 text-xs text-brand-100 font-medium">Free Tool</div>
              <div className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 text-xs text-brand-100 font-medium">No Signups</div>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              Free Tools
            </h3>
            <ul className="space-y-3">
              {tools.map((tool) => (
                <li key={tool.to}>
                  {tool.disabled ? (
                    <span className="group flex items-center text-sm text-gray-500 cursor-not-allowed" title="Will be available soon">
                      <span className="relative overflow-hidden mr-2">
                        {tool.label}
                      </span>
                      <span className="text-[10px] bg-dark-800/50 border border-dark-600/50 px-1.5 py-0.5 rounded text-gray-400">Soon</span>
                    </span>
                  ) : (
                    <Link to={tool.to} className="group flex items-center text-sm text-gray-400 hover:text-brand-400 transition-colors">
                      <span className="relative overflow-hidden">
                        {tool.label}
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Information
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="group flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/how-to-download" className="group flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors">How to Download</Link></li>
              <li><Link to="/supported-formats" className="group flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors">Supported Formats</Link></li>
              <li><Link to="/contact" className="group flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/faq" className="group flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors">Help & FAQ</Link></li>
              <li><Link to="/api" className="group flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors">Developer API</Link></li>
              <li><Link to="/suggestions" className="group flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors">Request a Feature</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-500"></span>
              Legal
            </h3>
            <ul className="space-y-3 mb-6">
              <li><Link to="/privacy-policy" className="group flex items-center text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="group flex items-center text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
            <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700/50">
              <p className="text-gray-500 text-xs leading-relaxed">
                XRSave-YT is an independent tool not affiliated with YouTube or Google. Respect copyright laws and only download content you have rights to.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="font-medium text-gray-300">XRSave-YT</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-dark-800/80 px-5 py-2.5 rounded-full border border-dark-700 shadow-sm backdrop-blur-md">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-brand-500 fill-brand-500 animate-pulse" />
            <span>for free public use</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
