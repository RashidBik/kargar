// src/routes/+layout.js
export const load = () => {
  return {
    // Basic site info
    sitename: "مطبعه کارگر",
    title: "خانه",
    titleTemplate: "مطبعه کارگر - %s",
    description: "مطبعه کارگر در مزارشریف افغانستان - انواع چاپ دیجیتال، افست، لوحه برجسته و خدمات چاپی با بالاترین کیفیت",
    
    // Canonical URL
    canonical: "https://kargar-printing.af",
    
    // Theme and color scheme
    theme: "#1e40af", // آبی لاجوردی
    colorScheme: "light",
    
    // Author
    author: "مطبعه کارگر",
    
    // Default Open Graph image
    image: {
      url: "https://kargar-printing.af/og-image.jpg",
      alt: "مطبعه کارگر - خدمات چاپ در مزارشریف",
      width: 1200,
      height: 630
    }
  };
};