import { motion } from "framer-motion";
import { Instagram, Twitter, Youtube, Facebook, Music2, type LucideIcon } from "lucide-react";
import { useContent } from "@/context/ContentContext";

const iconMap: Record<string, LucideIcon> = {
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
  facebook: Facebook,
  tiktok: Music2,
};

const detectIconFromUrl = (url: string): LucideIcon => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("instagram")) return Instagram;
  if (lowerUrl.includes("twitter") || lowerUrl.includes("x.com") || lowerUrl.includes("x/twitter")) return Twitter;
  if (lowerUrl.includes("facebook")) return Facebook;
  if (lowerUrl.includes("tiktok")) return Music2;
  if (lowerUrl.includes("youtube")) return Youtube;
  return Instagram; // Default fallback
};

const getLabelFromUrl = (url: string): string => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("instagram")) return "Instagram";
  if (lowerUrl.includes("twitter") || lowerUrl.includes("x.com") || lowerUrl.includes("x/twitter")) return "X / Twitter";
  if (lowerUrl.includes("facebook")) return "Facebook";
  if (lowerUrl.includes("tiktok")) return "TikTok";
  if (lowerUrl.includes("youtube")) return "YouTube";
  return "Social";
};

const Footer = () => {
  const { content } = useContent();
  
  // Get social links from admin portal
  const adminSocialLinks = content.hero.socialLinks ?? [];
  
  // Map admin social links to footer format, or use fallback if none exist
  const socialLinks = adminSocialLinks.length > 0 
    ? adminSocialLinks
        .filter((link) => link.url && link.url.trim() !== "") // Filter out empty URLs
        .map((link) => ({
          id: link.id,
          href: link.url,
          icon: detectIconFromUrl(link.url),
          label: getLabelFromUrl(link.url),
        }))
    : [
        // Fallback to default links if none are set in admin
        { id: "instagram", href: "https://www.instagram.com/nelngabo/", icon: Instagram, label: "Instagram" },
        { id: "twitter", href: "https://x.com/nelngabo_?s=21", icon: Twitter, label: "X / Twitter" },
        { id: "youtube", href: "https://www.youtube.com/@nelngabo9740", icon: Youtube, label: "YouTube" },
        { id: "facebook", href: "https://facebook.com/nelngabo", icon: Facebook, label: "Facebook" },
        { id: "tiktok", href: "https://www.tiktok.com/@nelngabo", icon: Music2, label: "TikTok" },
      ];

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-black text-white relative"
    >
      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-white/10 pt-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 sm:gap-6 text-sm text-white/60">
            {/* Copyright */}
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
              <span>© {currentYear} NEL NGABO</span>
              <span className="text-white/40">•</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center sm:justify-end items-center gap-2">
              {socialLinks.map(({ id, href, label }, index) => {
                const lowerUrl = href.toLowerCase();
                const isInstagram = lowerUrl.includes("instagram");
                const isTwitter = lowerUrl.includes("twitter") || lowerUrl.includes("x.com");
                const isFacebook = lowerUrl.includes("facebook");
                const isTikTok = lowerUrl.includes("tiktok");
                const isYouTube = lowerUrl.includes("youtube");
                
                return (
                  <a
                    key={id || index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    aria-label={label}
                  >
                    {isInstagram ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.23 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    ) : isTwitter ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ) : isFacebook ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ) : isTikTok ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    ) : isYouTube ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    ) : (
                      <Instagram className="w-4 h-4" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
