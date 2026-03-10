import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';
import VideoInfoCard from '../components/downloader/VideoInfoCard';
import { metadataApi, audioApi } from '../services/api';
import { isYouTubeUrl, downloadBlob } from '../utils/helpers';

const FORMATS = [
  { value: 'mp3', label: 'MP3 — 320kbps', ext: 'mp3' },
  { value: 'mp3_192', label: 'MP3 — 192kbps', ext: 'mp3' },
  { value: 'mp3_128', label: 'MP3 — 128kbps', ext: 'mp3' },
  { value: 'm4a', label: 'M4A — High Quality', ext: 'm4a' },
  { value: 'wav', label: 'WAV — Lossless', ext: 'wav' },
  { value: 'ogg', label: 'OGG Vorbis', ext: 'ogg' },
];

const AudioDownload = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp3');
  const [isDownloading, setIsDownloading] = useState(false);

  const validUrl = isYouTubeUrl(url) ? url : '';

  const { data: info, isLoading, error } = useQuery({
    queryKey: ['video-info', validUrl],
    queryFn: () => metadataApi.getInfo(validUrl).then((r) => r.data.data),
    enabled: !!validUrl,
  });

  const selectedFormat = FORMATS.find((f) => f.value === format);

  const handleDownload = async () => {
    if (!info) return;
    setIsDownloading(true);
    toast.loading('Converting audio...', { id: 'dl' });
    try {
      const res = await audioApi.download(url, format);
      const filename = `${info.title?.substring(0, 60) || 'audio'}.${selectedFormat?.ext || 'mp3'}`;
      downloadBlob(res.data, filename);
      toast.success('Audio downloaded!', { id: 'dl' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Conversion failed', { id: 'dl' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>Download YouTube Audio as MP3 Free - XRSave-YT</title>
        <meta name="description" content="Convert and download YouTube videos to MP3, M4A, WAV audio. Up to 320kbps quality. Free and fast." />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mb-4">
            <Music className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Audio Downloader</h1>
          <p className="text-gray-400 mt-2">Extract audio as MP3, M4A, WAV, or OGG</p>
        </div>

        <div className="space-y-4">
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

          {isLoading && (
            <div className="card p-5 space-y-3">
              <div className="flex gap-4">
                <div className="skeleton w-44 h-28 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                </div>
              </div>
            </div>
          )}

          {info && !isLoading && <VideoInfoCard info={info} />}

          <AnimatePresence>
            {info && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
                <label className="block text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Format & Quality</label>
                <div className="relative">
                  <select value={format} onChange={(e) => setFormat(e.target.value)} className="input-field appearance-none pr-10 cursor-pointer">
                    {FORMATS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleDownload}
            disabled={!info || isDownloading}
            whileHover={{ scale: !info ? 1 : 1.01 }}
            whileTap={{ scale: !info ? 1 : 0.98 }}
            className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? 'Converting...' : `Download ${selectedFormat?.label || 'Audio'}`}
          </motion.button>

          {error && <p className="text-red-400 text-sm text-center">{error?.response?.data?.message || 'Failed to fetch video info'}</p>}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AudioDownload;
