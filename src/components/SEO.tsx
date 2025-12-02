import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

const SEO = ({
  title = "Nel Ngabo | Official Website",
  description = "Official website of Nel Ngabo - Rwandan music artist. Stream latest albums including VIBRANIUM, watch official videos, discover tour dates, and explore exclusive content.",
  image = "https://nelngabo.com/hero.jpeg",
  url,
  type = "website",
  keywords,
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = url || `https://nelngabo.com${location.pathname}`;
  const fullTitle = title.includes("Nel Ngabo") ? title : `${title} | Nel Ngabo`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic meta tags
    updateMetaTag("description", description);
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }

    // Open Graph tags
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:url", currentUrl, true);
    updateMetaTag("og:type", type, true);

    // Twitter tags
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:url", currentUrl);

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;
  }, [title, description, image, url, type, keywords, currentUrl, fullTitle]);

  return null;
};

export default SEO;

