import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object;
}

const SEO = ({
  title = "Nel Ngabo | Official Website",
  description = "Official website of Nel Ngabo - Rwandan music artist. Stream latest albums including VIBRANIUM, watch official videos, discover tour dates, and explore exclusive content.",
  image = "https://nelngabo.com/hero.jpeg",
  url,
  type = "website",
  keywords,
  author = "Nel Ngabo",
  publishedTime,
  modifiedTime,
  structuredData,
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
    if (author) {
      updateMetaTag("author", author);
    }

    // Open Graph tags
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:image:secure_url", image, true);
    updateMetaTag("og:image:width", "1200", true);
    updateMetaTag("og:image:height", "630", true);
    updateMetaTag("og:image:alt", fullTitle, true);
    updateMetaTag("og:image:type", "image/jpeg", true);
    updateMetaTag("og:url", currentUrl, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:site_name", "Nel Ngabo Official", true);
    updateMetaTag("og:locale", "en_US", true);
    if (publishedTime) {
      updateMetaTag("article:published_time", publishedTime, true);
    }
    if (modifiedTime) {
      updateMetaTag("article:modified_time", modifiedTime, true);
    }
    if (author) {
      updateMetaTag("article:author", author, true);
    }

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:site", "@nelngabo");
    updateMetaTag("twitter:creator", "@nelngabo");
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:image:alt", fullTitle);
    updateMetaTag("twitter:url", currentUrl);

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

    // Add structured data if provided
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-dynamic", "true");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, image, url, type, keywords, author, publishedTime, modifiedTime, structuredData, currentUrl, fullTitle]);

  return null;
};

export default SEO;

