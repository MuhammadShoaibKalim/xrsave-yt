import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Check, Eye, Clock, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';
import { metadataApi } from '../services/api';
import { isYouTubeUrl, copyToClipboard, formatCount } from '../utils/helpers';

const TitleDescriptionExtract = () => {
  const [url, setUrl] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const validUrl = isYouTubeUrl(url) ? url : '';

  const { data: info, isLoading, error } = useQuery({
    queryKey: ['video-info', validUrl],
    queryFn: () => metadataApi.getInfo(validUrl).then((r) => r.data.data),
    enabled: !!validUrl,
  });

  const handleCopy = async (text, field) => {
    await copyToClipboard(text);
    setCopiedField(field);
    toast.success(`${field} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>YouTube Title & Description Extractor - XRSave-YT</title>
        <meta name="description" content="Extract title, description, channel info and metadata from any YouTube video." />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl mb-4">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Info Extractor</h1>
          <p className="text-gray-400 mt-2">Extract title, description and metadata from any video</p>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <label className="block text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">YouTube URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="input-field" />
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-16 w-full rounded-2xl" />)}
            </div>
          )}

          <AnimatePresence>
            {info && !isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                {/* Title */}
                <div className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Title</span>
                      <p className="text-white mt-1 text-sm leading-relaxed">{info.title}</p>
                    </div>
                    <button onClick={() => handleCopy(info.title, 'Title')} className="flex-shrink-0 p-2 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors">
                      {copiedField === 'Title' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Eye, label: 'Views', value: formatCount(info.viewCount) },
                    { icon: Clock, label: 'Duration', value: info.durationFormatted },
                    { icon: User, label: 'Channel', value: info.channelName?.substring(0, 15) },
                  ].map((stat) => (
                    <div key={stat.label} className="card p-3 text-center">
                      <stat.icon className="w-4 h-4 text-brand-400 mx-auto mb-1" />
                      <p className="text-white text-sm font-semibold">{stat.value}</p>
                      <p className="text-gray-500 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {info.description && (
                  <div className="card p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Description</span>
                      <button onClick={() => handleCopy(info.description, 'Description')} className="flex-shrink-0 p-2 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors">
                        {copiedField === 'Description' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line line-clamp-10">{info.description}</p>
                  </div>
                )}

                {/* Keywords */}
                {info.keywords?.length > 0 && (
                  <div className="card p-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-medium block mb-3">Keywords</span>
                    <div className="flex flex-wrap gap-2">
                      {info.keywords.slice(0, 20).map((kw) => (
                        <span key={kw} className="text-xs px-2.5 py-1 bg-dark-600 text-gray-300 rounded-full border border-dark-500">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="text-red-400 text-sm text-center">{error?.response?.data?.message || 'Failed to fetch video info'}</p>}
        </div>
      </div>
    </PageWrapper>
  );
};

export default TitleDescriptionExtract;
