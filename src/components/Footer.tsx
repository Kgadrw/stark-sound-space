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
              {socialLinks.map(({ id, href, icon: Icon, label }, index) => (
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
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center touch-manipulation group"
                  aria-label={label}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
              <motion.a
                href="mailto:nelngabo1@gmail.com"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + socialLinks.length * 0.05, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center touch-manipulation group"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" />
              </motion.a>
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
