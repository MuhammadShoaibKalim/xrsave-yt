import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Privacy <span className="text-brand-500">Policy</span>
          </h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-dark-800/50 border border-dark-600 rounded-2xl p-6 md:p-8 space-y-6 text-gray-300">
          <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
          <p>
            When you use XRSave-YT, we do not require you to provide any personal information for basic downloading. We may collect anonymous analytics data regarding page visits and usage patterns to improve our service structure.
          </p>

          <h2 className="text-xl font-semibold text-white">2. Use of Collected Data</h2>
          <p>
            Any broad analytical data collected is used strictly to enhance the performance and user experience of our website. We do not sell, rent, or trade user data with any third parties.
          </p>

          <h2 className="text-xl font-semibold text-white">3. Third-party Links and Ads</h2>
          <p>
            Our website may contain links to independent third-party sites or advertisements. We are not responsible for the privacy practices or content of these third-party platforms.
          </p>

          <h2 className="text-xl font-semibold text-white">4. Cookies</h2>
          <p>
            We may use cookies to store your preferences, such as theme settings (dark/light mode) or localized data to speed up your navigation on subsequent visits. You can optionally disable cookies via your browser settings.
          </p>

          <h2 className="text-xl font-semibold text-white">5. Changes to This Policy</h2>
          <p>
            We reserve the right to modify this privacy policy at any time. Significant changes will be explicitly updated on this page.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
