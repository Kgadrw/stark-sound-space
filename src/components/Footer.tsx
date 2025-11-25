import { motion } from "framer-motion";
import { Instagram, Twitter, Youtube, Facebook, Music2, Mail, type LucideIcon } from "lucide-react";
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


  const chewyStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Chewy&display=swap');
    .chewy-regular {
      font-family: "Chewy", system-ui;
      font-weight: 400;
      font-style: normal;
    }
  `;

  return (
    <>
      <style>{chewyStyle}</style>
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-black text-white relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
          {/* Logo in Center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <img 
              src="/kinamusic.png" 
              alt="KINA MUSIC" 
              className="h-10 sm:h-12 lg:h-14 w-auto"
            />
          </motion.div>

          {/* Copyright and Links - Single Line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 sm:mb-8"
          >
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-white/60">
              <span>© 2025 NEL NGABO</span>
              <span className="text-white/40">|</span>
              <span>ALL RIGHTS RESERVED</span>
              <span className="text-white/40">|</span>
              <a
                href="https://linktr.ee/gadkalisa?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn0PLsFLZd2YSLpgDw_dOAn18oaBArs7i4qZjbp8TsHDNhIw4mxMo_ffRcGFY_aem_jjk3dfEQVikEqOTBnZsaGQ&brid=NIusz0WLIVMiYQakpSSWLA"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors"
              >
                <span className="chewy-regular">powered by kgad</span>
              </a>
            </div>
          </motion.div>

          {/* Social Icons at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {socialLinks.map(({ id, href, icon: Icon, label }, index) => (
              <motion.a
                key={id || index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 sm:w-11 sm:h-11 lg:w-9 lg:h-9 rounded-full border border-white/20 hover:border-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center touch-manipulation group"
                aria-label={label}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-white/80 group-hover:text-white transition-colors" />
              </motion.a>
            ))}
            <motion.a
              href="mailto:nelngabo1@gmail.com"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + socialLinks.length * 0.05, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 sm:w-11 sm:h-11 lg:w-9 lg:h-9 rounded-full border border-white/20 hover:border-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center touch-manipulation group"
              aria-label="Email"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-white/80 group-hover:text-white transition-colors" />
            </motion.a>
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;
