import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Music = () => {
  const { content, isLoading } = useContent();
  
  // Sort albums by createdAt (newest first)
  const albums = [...content.albums].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  // Generate structured data for albums
  const albumsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Nel Ngabo Albums",
    "description": "Complete discography of Nel Ngabo albums",
    "itemListElement": albums.map((album, index) => ({
      "@type": "MusicAlbum",
      "position": index + 1,
      "name": album.title,
      "description": album.description || `${album.title} by Nel Ngabo`,
      "image": album.image,
      "datePublished": album.year || new Date(album.createdAt || Date.now()).getFullYear().toString(),
      "byArtist": {
        "@type": "MusicGroup",
        "name": "Nel Ngabo"
      }
    }))
  };

  return (
    <>
      <SEO
        title="Albums & Discography"
        description={`Browse Nel Ngabo's complete discography including ${albums.length > 0 ? albums[0].title : 'latest albums'}. Stream on Spotify, Apple Music, YouTube, and SoundCloud.`}
        image={albums.length > 0 ? albums[0].image : "https://nelngabo.com/hero.jpeg"}
        keywords="Nel Ngabo albums, Nel Ngabo discography, Nel Ngabo music, Nel Ngabo songs, VIBRANIUM, Rwandan music albums, African music albums"
        structuredData={albumsStructuredData}
      />
      <Navbar />
      <div className="min-h-screen bg-black relative overflow-hidden pt-24 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-square rounded-lg bg-white/10" />
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/10" />
                </div>
              ))}
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/60 text-lg">No albums available yet.</p>
            </div>
          ) : (
            <>
              {/* Albums Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                {albums.map((album, index) => {
                  // Split title into main title and subtitle if it contains parentheses
                  const titleParts = album.title.split(/(\([^)]+\))/);
                  const mainTitle = titleParts[0].trim();
                  const subtitle = titleParts[1]?.replace(/[()]/g, '') || '';

                  // Get first streaming link for listen button
                  const firstLink = album.links && album.links.length > 0 ? album.links[0] : null;

                  return (
                    <motion.div
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group"
                    >
                      <div className="relative mb-3">
                        {/* Album Cover */}
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                          <img
                            src={album.image}
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>

                      {/* Title and Info */}
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-white transition-colors">
                            {mainTitle || album.title}
                          </h3>
                          {subtitle && (
                            <p className="text-white/80 text-xs md:text-sm line-clamp-1">
                              {subtitle}
                            </p>
                          )}
                          {album.year && (
                            <p className="text-gray-400 text-xs md:text-sm line-clamp-1">
                              {album.year}
                            </p>
                          )}
                        </div>
                        
                        {/* Listen Album Button */}
                        {firstLink && (
                          <Button
                            asChild
                            className="bg-transparent text-white border border-white rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-white/10 w-full touch-manipulation min-h-[44px]"
                          >
                            <a
                              href={firstLink.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <span>Listen Album</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Music;

