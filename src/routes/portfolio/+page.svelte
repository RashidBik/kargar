<script>
    import Portfolio from '$lib/components/Portfolio.svelte';
</script>

<section class="portfolio-page-hero">
    <div class="container">
        <h1>نمونه کارها</h1>
        <p>مجموعه‌ای از بهترین آثار ما</p>
    </div>
</section>

<Portfolio />

<style>
    .portfolio-page-hero {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: var(--white);
        text-align: center;
        padding: 120px 0 80px;
        margin-top: 80px;
    }
    
    .portfolio-page-hero h1 {
        color: var(--white);
        font-size: 3rem;
        margin-bottom: 20px;
    }
    
    .portfolio-page-hero p {
        font-size: 1.2rem;
        opacity: 0.9;
    }
    
    @media (max-width: 768px) {
        .portfolio-page-hero h1 {
            font-size: 2rem;
        }
    }
</style>