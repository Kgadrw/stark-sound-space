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
        className="bg-black text-white py-12 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center"
          >
            <img 
              src="/kinamusic.png" 
              alt="KINA MUSIC" 
              className="h-12 md:h-16 w-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-normal text-white"
          >
            NEL NGABO
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex space-x-4 md:space-x-6 items-center justify-center"
          >
            {socialLinks.map(({ id, href, icon: Icon, label }, index) => (
              <motion.a
                key={id || index}
                href={href}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center"
                aria-label={label}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </motion.a>
            ))}
            
            {/* Email Icon */}
            <motion.a
              href="mailto:nelngabo1@gmail.com"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + socialLinks.length * 0.1, type: "spring" }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center"
              aria-label="Email"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
            </motion.a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-400"
          >
            © {new Date().getFullYear()} NEL NGABO. ALL RIGHTS RESERVED.
          </motion.p>
        </div>
      </div>
        
        {/* Powered by kgad - Bottom Right */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-4 right-4 sm:right-6"
        >
          <a
            href="https://linktr.ee/gadkalisa?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn0PLsFLZd2YSLpgDw_dOAn18oaBArs7i4qZjbp8TsHDNhIw4mxMo_ffRcGFY_aem_jjk3dfEQVikEqOTBnZsaGQ&brid=NIusz0WLIVMiYQakpSSWLA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/40 flex items-center gap-1 group"
          >
            <span>powered by</span>
            <span className="chewy-regular text-white/60 group-hover:text-white transition-colors">kgad</span>
          </a>
        </motion.div>
    </motion.footer>
    </>
  );
};

export default Footer;
