import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Is XRSave-YT completely free to use?",
    answer: "Yes, XRSave-YT is 100% free to use. We do not require a subscription, and there are no hidden fees for any of our tools including video, audio, or thumbnail downloads."
  },
  {
    question: "Do I need to install any software or extensions?",
    answer: "No installation is required. XRSave-YT is completely web-based, meaning you can access and use it directly from your browser on a PC, Mac, tablet, or mobile phone."
  },
  {
    question: "Is it safe to download videos using this service?",
    answer: "Absolutely. We ensure a secure connection and we do not bundle any malware, adware, or malicious software within your downloads. All downloads are fetched securely from the source servers."
  },
  {
    question: "What formats and qualities are supported?",
    answer: "We support multiple formats including MP4 for videos, MP3 for audio, and WebP/JPG for thumbnails. Videos can be downloaded in qualities ranging from 144p up to 1080p and sometimes 4K, depending on original availability."
  },
  {
    question: "Why can't I download some protected videos?",
    answer: "XRSave-YT complies strictly with platform policies and copyright limitations. We do not allow the downloading of age-restricted videos, private videos, or highly copyrighted premium content."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Frequently Asked <span className="text-brand-500">Questions</span>
          </h1>
          <p className="text-gray-400">Everything you need to know about XRSave-YT.</p>
        </div>

        <div className="space-y-4 mt-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-dark-800/50 border border-dark-600 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleOpen(index)}
                className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none"
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-300 text-sm leading-relaxed border-t border-dark-600/50 pt-3">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;
