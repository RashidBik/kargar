<script>
    import { portfolioItems } from '$lib/data/Portfolio';
    
    
    let categories = ['همه', ...new Set(portfolioItems.map(item => item.category))];
    let selectedCategory = 'همه';
    let filteredItems = portfolioItems;
    
    $: {
        if (selectedCategory === 'همه') {
            filteredItems = portfolioItems;
        } else {
            filteredItems = portfolioItems.filter(item => item.category === selectedCategory);
        }
    }
</script>

<section class="portfolio">
    <div class="container">
        <h2 class="section-title">نمونه کارهای ما</h2>
        
        <div class="portfolio-filters">
            {#each categories as category}
                <button 
                    class="filter-btn {selectedCategory === category ? 'active' : ''}"
                    on:click={() => selectedCategory = category}
                >
                    {category}
                </button>
            {/each}
        </div>
        
        <div class="portfolio-grid">
            {#each filteredItems as item}
                <div class="portfolio-item">
                    <div class="portfolio-image">
                        <img src={item.image} alt={item.title}>
                        <div class="portfolio-overlay">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <span class="category-tag">{item.category}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .portfolio {
        background-color: var(--white);
    }
    
    .portfolio-filters {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        padding: 10px 25px;
        border: 2px solid var(--primary-color);
        background: transparent;
        color: var(--primary-color);
        border-radius: 30px;
        cursor: pointer;
        font-family: 'Vazirmatn', sans-serif;
        font-weight: 500;
        transition: all 0.3s;
    }
    
    .filter-btn:hover,
    .filter-btn.active {
        background: var(--primary-color);
        color: var(--white);
    }
    
    .portfolio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
    }
    
    .portfolio-item {
        border-radius: 10px;
        overflow: hidden;
        box-shadow: var(--shadow);
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
        color: var(--white);
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .portfolio-item:hover .portfolio-overlay {
        opacity: 1;
    }
    
    .portfolio-overlay h3 {
        color: var(--white);
        margin-bottom: 10px;
        font-size: 1.3rem;
    }
    
    .portfolio-overlay p {
        margin-bottom: 15px;
        font-size: 0.95rem;
        opacity: 0.9;
    }
    
    .category-tag {
        background: var(--secondary-color);
        color: var(--white);
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.85rem;
        align-self: flex-start;
    }
    
    @media (max-width: 768px) {
        .portfolio-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
