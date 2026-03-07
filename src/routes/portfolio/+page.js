// src/routes/portfolio/+page.js
import { supabase } from '$lib/supabase';

export const load = async () => {
  // Get categories count for better description
  const { count } = await supabase
    .from('portfolio_categories')
    .select('*', { count: 'exact', head: true });
  
  return {
    title: "نمونه کارها",
    description: `مشاهده نمونه کارهای مطبعه کارگر در ${count || 'دسته‌بندی‌های'} مختلف شامل لوحه برجسته، چاپ دیجیتال، چاپ افست و بسته‌بندی`,
    image: "/images/portfolio-preview.jpg"
  };
};