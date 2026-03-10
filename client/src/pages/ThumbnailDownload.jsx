import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';
import { metadataApi, thumbnailApi } from '../services/api';
import { isYouTubeUrl, downloadBlob, extractVideoId } from '../utils/helpers';

const QUALITIES = [
  { value: 'maxresdefault', label: 'Max Resolution (1280×720)' },
  { value: 'hqdefault', label: 'High Quality (480×360)' },
  { value: 'mqdefault', label: 'Medium Quality (320×180)' },
  { value: 'sddefault', label: 'Standard (120×90)' },
  { value: 'default', label: 'Default (120×90)' },
];

const ThumbnailDownload = () => {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('maxresdefault');
  const [isDownloading, setIsDownloading] = useState(false);

  const validUrl = isYouTubeUrl(url) ? url : '';
  const videoId = extractVideoId(url);

  const { data: thumbnails, isLoading } = useQuery({
    queryKey: ['thumbnails', validUrl],
    queryFn: () => metadataApi.getThumbnails(validUrl).then((r) => r.data.data),
    enabled: !!validUrl,
  });

  const previewUrl = videoId
    ? `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
    : null;

  const handleDownload = async () => {
    if (!videoId) return;
    setIsDownloading(true);
    try {
      const res = await thumbnailApi.download(url, quality);
      downloadBlob(res.data, `thumbnail_${videoId}_${quality}.jpg`);
      toast.success('Thumbnail downloaded!');
    } catch (err) {
      toast.error('Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>YouTube Thumbnail Downloader HD - XRSave-YT</title>
        <meta name="description" content="Download YouTube video thumbnails in HD, maxresdefault and all available qualities." />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4">
            <Image className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Thumbnail Downloader</h1>
          <p className="text-gray-400 mt-2">Download thumbnails in every available quality</p>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <label className="block text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">YouTube URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="input-field" />
          </div>

          {/* Thumbnail preview */}
          <AnimatePresence>
            {previewUrl && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Video thumbnail preview"
                  className="w-full object-cover max-h-72"
                  onError={(e) => { e.target.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`; }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quality selector */}
          <AnimatePresence>
            {videoId && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
                <label className="block text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Select Quality</label>
                <div className="grid grid-cols-1 gap-2">
                  {QUALITIES.map((q) => (
                    <button
                      key={q.value}
                      onClick={() => setQuality(q.value)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${quality === q.value
                          ? 'border-brand-500 bg-brand-600/10 text-white'
                          : 'border-dark-500 bg-dark-700 text-gray-400 hover:border-dark-400 hover:text-white'
                        }`}
                    >
                      <span className="text-sm">{q.label}</span>
                      {quality === q.value && <span className="text-xs text-brand-400 font-medium">Selected</span>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleDownload}
            disabled={!videoId || isDownloading}
            whileHover={{ scale: !videoId ? 1 : 1.01 }}
            whileTap={{ scale: !videoId ? 1 : 0.98 }}
            className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Download Thumbnail'}
          </motion.button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ThumbnailDownload;
