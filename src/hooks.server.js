// src/hooks.server.js
import { supabase } from '$lib/supabase';

export async function handle({ event, resolve }) {
  const { url } = event;
  
  // Get the response
  const response = await resolve(event);
  
  // Add CSP headers with ALLOWED sources
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://maps.googleapis.com https://maps.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; " +
    "img-src 'self' data: https://images.unsplash.com https://e1.pxfuel.com https://*.supabase.co https://thumbs.dreamstime.com https://img.freepik.com https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://*.google.com; " +
    "font-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.gstatic.com; " +
    "frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com; " + // ← IMPORTANT for maps
    "connect-src 'self' https://*.supabase.co https://maps.googleapis.com https://formspree.io;" 
  );
  
  // Handle admin routes
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return new Response(null, {
          status: 302,
          headers: { Location: '/admin/login' }
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  }
  
  return response;
}