<!-- src/routes/admin/login/+page.svelte -->
 <!-- khalidKargar@420 -->
<script>
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';
    import { securityMonitor } from '$lib/securityMonitor';
    
    let email = '';
    let password = '';
    let loading = false;
    let error = '';
    
    async function handleLogin() {
        loading = true;
        error = '';
        
        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            // Log the attempt
            await securityMonitor.logLoginAttempt(email, !authError);
            
            if (authError) throw authError;
            
            goto('/admin/portfolio');
        } catch (e) {
            error = 'ایمیل یا رمز عبور اشتباه است';
        } finally {
            loading = false;
        }
    }
</script>


<div class="login-container">
    <div class="login-box">
        <h1>ورود به پنل مدیریت</h1>
        <p class="subtitle">مطبعه کارگر - مزارشریف</p>
        
        <form on:submit|preventDefault={handleLogin}>
            <div class="form-group">
                <label>ایمیل</label>
                <input 
                    type="email" 
                    bind:value={email}
                    placeholder="admin@kargar.af"
                    required
                >
            </div>
            
            <div class="form-group">
                <label>رمز عبور</label>
                <input 
                    type="password" 
                    bind:value={password}
                    placeholder="••••••••"
                    required
                >
            </div>
            
            {#if error}
                <div class="error-message">
                    {error}
                </div>
            {/if}
            
            <button type="submit" class="login-btn" disabled={loading}>
                {#if loading}
                    <i class="fas fa-spinner fa-spin"></i> در حال ورود...
                {:else}
                    ورود به پنل
                {/if}
            </button>
        </form>
    </div>
</div>

<style>
    .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary-color, #2c3e50), #1a2632);
        padding: 20px;
    }
    
    .login-box {
        background: white;
        padding: 40px;
        border-radius: 16px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    
    .login-box h1 {
        color: var(--primary-color, #2c3e50);
        margin: 0 0 10px 0;
        text-align: center;
    }
    
    .subtitle {
        text-align: center;
        color: #666;
        margin-bottom: 30px;
        font-size: 0.95rem;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    label {
        display: block;
        margin-bottom: 8px;
        color: var(--primary-color, #2c3e50);
        font-weight: 500;
    }
    
    input {
        width: 100%;
        padding: 12px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-family: 'Vazirmatn', sans-serif;
        font-size: 1rem;
    }
    
    input:focus {
        outline: none;
        border-color: var(--secondary-color, #e67e22);
    }
    
    .login-btn {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, var(--secondary-color, #e67e22), #d35400);
        color: white;
        border: none;
        border-radius: 8px;
        font-family: 'Vazirmatn', sans-serif;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .login-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(230,126,34,0.3);
    }
    
    .login-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .error-message {
        background: #fee;
        color: #e74c3c;
        padding: 10px;
        border-radius: 6px;
        margin-bottom: 20px;
        text-align: center;
    }
</style>