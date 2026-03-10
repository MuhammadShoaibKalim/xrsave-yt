import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import PageWrapper from '../components/ui/PageWrapper';

const NotFound = () => (
  <PageWrapper>
    <Helmet><title>404 Not Found - XRSave-YT</title></Helmet>
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="font-display text-8xl sm:text-[10rem] font-bold text-dark-700 select-none leading-none mb-4">
          404
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  </PageWrapper>
);

export default NotFound;
