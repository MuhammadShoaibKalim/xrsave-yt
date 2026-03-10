import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, User, Calendar } from 'lucide-react';

const VideoInfoCard = ({ info }) => {
  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 sm:p-5"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            src={info.thumbnail}
            alt={info.title}
            className="w-full sm:w-44 h-28 object-cover rounded-xl"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://i.ytimg.com/vi/${info.videoId}/hqdefault.jpg`;
            }}
          />
          {info.durationFormatted && (
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
              {info.durationFormatted}
            </span>
          )}
          {info.isLive && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
              LIVE
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-white text-sm sm:text-base line-clamp-2 mb-3">
            {info.title}
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {info.channelName && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <User className="w-3 h-3 flex-shrink-0 text-brand-500" />
                <span className="truncate">{info.channelName}</span>
              </div>
            )}
            {info.viewCountFormatted && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Eye className="w-3 h-3 flex-shrink-0 text-brand-500" />
                <span>{info.viewCountFormatted} views</span>
              </div>
            )}
            {info.durationFormatted && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3 flex-shrink-0 text-brand-500" />
                <span>{info.durationFormatted}</span>
              </div>
            )}
            {info.uploadDate && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3 h-3 flex-shrink-0 text-brand-500" />
                <span>{new Date(info.uploadDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {info.availableQualities?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {info.availableQualities.slice(0, 6).map((q) => (
                <span key={q} className="text-xs px-2 py-0.5 bg-dark-600 text-gray-400 rounded border border-dark-500">
                  {q}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VideoInfoCard;
