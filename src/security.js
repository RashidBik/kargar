// src/lib/security.js
export const securityLog = {
  async logEvent(event, details) {
    // In production, send to a logging service
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        event,
        ...details
      }));
      
      // You could also save to Supabase
      // await supabase.from('security_logs').insert({ event, details });
    }
  }
};

// Use it in forms
// await securityLog.logEvent('contact_form_submission', { email: formData.email });