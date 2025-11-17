import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import HorizontalMarquee from "./HorizontalMarquee";

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

  // Combine text with link text if link exists
  const marqueeText = link ? `${text} ✦ ${linkText} ✦` : text;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.6
      }}
      className="fixed top-16 left-0 z-[30] py-3 pl-4 sm:pl-6 overflow-hidden bg-black/40 backdrop-blur-sm"
      style={{ 
        right: '96px', // Stops before search button area (right-4/right-6 + w-10 + gap + buffer)
      }}
    >
      <div className="relative w-full h-full flex items-center">
        {link ? (
          <a
            href={link}
            target={link.startsWith('http') ? '_blank' : undefined}
            rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="absolute inset-0 z-10 cursor-pointer"
            aria-label={`${text} - ${linkText}`}
          />
        ) : null}
        <div className="flex-1 relative">
          <HorizontalMarquee
            marqueeText={marqueeText}
            speed={3}
            direction="left"
            interactive={false}
            className="elms-sans font-bold tracking-wide"
          />
        </div>
        {onClose && (
          <motion.button
            onClick={handleClose}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0 ml-4 p-1 hover:bg-white/20 rounded transition z-20 relative"
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

