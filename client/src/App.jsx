import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import LoadingPage from './components/ui/LoadingPage';

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'));
const VideoDownload = lazy(() => import('./pages/VideoDownload'));
const AudioDownload = lazy(() => import('./pages/AudioDownload'));
const ThumbnailDownload = lazy(() => import('./pages/ThumbnailDownload'));
const ShortsDownload = lazy(() => import('./pages/ShortsDownload'));
const PlaylistDownload = lazy(() => import('./pages/PlaylistDownload'));
const SubtitleDownload = lazy(() => import('./pages/SubtitleDownload'));
const TitleDescriptionExtract = lazy(() => import('./pages/TitleDescriptionExtract'));
const History = lazy(() => import('./pages/History'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video" element={<VideoDownload />} />
            <Route path="/audio" element={<AudioDownload />} />
            <Route path="/thumbnail" element={<ThumbnailDownload />} />
            <Route path="/shorts" element={<ShortsDownload />} />
            <Route path="/playlist" element={<PlaylistDownload />} />
            <Route path="/subtitle" element={<SubtitleDownload />} />
            <Route path="/extract" element={<TitleDescriptionExtract />} />
            <Route path="/history" element={<History />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
