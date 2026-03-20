import React from 'react';
import { motion } from 'framer-motion';

const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Terms & <span className="text-brand-500">Conditions</span>
          </h1>
          <p className="text-gray-400">Effective as of: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-dark-800/50 border border-dark-600 rounded-2xl p-6 md:p-8 space-y-6 text-gray-300">
          <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using XRSave-YT, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>

          <h2 className="text-xl font-semibold text-white">2. Permitted Use</h2>
          <p>
            XRSave-YT provides tools strictly for downloading content for your personal, non-commercial use. The tool assumes you either own the content or have acquired explicit permission from the original copyright holder to download and save it.
          </p>

          <h2 className="text-xl font-semibold text-white">3. Copyright Limitations</h2>
          <p>
            XRSave-YT does not host, store, or own any of the media files retrieved by our tool. All content is fetched directly from YouTube servers. We strongly prohibit the downloading of copyrighted multimedia content without explicit consent from the copyright block author.
          </p>

          <h2 className="text-xl font-semibold text-white">4. Disclaimer of Liability</h2>
          <p>
            Our tool is provided on an "as-is" and "as-available" basis. We do not guarantee uninterrupted, secure, or bug-free service. We are not liable for any damages that may occur from using our service.
          </p>

          <h2 className="text-xl font-semibold text-white">5. Governing Law</h2>
          <p>
            These conditions shall be interpreted and governed by applicable global internet regulations, prioritizing user protection and copyright compliance.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsConditions;
