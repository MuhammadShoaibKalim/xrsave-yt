import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';
import VideoInfoCard from '../components/downloader/VideoInfoCard';
import { metadataApi, videoApi } from '../services/api';
import { isYouTubeUrl, downloadBlob } from '../utils/helpers';

const QUALITIES = ['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];

const VideoDownload = () => {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720p');
  const [isDownloading, setIsDownloading] = useState(false);

  const validUrl = isYouTubeUrl(url) ? url : '';

  const { data: info, isLoading, error } = useQuery({
    queryKey: ['video-info', validUrl],
    queryFn: () => metadataApi.getInfo(validUrl).then((r) => r.data.data),
    enabled: !!validUrl,
  });

  const handleDownload = async () => {
    if (!info) return;
    setIsDownloading(true);
    toast.loading('Preparing download...', { id: 'dl' });
    try {
      const res = await videoApi.download(url, quality);
      const ext = 'mp4';
      const filename = `${info.title?.substring(0, 60) || 'video'}_${quality}.${ext}`;
      downloadBlob(res.data, filename);
      toast.success('Download complete!', { id: 'dl' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Download failed', { id: 'dl' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>YouTube Video Downloader HD - XRSave-YT</title>
        <meta name="description" content="Download YouTube videos in 360p, 480p, 720p, 1080p and 4K quality. Fast and free." />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl mb-4">
            <Video className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Video Downloader</h1>
          <p className="text-gray-400 mt-2">Download YouTube videos in HD quality</p>
        </div>

        <div className="space-y-4">
          {/* URL Input */}
          <div className="card p-4">
            <label className="block text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">YouTube URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="input-field"
            />
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="card p-5 space-y-3">
              <div className="flex gap-4">
                <div className="skeleton w-44 h-28 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded mt-4" />
                </div>
              </div>
            </div>
          )}

          {/* Video info */}
          {info && !isLoading && <VideoInfoCard info={info} />}

          {/* Quality selector */}
          <AnimatePresence>
            {info && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4"
              >
                <label className="block text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Quality</label>
                <div className="relative">
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="input-field appearance-none pr-10 cursor-pointer"
                  >
                    {(info.availableQualities?.length ? info.availableQualities : QUALITIES).map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Download button */}
          <motion.button
            onClick={handleDownload}
            disabled={!info || isDownloading}
            whileHover={{ scale: !info ? 1 : 1.01 }}
            whileTap={{ scale: !info ? 1 : 0.98 }}
            className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? 'Downloading...' : `Download ${quality} MP4`}
          </motion.button>

          {error && (
            <p className="text-red-400 text-sm text-center">
              {error?.response?.data?.message || 'Failed to fetch video info'}
            </p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default VideoDownload;
