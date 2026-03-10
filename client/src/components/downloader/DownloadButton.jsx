import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DownloadButton = ({
  onClick,
  disabled = false,
  label = 'Download',
  size = 'md',
  className = '',
}) => {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [progress, setProgress] = useState(0);

  const handleClick = async () => {
    if (status === 'loading') return;
    setStatus('loading');
    setProgress(0);

    try {
      await onClick({ onProgress: (p) => setProgress(p) });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      const msg = err?.response?.data?.message || err?.message || 'Download failed';
      toast.error(msg);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm sm:text-base',
    lg: 'px-8 py-4 text-base sm:text-lg',
  };

  const statusConfig = {
    idle: {
      bg: 'bg-brand-600 hover:bg-brand-500',
      icon: <Download className="w-4 h-4" />,
      text: label,
    },
    loading: {
      bg: 'bg-brand-700 cursor-not-allowed',
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      text: progress > 0 ? `${Math.round(progress)}%` : 'Preparing...',
    },
    success: {
      bg: 'bg-green-600',
      icon: <Check className="w-4 h-4" />,
      text: 'Downloaded!',
    },
    error: {
      bg: 'bg-red-700',
      icon: <AlertCircle className="w-4 h-4" />,
      text: 'Failed — Try Again',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        disabled={disabled || status === 'loading'}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        className={`relative flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 overflow-hidden
          ${config.bg} text-white ${sizeClasses[size]} ${className}
          disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {/* Progress fill */}
        {status === 'loading' && progress > 0 && (
          <motion.div
            className="absolute inset-0 bg-white/10"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {config.icon}
          {config.text}
        </span>
      </motion.button>
    </div>
  );
};

/**
 * Trigger browser file download from blob
 */
export const triggerDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export default DownloadButton;
