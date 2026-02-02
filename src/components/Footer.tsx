import { motion } from "framer-motion";
import { Instagram, Twitter, Youtube, Facebook, Music2, Mail, Music4, Disc3, Radio, Music3, type LucideIcon } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import type { IconPreset } from "@/types/content";

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

const streamingIconMap: Record<IconPreset, LucideIcon> = {
  spotify: Music4,
  appleMusic: Disc3,
  youtube: Youtube,
  soundcloud: Radio,
  boomplay: Music3,
  tiktok: Music2,
  instagram: Instagram,
  x: Twitter,
  facebook: Facebook,
  mail: Mail,
  phone: Mail,
  website: Mail,
};

const resolveStreamingIcon = (preset: IconPreset) => streamingIconMap[preset] ?? Music4;

const Footer = () => {
  const { content } = useContent();
  
  // Get social links from admin portal
  const adminSocialLinks = content.hero.socialLinks ?? [];
  
  // Get streaming platforms
  const streamingPlatforms = content.hero.streamingPlatforms ?? [];
  const allowedStreamingPresets: IconPreset[] = ["spotify", "appleMusic", "youtube", "soundcloud", "boomplay"];
  const visibleStreamingPlatforms = streamingPlatforms.filter((platform) => allowedStreamingPresets.includes(platform.preset));
  
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        {/* Streaming Platforms Section */}
        {visibleStreamingPlatforms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-white/60 text-xs uppercase tracking-[0.2em] mb-4 text-center">Streaming Platforms</h3>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {visibleStreamingPlatforms.map((platform, index) => {
                const Icon = resolveStreamingIcon(platform.preset);
                const isSpotify = platform.preset === "spotify";
                const isAppleMusic = platform.preset === "appleMusic";
                const isYouTube = platform.preset === "youtube";
                const isBoomplay = platform.preset === "boomplay";
                
                return (
                  <motion.a
                    key={platform.id}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition"
                  >
                    {isSpotify ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1DB954">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                    ) : isAppleMusic ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                    ) : isYouTube ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#FF0000">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    ) : isBoomplay ? (
                      <img src="/Boom.png" alt="Boomplay" className="h-5 w-5 object-contain" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                    <span className="text-xs sm:text-sm uppercase tracking-[0.15em] whitespace-nowrap">{platform.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
        
        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-white/10 pt-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 sm:gap-6 text-sm text-white/60">
            {/* Copyright */}
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 order-1 sm:order-1">
              <span>© {currentYear} NEL NGABO</span>
              <span className="text-white/40">•</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>

            {/* Social Links - Center */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center order-2 sm:order-2">
              {socialLinks
                .filter(({ href }) => {
                  const lowerUrl = href.toLowerCase();
                  return !lowerUrl.includes("youtube") && !lowerUrl.includes("mailto:");
                })
                .map(({ id, href, label }, index) => {
                const lowerUrl = href.toLowerCase();
                const isInstagram = lowerUrl.includes("instagram");
                const isTwitter = lowerUrl.includes("twitter") || lowerUrl.includes("x.com");
                const isFacebook = lowerUrl.includes("facebook");
                const isTikTok = lowerUrl.includes("tiktok");
                
                return (
                  <motion.a
                    key={id || index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.05, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 hover:bg-white/10 transition-all duration-300 flex items-center justify-center touch-manipulation group"
                    aria-label={label}
                  >
                    {isInstagram ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                        <defs>
                          <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#833AB4" />
                            <stop offset="50%" stopColor="#FD1D1D" />
                            <stop offset="100%" stopColor="#FCAF45" />
                          </linearGradient>
                        </defs>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.23 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagram-gradient)"/>
                      </svg>
                    ) : isTwitter ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ) : isFacebook ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ) : isTikTok ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    ) : (
                      <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white transition-colors" />
                    )}
                  </motion.a>
                );
              })}
            </div>

            {/* Powered by */}
            <div className="flex justify-center sm:justify-end order-3 sm:order-3">
              <a
                href="https://linktr.ee/gadkalisa?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn0PLsFLZd2YSLpgDw_dOAn18oaBArs7i4qZjbp8TsHDNhIw4mxMo_ffRcGFY_aem_jjk3dfEQVikEqOTBnZsaGQ&brid=NIusz0WLIVMiYQakpSSWLA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white/80 transition-colors text-xs uppercase tracking-wider"
              >
                Powered by KGAD
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
