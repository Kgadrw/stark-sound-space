import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

type NotificationBannerProps = {
  text: string;
  link?: string;
  linkText?: string;
  onClose?: () => void;
  isVisible: boolean;
};

const NotificationBanner = ({ 
  text, 
  link, 
  linkText = "Learn More", 
  onClose,
  isVisible 
}: NotificationBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isVisible || isDismissed || !text.trim()) {
    return null;
  }

  const handleClose = () => {
    setIsDismissed(true);
    onClose?.();
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.6
      }}
      className="fixed top-16 left-0 right-0 z-[45] bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 py-3 px-4 sm:px-6 shadow-lg border-b border-white/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3 sm:gap-4 overflow-hidden min-w-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex-shrink-0 w-2 h-2 bg-white rounded-full animate-pulse"
          />
          <div className="flex-1 overflow-hidden">
            <motion.p
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-sm sm:text-base text-white font-medium elms-sans whitespace-nowrap"
            >
              {text}
            </motion.p>
          </div>
          {link && (
            <motion.a
              href={link}
              target={link.startsWith('http') ? '_blank' : undefined}
              rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-shrink-0 text-sm sm:text-base font-semibold text-white underline hover:text-white/80 transition whitespace-nowrap px-2 py-1 rounded hover:bg-white/10"
            >
              {linkText}
            </motion.a>
          )}
        </div>
        {onClose && (
          <motion.button
            onClick={handleClose}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition"
            aria-label="Close notification"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationBanner;

