import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import LoadingPage from './components/ui/LoadingPage';
import ScrollToTop from './components/ui/ScrollToTop';
import { useThemeStore } from './store/themeStore';

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

const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Suggestions = lazy(() => import('./pages/Suggestions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const FAQ = lazy(() => import('./pages/FAQ'));
const API = lazy(() => import('./pages/API'));
const Tutorial = lazy(() => import('./pages/Tutorial'));
const Formats = lazy(() => import('./pages/Formats'));

function App() {
  const { theme } = useThemeStore();

  React.useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return (
    <Layout>
      <ScrollToTop />
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
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/api" element={<API />} />
            <Route path="/how-to-download" element={<Tutorial />} />
            <Route path="/supported-formats" element={<Formats />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
