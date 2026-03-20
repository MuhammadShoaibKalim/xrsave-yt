import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { List, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';
import { playlistApi } from '../services/api';

const PlaylistDownload = () => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('video');
  const [quality, setQuality] = useState('720p');
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState(null);

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    try {
      const info = await playlistApi.getInfo(url);
      const res = await playlistApi.download(url, type, quality);
      setJobId(res.data.data.jobId);
      toast.success('Playlist queued for download!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to process playlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>YouTube Playlist Downloader - Batch Download - XRSave-YT</title>
        <meta name="description" content="Download entire YouTube playlists as video or MP3 audio in batch." />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-4">
            <List className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Playlist Downloader</h1>
          <p className="text-gray-400 mt-2">Download entire playlists in batch</p>
        </div>
        <div className="space-y-4">
          <div className="bg-dark-800/50 border border-brand-500/20 rounded-2xl p-8 text-center backdrop-blur-sm relative overflow-hidden group shadow-[0_0_30px_rgba(239,68,68,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-xl font-semibold text-white mb-2 relative z-10">We are working on this!</h2>
            <p className="text-gray-400 text-sm relative z-10">This feature will be available very soon. Stay tuned!</p>
          </div>
          {/*
          <div className="card p-4">
            <label className="block text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Playlist URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/playlist?list=..." className="input-field" />
          </div>

          <div className="card p-4">
            <label className="block text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Download Type</label>
            <div className="flex gap-3">
              {['video', 'audio'].map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-all ${type === t ? 'border-brand-500 bg-brand-600/10 text-white' : 'border-dark-500 bg-dark-700 text-gray-400 hover:border-dark-400'
                    }`}
                >
                  {t === 'video' ? '🎬 Video' : '🎵 Audio MP3'}
                </button>
              ))}
            </div>
          </div>

          {jobId && (
            <div className="card p-4 text-center">
              <p className="text-green-400 font-medium">✓ Queued successfully</p>
              <p className="text-gray-500 text-xs mt-1">Job ID: {jobId}</p>
            </div>
          )}

          <button onClick={handleSubmit} disabled={!url.trim() || isLoading} className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Queue Playlist Download'}
          </button>
          */}
        </div>
      </div>
    </PageWrapper>
  );
};

export default PlaylistDownload;
