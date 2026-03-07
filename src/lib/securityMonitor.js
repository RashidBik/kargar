// src/lib/securityMonitor.js
import { supabase } from './supabase';

export const securityMonitor = {
    // Log any security event
    async log(eventType, data = {}) {
        try {
            // Get client info if in browser
            const ipAddress = typeof window !== 'undefined' ? 
                'client-side' : 'server-side';
            
            const userAgent = typeof window !== 'undefined' ? 
                window.navigator.userAgent : 'server';
            
            const logEntry = {
                event_type: eventType,
                email: data.email || null,
                ip_address: ipAddress,
                user_agent: userAgent,
                details: data
            };
            
            // Save to Supabase
            const { error } = await supabase
                .from('security_logs')
                .insert([logEntry]);
            
            if (error) {
                console.error('Failed to save security log:', error);
            }
            
            // Also log to console in development
            if (import.meta.env.DEV) {
                console.log(`🔐 Security Event [${eventType}]:`, data);
            }
            
        } catch (e) {
            console.error('Security monitor error:', e);
        }
    },
    
    // Helper methods for common events
    async logLoginAttempt(email, success) {
        await this.log('login_attempt', {
            email,
            success,
            timestamp: new Date().toISOString()
        });
    },
    
    async logAdminAccess(path, email, allowed) {
        await this.log('admin_access', {
            path,
            email,
            allowed,
            timestamp: new Date().toISOString()
        });
    },
    
    async logFormSubmission(formType, email) {
        await this.log('form_submission', {
            form_type: formType,
            email,
            timestamp: new Date().toISOString()
        });
    },
    
    async logSuspiciousActivity(activity, details) {
        await this.log('suspicious', {
            activity,
            ...details,
            timestamp: new Date().toISOString()
        });
    }
};

