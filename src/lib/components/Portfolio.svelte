<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    
    let portfolioItems = [];
    let categories = [];
    let selectedCategory = 'همه';
    let filteredItems = [];
    let loading = true;
    let error = null;
    
    onMount(async () => {
        await loadPortfolio();
    });
    
    async function loadPortfolio() {
        try {
            loading = true;
            
            // Load categories
            const { data: categoriesData } = await supabase
                .from('portfolio_categories')
                .select('*')
                .order('display_order');
            
            categories = [{ id: 'all', name: 'همه' }, ...(categoriesData || [])];
            
            // Load portfolio items with their images and category
            const { data: itemsData, error: itemsError } = await supabase
                .from('portfolio_items')
                .select(`
                    *,
                    category:portfolio_categories(name),
                    images:portfolio_images(*)
                `)
                .order('display_order');
            
            if (itemsError) throw itemsError;
            
            // Process items to get primary image
            portfolioItems = itemsData.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description || '',
                category: item.category?.name || 'بدون دسته',
                category_id: item.category_id,
                image: item.images?.find(img => img.is_primary)?.image_url || item.images?.[0]?.image_url || '/images/placeholder.jpg',
                allImages: item.images || []
            }));
            
            filterItems();
            
        } catch (e) {
            error = e.message;
            console.error('Error loading portfolio:', e);
        } finally {
            loading = false;
        }
    }
    
    function filterItems() {
        if (selectedCategory === 'همه') {
            filteredItems = portfolioItems;
        } else {
            const selectedCat = categories.find(c => c.name === selectedCategory);
            filteredItems = portfolioItems.filter(item => item.category_id === selectedCat?.id);
        }
    }
    
    $: {
        filterItems();
    }
</script>

<section class="portfolio">
    <div class="container">
        <h2 class="section-title">نمونه کارهای ما</h2>
        
        {#if loading}
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>در حال بارگذاری نمونه کارها...</p>
            </div>
        {:else if error}
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>خطا در بارگذاری نمونه کارها</p>
                <button class="retry-btn" on:click={loadPortfolio}>
                    تلاش مجدد
                </button>
            </div>
        {:else}
            <div class="portfolio-filters">
                {#each categories as category}
                    <button 
                        class="filter-btn {selectedCategory === category.name ? 'active' : ''}"
                        on:click={() => selectedCategory = category.name}
                    >
                        {category.name}
                        {#if category.name !== 'همه' && portfolioItems.filter(i => i.category_id === category.id).length > 0}
                            <span class="count-badge">
                                {portfolioItems.filter(i => i.category_id === category.id).length}
                            </span>
                        {/if}
                    </button>
                {/each}
            </div>
            
            {#if filteredItems.length === 0}
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <p>هیچ نمونه کاری در این دسته یافت نشد</p>
                </div>
            {:else}
                <div class="portfolio-grid">
                    {#each filteredItems as item}
                        <div class="portfolio-item">
                            <div class="portfolio-image">
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    loading="lazy"
                                    on:error={(e) => {
                                        e.target.src = '/images/placeholder.jpg';
                                    }}
                                >
                                <div class="portfolio-overlay">
                                    <h3>{item.title}</h3>
                                    {#if item.description}
                                        <p>{item.description}</p>
                                    {/if}
                                    <span class="category-tag">{item.category}</span>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</section>

<style>
    .portfolio {
        padding: 80px 0;
        background-color: var(--light-bg, #f9f9f9);
    }
    
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .section-title {
        text-align: center;
        margin-bottom: 50px;
        font-size: 2.5rem;
        color: var(--primary-color, #2c3e50);
        position: relative;
        padding-bottom: 20px;
    }
    
    .section-title::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 3px;
        background-color: var(--secondary-color, #e67e22);
    }
    
    /* Loading State */
    .loading-state {
        text-align: center;
        padding: 60px 20px;
    }
    
    .loading-state i {
        font-size: 3rem;
        color: var(--primary-color, #2c3e50);
        margin-bottom: 20px;
    }
    
    .loading-state p {
        color: #666;
        font-size: 1.1rem;
    }
    
    /* Error State */
    .error-state {
        text-align: center;
        padding: 60px 20px;
    }
    
    .error-state i {
        font-size: 3rem;
        color: #e74c3c;
        margin-bottom: 20px;
    }
    
    .error-state p {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 20px;
    }
    
    .retry-btn {
        background-color: var(--secondary-color, #e67e22);
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 8px;
        font-family: 'Vazirmatn', sans-serif;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .retry-btn:hover {
        background-color: #d35400;
        transform: translateY(-2px);
    }
    
    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        background: white;
        border-radius: 12px;
        box-shadow: var(--shadow, 0 2px 10px rgba(0,0,0,0.1));
    }
    
    .empty-state i {
        font-size: 4rem;
        color: #95a5a6;
        margin-bottom: 20px;
    }
    
    .empty-state p {
        color: #7f8c8d;
        font-size: 1.1rem;
    }
    
    /* Filters */
    .portfolio-filters {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        position: relative;
        padding: 10px 25px;
        border: 2px solid var(--primary-color, #2c3e50);
        background: transparent;
        color: var(--primary-color, #2c3e50);
        border-radius: 30px;
        cursor: pointer;
        font-family: 'Vazirmatn', sans-serif;
        font-weight: 500;
        transition: all 0.3s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    .filter-btn:hover,
    .filter-btn.active {
        background: var(--primary-color, #2c3e50);
        color: var(--white, #ffffff);
    }
    
    .count-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        background-color: var(--secondary-color, #e67e22);
        color: white;
        border-radius: 11px;
        font-size: 0.75rem;
        padding: 0 6px;
    }
    
    .filter-btn.active .count-badge {
        background-color: white;
        color: var(--primary-color, #2c3e50);
    }
    
    /* Portfolio Grid */
    .portfolio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
    }
    
    .portfolio-item {
        border-radius: 10px;
        overflow: hidden;
        box-shadow: var(--shadow, 0 2px 10px rgba(0,0,0,0.1));
        transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .portfolio-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    
    .portfolio-image {
        position: relative;
        height: 300px;
        overflow: hidden;
    }
    
    .portfolio-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
    }
    
    .portfolio-item:hover img {
        transform: scale(1.1);
    }
    
    .portfolio-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to top, rgba(44,62,80,0.95), rgba(230,126,34,0.8));
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 30px;
        color: var(--white, #ffffff);
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .portfolio-item:hover .portfolio-overlay {
        opacity: 1;
    }
    
    .portfolio-overlay h3 {
        color: var(--white, #ffffff);
        margin-bottom: 10px;
        font-size: 1.3rem;
    }
    
    .portfolio-overlay p {
        margin-bottom: 15px;
        font-size: 0.95rem;
        opacity: 0.9;
    }
    
    .category-tag {
        background: var(--secondary-color, #e67e22);
        color: var(--white, #ffffff);
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.85rem;
        align-self: flex-start;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .section-title {
            font-size: 2rem;
        }
        
        .portfolio-grid {
            grid-template-columns: 1fr;
        }
        
        .portfolio-filters {
            gap: 10px;
        }
        
        .filter-btn {
            padding: 8px 16px;
            font-size: 0.9rem;
        }
    }
</style>