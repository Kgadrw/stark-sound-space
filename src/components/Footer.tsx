import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-3xl font-bold tracking-tighter">NEL NGABO</div>
          
          <div className="flex space-x-6">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="hover:text-gray-400 transition-colors">
              PRIVACY POLICY
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              TERMS OF SERVICE
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              CONTACT
            </a>
          </div>
          
          <p className="text-sm text-gray-400">
            © 2024 NEL NGABO. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
