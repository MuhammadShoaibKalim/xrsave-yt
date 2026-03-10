import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Trash2, Video, Music, Image, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';
import { historyApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

const typeIcons = {
  video: Video,
  audio: Music,
  thumbnail: Image,
  subtitle: FileText,
  shorts: Video,
};

const typeColors = {
  video: 'text-red-400',
  audio: 'text-purple-400',
  thumbnail: 'text-blue-400',
  subtitle: 'text-green-400',
  shorts: 'text-pink-400',
};

const History = () => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => historyApi.get(1, 50).then((r) => r.data.data),
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => historyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['history']);
      toast.success('Removed');
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => historyApi.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries(['history']);
      toast.success('History cleared');
    },
  });

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto px-4 pt-40 text-center">
          <HistoryIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Sign in to view history</h1>
          <p className="text-gray-500 mb-6">Your download history is saved when you're signed in.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </PageWrapper>
    );
  }

  const downloads = data?.downloads || [];

  return (
    <PageWrapper>
      <Helmet>
        <title>Download History - XRSave-YT</title>
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Download History</h1>
            <p className="text-gray-500 mt-1">{downloads.length} downloads</p>
          </div>
          {downloads.length > 0 && (
            <button onClick={() => clearMutation.mutate()} className="btn-ghost text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
          </div>
        )}

        {!isLoading && downloads.length === 0 && (
          <div className="text-center py-20">
            <HistoryIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No downloads yet</p>
          </div>
        )}

        <div className="space-y-2">
          <AnimatePresence>
            {downloads.map((dl, i) => {
              const Icon = typeIcons[dl.type] || Video;
              const color = typeColors[dl.type] || 'text-gray-400';
              return (
                <motion.div
                  key={dl._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                  className="card p-4 flex items-center gap-4 hover:border-dark-400 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{dl.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {dl.type} • {dl.quality || dl.format} • {new Date(dl.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(dl._id)}
                    className="flex-shrink-0 p-2 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-dark-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default History;
