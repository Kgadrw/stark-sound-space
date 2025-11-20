import { useEffect } from "react";
import { useContent } from "@/context/ContentContext";

const ColorTheme = () => {
  const { content } = useContent();
  const colorSettings = content.hero.colorSettings;

  useEffect(() => {
    if (!colorSettings) return;

    const root = document.documentElement;
    
    if (colorSettings.colorType === "solid") {
      // Apply solid color
      root.style.setProperty("--theme-background", colorSettings.solidColor);
      root.style.setProperty("--theme-background-gradient", `linear-gradient(to bottom, ${colorSettings.solidColor}, ${colorSettings.solidColor})`);
    } else if (colorSettings.colorType === "gradient") {
      // Apply gradient
      const gradient = `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`;
      root.style.setProperty("--theme-background", colorSettings.gradientColors.startColor);
      root.style.setProperty("--theme-background-gradient", gradient);
    }

    // Calculate background style
    const backgroundStyle = colorSettings.colorType === "solid" 
      ? colorSettings.solidColor 
      : `linear-gradient(${colorSettings.gradientColors.direction}, ${colorSettings.gradientColors.startColor}, ${colorSettings.gradientColors.endColor})`;

    // Apply to body background
    document.body.style.background = backgroundStyle;
    document.body.style.minHeight = "100vh";

    // Apply to all sections with bg-black or bg-background classes
    const sections = document.querySelectorAll("section, .bg-black, .bg-background, [class*='bg-black'], [class*='bg-background']");
    sections.forEach((section) => {
      const htmlEl = section as HTMLElement;
      // Only apply if it's a section or has bg-black/background class
      if (htmlEl.tagName === "SECTION" || 
          htmlEl.classList.contains("bg-black") || 
          htmlEl.classList.contains("bg-background") ||
          Array.from(htmlEl.classList).some(cls => cls.includes("bg-black"))) {
        htmlEl.style.background = backgroundStyle;
      }
    });

    // Apply to navbar
    const navbars = document.querySelectorAll("nav, .navbar");
    navbars.forEach((nav) => {
      const htmlEl = nav as HTMLElement;
      if (htmlEl.classList.contains("bg-black") || htmlEl.tagName === "NAV") {
        htmlEl.style.background = backgroundStyle;
      }
    });

    // Apply to main containers
    const mainContainers = document.querySelectorAll("main, .min-h-screen");
    mainContainers.forEach((container) => {
      const htmlEl = container as HTMLElement;
      if (htmlEl.classList.contains("bg-black") || htmlEl.classList.contains("bg-background")) {
        htmlEl.style.background = backgroundStyle;
      }
    });

    // Apply title text color
    if (colorSettings.titleTextColor) {
      root.style.setProperty("--title-text-color", colorSettings.titleTextColor);
    }
  }, [colorSettings]);

  return null; // This component doesn't render anything
};

export default ColorTheme;

