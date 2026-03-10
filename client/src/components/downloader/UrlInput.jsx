import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Link2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { metadataApi } from '../../services/api';
import { debounce } from '../../utils/helpers';

const isYouTubeUrl = (url) => {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(url);
};

const UrlInput = ({ onVideoInfo, placeholder = 'Paste YouTube URL here...', autoFetch = true }) => {
  const [url, setUrl] = useState('');
  const [debouncedUrl, setDebouncedUrl] = useState('');
  const [error, setError] = useState('');

  const debouncedSetUrl = useCallback(
    debounce((value) => {
      if (isYouTubeUrl(value)) {
        setDebouncedUrl(value);
        setError('');
      } else if (value && !isYouTubeUrl(value)) {
        setError('Please enter a valid YouTube URL');
        setDebouncedUrl('');
      }
    }, 500),
    []
  );

  const { data, isLoading, isError, error: queryError } = useQuery({
    queryKey: ['video-info', debouncedUrl],
    queryFn: () => metadataApi.getInfo(debouncedUrl),
    enabled: !!debouncedUrl && autoFetch,
    onSuccess: (data) => {
      onVideoInfo?.(data.data.data);
    },
    select: (res) => res.data,
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    setError('');
    if (!value) {
      setDebouncedUrl('');
      onVideoInfo?.(null);
    } else {
      debouncedSetUrl(value);
    }
  };

  const handleClear = () => {
    setUrl('');
    setDebouncedUrl('');
    setError('');
    onVideoInfo?.(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        if (isYouTubeUrl(text)) {
          setDebouncedUrl(text);
          setError('');
        } else {
          setError('Clipboard content is not a YouTube URL');
        }
      }
    } catch {}
  };

  const isValid = isYouTubeUrl(url);

  return (
    <div className="w-full">
      <div className={`relative flex items-center bg-dark-700 rounded-2xl border-2 transition-all duration-300 ${
        error ? 'border-red-500/50' : isValid ? 'border-brand-500/50 shadow-lg shadow-brand-500/10' : 'border-dark-500 hover:border-dark-400'
      }`}>
        {/* Icon */}
        <div className="pl-4 pr-3 text-gray-500">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
          ) : error ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <Link2 className="w-5 h-5" />
          )}
        </div>

        {/* Input */}
        <input
          type="url"
          value={url}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-4 text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Actions */}
        <div className="flex items-center gap-2 pr-3">
          {url && (
            <button onClick={handleClear} className="p-1 text-gray-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handlePaste}
            className="hidden sm:block px-3 py-1.5 rounded-lg bg-dark-600 hover:bg-dark-500 text-xs text-gray-400 hover:text-white transition-all duration-200"
          >
            Paste
          </button>
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {(error || (isError && queryError)) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 text-sm text-red-400 flex items-center gap-2"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error || queryError?.response?.data?.message || 'Failed to fetch video info'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UrlInput;
