// src/sitemap.js
import { supabase } from '$lib/supabase';

export const sitemap = async () => {
  // Fetch dynamic routes from Supabase
  const { data: portfolioItems } = await supabase
    .from('portfolio_items')
    .select('slug, updated_at');
  
  const { data: categories } = await supabase
    .from('portfolio_categories')
    .select('slug');
  
  // Build sitemap
  const pages = [];
  
  // Static routes
  pages.push({ path: '/', priority: '1.0', changefreq: 'daily' });
  pages.push({ path: '/about', priority: '0.8', changefreq: 'monthly' });
  pages.push({ path: '/contact', priority: '0.8', changefreq: 'monthly' });
  pages.push({ path: '/portfolio', priority: '0.9', changefreq: 'weekly' });
  
  // Dynamic portfolio routes
  if (portfolioItems) {
    portfolioItems.forEach(item => {
      pages.push({
        path: `/portfolio/${item.slug}`,
        lastmod: item.updated_at,
        priority: '0.7',
        changefreq: 'monthly'
      });
    });
  }
  
  // Category routes
  if (categories) {
    categories.forEach(cat => {
      pages.push({
        path: `/portfolio/category/${cat.slug}`,
        priority: '0.6',
        changefreq: 'weekly'
      });
    });
  }
  
  return pages;
};