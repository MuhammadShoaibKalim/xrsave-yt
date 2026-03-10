import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Github } from 'lucide-react';

const Footer = () => {
  const tools = [
    { to: '/video', label: 'Video Downloader' },
    { to: '/audio', label: 'MP3 Downloader' },
    { to: '/thumbnail', label: 'Thumbnail Downloader' },
    { to: '/shorts', label: 'Shorts Downloader' },
    { to: '/subtitle', label: 'Subtitle Downloader' },
    { to: '/playlist', label: 'Playlist Downloader' },
    { to: '/extract', label: 'Info Extractor' },
  ];

  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                xrsave <span className="text-brand-500">YT</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Free YouTube downloader for videos, audio, thumbnails, subtitles and more.
              Fast, reliable, no registration required.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Tools</h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.to}>
                  <Link to={tool.to} className="text-gray-500 hover:text-brand-400 text-sm transition-colors">
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Legal</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              XRSave-YT is an independent tool not affiliated with YouTube or Google.
              Only download content you have rights to. Respect copyright laws.
              This tool is for personal use only.
            </p>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} XRSave-YT. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Built with Node.js, Express, React & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
