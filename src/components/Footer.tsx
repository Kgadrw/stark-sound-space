import { motion } from "framer-motion";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { href: "https://www.instagram.com/nelngabo/", icon: Instagram, label: "Instagram" },
    { href: "https://twitter.com/nelngabo", icon: Twitter, label: "Twitter" },
    { href: "https://www.youtube.com/@nelngabo9740", icon: Youtube, label: "YouTube" },
    { href: "https://facebook.com/nelngabo", icon: Facebook, label: "Facebook" },
  ];


  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-black text-white py-12"
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
            className="text-3xl font-normal"
          >
            NEL NGABO
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex space-x-6"
          >
            {socialLinks.map(({ href, icon: Icon, label }, index) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-400"
          >
            © 2024 NEL NGABO. ALL RIGHTS RESERVED.
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
