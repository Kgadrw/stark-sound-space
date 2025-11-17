import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "cookie-consent";

type CookieConsentStatus = "accepted" | "rejected" | null;

const getCookieConsent = (): CookieConsentStatus => {
  if (typeof document === "undefined") return null;
  const consent = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_CONSENT_KEY}=`));
  if (!consent) return null;
  const value = consent.split("=")[1];
  return value === "accepted" || value === "rejected" ? value : null;
};

const setCookieConsent = (status: "accepted" | "rejected") => {
  if (typeof document === "undefined") return;
  // Set cookie to expire in 1 year
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${COOKIE_CONSENT_KEY}=${status}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
};

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      // Small delay to ensure smooth page load
      setTimeout(() => setShowBanner(true), 500);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent("accepted");
    setShowBanner(false);
  };

  const handleReject = () => {
    setCookieConsent("rejected");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 py-4 sm:py-5 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm sm:text-base font-semibold text-white uppercase tracking-[0.1em]">
                  Cookie Consent
                </h3>
                <button
                  onClick={handleReject}
                  className="sm:hidden text-white/60 hover:text-white transition"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed elms-sans">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                By clicking "Accept", you consent to our use of cookies. You can also choose to reject non-essential cookies.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                onClick={handleReject}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none text-xs sm:text-sm px-4 sm:px-6 py-2 border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
              >
                Reject
              </Button>
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex-1 sm:flex-none text-xs sm:text-sm px-4 sm:px-6 py-2 bg-white text-black hover:bg-white/90"
              >
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

