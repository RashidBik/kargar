<script>
import { onMount } from "svelte";
    let currentSlide = 0;
    
    const slides = [
        {
            image: 'https://thumbs.dreamstime.com/b/advanced-cnc-machining-process-sparks-precision-engineering-captivating-image-showcases-detailed-view-369813976.jpg',
            title: 'لوحه برجسته با کیفیت عالی',
            description: 'تخصص ما در ساخت لوحه‌های برجسته و تندیس‌های افتخار'
        },
        {
            image: 'https://e1.pxfuel.com/desktop-wallpaper/230/800/desktop-wallpaper-digital-printing.jpg',
            title: 'انواع چاپ دیجیتال و افست',
            description: 'از کارت ویزیت تا بیلبوردهای تبلیغاتی'
        }
    ];
    
    onMount(() => {
        const interval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
        }, 5000);
        
        return () => clearInterval(interval);
    });
</script>

<section class="hero" style:background-image={`url(${slides[currentSlide].image})`}>
    <div class="hero-overlay"></div>
    <div class="container hero-content">
        <h1 class="hero-title">{slides[currentSlide].title}</h1>
        <p class="hero-description">{slides[currentSlide].description}</p>
        <div class="hero-buttons">
            <a href="/portfolio" class="btn">مشاهده نمونه کارها</a>
            <a href="/contact" class="btn btn-outline">درخواست مشاوره</a>
        </div>
    </div>
    
    <div class="slide-dots">
        {#each slides as _, index}
            <button 
                class="dot {index === currentSlide ? 'active' : ''}"
                on:click={() => currentSlide = index}
            ></button>
        {/each}
    </div>
</section>

<style>
    .hero {
        height: 100vh;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        position: relative;
        display: flex;
        align-items: center;
        text-align: center;
        color: var(--white);
        margin-top: 80px;
    }
    
    .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(44,62,80,0.9) 0%, rgb(230 126 34 / 27%) 100%);
    }
    
    .hero-content {
        position: relative;
        z-index: 1;
        max-width: 800px;
    }
    
    .hero-title {
        font-size: 3.5rem;
        margin-bottom: 20px;
        color: var(--white);
        animation: fadeInUp 1s ease;
    }
    
    .hero-description {
        font-size: 1.2rem;
        margin-bottom: 30px;
        animation: fadeInUp 1s ease 0.2s both;
    }
    
    .hero-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
        animation: fadeInUp 1s ease 0.4s both;
    }
    
    .btn-outline {
        background: transparent;
        border: 2px solid var(--white);
    }
    
    .btn-outline:hover {
        background: var(--white);
        color: var(--primary-color);
    }
    
    .slide-dots {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 1;
    }
    
    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255,255,255,0.5);
        border: none;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .dot.active {
        background: var(--white);
        transform: scale(1.2);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .hero-title {
            font-size: 2rem;
        }
        
        .hero-description {
            font-size: 1rem;
        }
        
        .hero-buttons {
            flex-direction: column;
            gap: 10px;
        }
    }
</style>