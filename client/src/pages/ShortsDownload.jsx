// ShortsDownload.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PlaySquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';
import VideoInfoCard from '../components/downloader/VideoInfoCard';
import { metadataApi, shortsApi } from '../services/api';
import { isYouTubeUrl, downloadBlob } from '../utils/helpers';

const ShortsDownload = () => {
  const [url, setUrl] = useState('');
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
    toast.loading('Downloading Short...', { id: 'dl' });
    try {
      const res = await shortsApi.download(url);
      downloadBlob(res.data, `${info.title?.substring(0, 60) || 'short'}.mp4`);
      toast.success('Downloaded!', { id: 'dl' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed', { id: 'dl' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>YouTube Shorts Downloader - XRSave-YT</title>
        <meta name="description" content="Download YouTube Shorts videos for free. Save any Short to your device instantly." />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-4">
            <PlaySquare className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Shorts Downloader</h1>
          <p className="text-gray-400 mt-2">Download YouTube Shorts videos</p>
        </div>
        <div className="space-y-4">
          <div className="card p-4">
            <label className="block text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">YouTube Shorts URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/shorts/..." className="input-field" />
          </div>
          {isLoading && <div className="card p-5"><div className="skeleton h-28 w-full rounded-xl" /></div>}
          {info && !isLoading && <VideoInfoCard info={info} />}
          <button onClick={handleDownload} disabled={!info || isDownloading} className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
            {isDownloading ? 'Downloading...' : 'Download Short'}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ShortsDownload;
