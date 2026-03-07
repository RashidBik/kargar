<!-- src/routes/admin/+layout.svelte -->
<script>
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    let user = null;
    let loading = true;
    
    onMount(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        user = session?.user ?? null;
        loading = false;
        
        if (!user) {
            goto('/admin/login');
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            user = session?.user ?? null;
            if (!user) {
                goto('/admin/login');
            }
        });
        
        return () => subscription?.unsubscribe();
    });
</script>

{#if loading}
    <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
    </div>
{:else if user}
    <div class="admin-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>مطبعه کارگر</h2>
                <p>پنل مدیریت</p>
            </div>
            
            <nav class="sidebar-nav">
                <a href="/admin/portfolio" class="nav-item active">
                    <i class="fas fa-images"></i>
                    <span>نمونه کارها</span>
                </a>
                <a href="/admin/logs" class="nav-item">
                        <i class="fas fa-shield-alt"></i>
                    <span>گزارش‌های امنیتی</span>
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    <span>{user.email}</span>
                </div>
                <button class="logout-btn" on:click={() => supabase.auth.signOut()}>
                    <i class="fas fa-sign-out-alt"></i>
                    خروج
                </button>
            </div>
        </aside>
        
        <!-- Main Content -->
        <main class="main-content">
            <slot />
        </main>
    </div>
{/if}

<style>
    .loading {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: var(--primary-color, #2c3e50);
    }
    
    .admin-layout {
        display: flex;
        min-height: 100vh;
        direction: rtl;
    }
    
    .sidebar {
        width: 280px;
        background: linear-gradient(180deg, var(--primary-color, #2c3e50), #1a2632);
        color: white;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
    }
    
    .sidebar-header {
        padding: 30px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .sidebar-header h2 {
        margin: 0;
        font-size: 1.5rem;
    }
    
    .sidebar-header p {
        margin: 5px 0 0;
        opacity: 0.7;
        font-size: 0.9rem;
    }
    
    .sidebar-nav {
        flex: 1;
        padding: 20px;
    }
    
    .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 15px;
        color: rgba(255,255,255,0.7);
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s;
        margin-bottom: 5px;
    }
    
    .nav-item:hover {
        background: rgba(255,255,255,0.1);
        color: white;
    }
    
    .nav-item.active {
        background: var(--secondary-color, #e67e22);
        color: white;
    }
    
    .sidebar-footer {
        padding: 20px;
        border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .logout-btn {
        width: 100%;
        padding: 10px;
        background: rgba(255,255,255,0.1);
        border: none;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s;
    }
    
    .logout-btn:hover {
        background: #e74c3c;
    }
    
    .main-content {
        flex: 1;
        margin-right: 280px;
        background: #f5f5f5;
        min-height: 100vh;
    }
    
    @media (max-width: 768px) {
        .sidebar {
            width: 100%;
            position: relative;
            height: auto;
        }
        
        .main-content {
            margin-right: 0;
        }
        
        .admin-layout {
            flex-direction: column;
        }
    }
</style>