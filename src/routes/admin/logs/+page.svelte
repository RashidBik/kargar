<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    
    let logs = [];
    let loading = true;
    let filter = 'all';
    
    onMount(async () => {
        await loadLogs();
    });
    
    async function loadLogs() {
        loading = true;
        
        let query = supabase
            .from('security_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (filter !== 'all') {
            query = query.eq('event_type', filter);
        }
        
        const { data } = await query;
        logs = data || [];
        loading = false;
    }
    
    function getEventColor(type) {
        if (type.includes('login')) return '#3498db';
        if (type.includes('admin')) return '#e67e22';
        if (type.includes('form')) return '#2ecc71';
        if (type.includes('suspicious')) return '#e74c3c';
        return '#95a5a6';
    }
</script>

<div class="logs-container">
    <h1>گزارش‌های امنیتی</h1>
    
    <div class="filters">
        <button 
            class={filter === 'all' ? 'active' : ''} 
            on:click={() => { filter = 'all'; loadLogs(); }}
        >همه</button>
        <button 
            class={filter === 'login_attempt' ? 'active' : ''} 
            on:click={() => { filter = 'login_attempt'; loadLogs(); }}
        >ورودها</button>
        <button 
            class={filter === 'admin_access' ? 'active' : ''} 
            on:click={() => { filter = 'admin_access'; loadLogs(); }}
        >دسترسی ادمین</button>
        <button 
            class={filter === 'form_submission' ? 'active' : ''} 
            on:click={() => { filter = 'form_submission'; loadLogs(); }}
        >فرم‌ها</button>
    </div>
    
    {#if loading}
        <p class="loading">در حال بارگذاری...</p>
    {:else if logs.length === 0}
        <p class="empty">هیچ گزارشی یافت نشد</p>
    {:else}
        <div class="logs-list">
            {#each logs as log}
                <div class="log-item" style="border-right-color: {getEventColor(log.event_type)}">
                    <div class="log-header">
                        <span class="log-type">{log.event_type}</span>
                        <span class="log-time">
                            {new Date(log.created_at).toLocaleDateString('fa-IR')}
                            {new Date(log.created_at).toLocaleTimeString('fa-IR')}
                        </span>
                    </div>
                    
                    {#if log.email}
                        <div class="log-email">📧 {log.email}</div>
                    {/if}
                    
                    {#if log.details}
                        <pre class="log-details">{JSON.stringify(log.details, null, 2)}</pre>
                    {/if}
                    
                    <div class="log-meta">
                        <span>🌐 {log.ip_address}</span>
                        <span>📱 {log.user_agent?.substring(0, 50)}...</span>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .logs-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    h1 {
        color: var(--primary-color);
        margin-bottom: 20px;
    }
    
    .filters {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        flex-wrap: wrap;
    }
    
    .filters button {
        padding: 8px 16px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .filters button.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .logs-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .log-item {
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        border-right: 4px solid #95a5a6;
    }
    
    .log-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    
    .log-type {
        font-weight: bold;
        color: #2c3e50;
    }
    
    .log-time {
        color: #7f8c8d;
        font-size: 0.85rem;
    }
    
    .log-email {
        color: #e67e22;
        margin-bottom: 10px;
        font-size: 0.95rem;
    }
    
    .log-details {
        background: #f8f9fa;
        padding: 10px;
        border-radius: 4px;
        font-size: 0.85rem;
        margin: 10px 0;
        overflow-x: auto;
    }
    
    .log-meta {
        display: flex;
        gap: 20px;
        font-size: 0.8rem;
        color: #95a5a6;
        border-top: 1px solid #ecf0f1;
        padding-top: 10px;
    }
    
    .loading, .empty {
        text-align: center;
        padding: 40px;
        color: #7f8c8d;
    }
</style>