'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingWhatsAppButton() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    let intervalTimer: NodeJS.Timeout;

    const showAndAutoHide = () => {
      setShowMessage(true);
      hideTimer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    };

    // Show the message initially after a short delay
    const initialTimer = setTimeout(() => {
      showAndAutoHide();

      // Repeat periodically, showing for 2 seconds each time
      intervalTimer = setInterval(() => {
        showAndAutoHide();
      }, 10000);
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const handleClick = () => {
    const text = 'Halo, saya ingin bertanya tentang produk Anda.';
    const waUrl = `https://wa.me/6285790911416?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white text-gray-800 text-sm font-medium py-3 px-5 rounded-2xl shadow-xl border border-gray-100 max-w-[220px] text-center relative"
          >
            Jika ada pertanyaan silahkan hubungi CS
            <div className="absolute -bottom-2 right-7 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45 shadow-sm"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        onClick={handleClick}
        className="bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20bd5a] transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
        aria-label="Contact Customer Service via WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="md:w-16 md:h-16 w-12 h-12"
          aria-hidden="true"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.937 3.112 6.937 6.937 0 3.825-3.113 6.937-6.937 6.937z" />
        </svg>
      </motion.button>
    </div>
  );
}
