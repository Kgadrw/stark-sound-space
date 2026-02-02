import ToursSection from "@/components/ToursSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { useContent } from "@/context/ContentContext";

const Tours = () => {
  const { content } = useContent();
  const tours = content.tours || [];
  
  // Generate structured data for tours
  const toursStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Nel Ngabo Tour Dates",
    "description": "Upcoming tour dates and concert information for Nel Ngabo",
    "itemListElement": tours.map((tour, index) => ({
      "@type": "Event",
      "position": index + 1,
      "name": tour.title || `Nel Ngabo Concert`,
      "description": tour.description || `Concert by Nel Ngabo`,
      "startDate": tour.date || tour.createdAt,
      "location": {
        "@type": "Place",
        "name": tour.venue || "TBA",
        "address": tour.location || ""
      },
      "performer": {
        "@type": "MusicGroup",
        "name": "Nel Ngabo"
      }
    }))
  };

  return (
    <>
      <SEO
        title="Tour Dates & Events"
        description={`Discover Nel Ngabo's upcoming tour dates, concert venues, and ticket information. ${tours.length > 0 ? `Next show: ${tours[0].title || 'Coming soon'}` : 'Check back for upcoming events.'}`}
        image="https://nelngabo.com/hero.jpeg"
        keywords="Nel Ngabo tours, Nel Ngabo concerts, Nel Ngabo tour dates, Nel Ngabo events, Rwandan music concerts, African music tours"
        structuredData={toursStructuredData}
      />
      <Navbar />
      <div className="min-h-screen bg-black relative overflow-hidden pt-16">
        <ToursSection />
        <Footer />
      </div>
    </>
  );
};

export default Tours;
