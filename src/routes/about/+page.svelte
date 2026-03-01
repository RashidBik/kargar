<script>
    import { onMount } from 'svelte';
    
    let stats = [
        { number: 20, label: 'سال تجربه', suffix: '+' },
        { number: 5000, label: 'پروژه موفق', suffix: '+' },
        { number: 1000, label: 'مشتری راضی', suffix: '+' },
        { number: 50, label: 'جایزه صنعتی', suffix: '' }
    ];
    
    onMount(() => {
        // انیمیشن شمارنده
        stats = stats.map(stat => {
            let current = 0;
            const increment = stat.number / 50;
            const interval = setInterval(() => {
                current += increment;
                if (current >= stat.number) {
                    current = stat.number;
                    clearInterval(interval);
                }
                return { ...stat, current: Math.floor(current) };
            }, 30);
            return stat;
        });
    });
</script>

<section class="about-hero">
    <div class="container">
        <h1>درباره مطبعه کارگر</h1>
        <p>نیم قرن تجربه در صنعت چاپ ایران</p>
    </div>
</section>

<section class="about-story">
    <div class="container">
        <div class="story-content">
            <h2 class="section-title">داستان ما</h2>
            <div class="story-grid">
                <div class="story-text">
                    <p>
                        مطبعه کارگر در سال ۱۳۷۵ با هدف ارائه خدمات چاپ با کیفیت و ساخت لوحه‌های برجسته در تهران تاسیس شد. 
                        ما از همان ابتدا با بهره‌گیری از جدیدترین تکنولوژی‌های روز دنیا و استخدام نیروهای متخصص، 
                        توانستیم جایگاه ویژه‌ای در صنعت چاپ ایران به دست آوریم.
                    </p>
                    <p>
                        امروز پس از بیش از دو دهه فعالیت مستمر، مفتخریم که با صدها سازمان، شرکت و نهاد دولتی و خصوصی همکاری داشته‌ایم 
                        و توانسته‌ایم رضایت ایشان را جلب کنیم. ما در مطبعه کارگر، کیفیت را فدای کمیت نمی‌کنیم و 
                        همواره به دنبال خلق آثاری هستیم که ماندگار شوند.
                    </p>
                </div>
                <div class="story-image">
                    <img src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="تاریخچه مطبعه کارگر">
                </div>
            </div>
        </div>
    </div>
</section>

<section class="stats">
    <div class="container">
        <div class="stats-grid">
            {#each stats as stat}
                <div class="stat-item">
                    <h3>{stat.current || 0}{stat.suffix}</h3>
                    <p>{stat.label}</p>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .about-hero {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: var(--white);
        text-align: center;
        padding: 120px 0 80px;
        margin-top: 80px;
    }
    
    .about-hero h1 {
        color: var(--white);
        font-size: 3rem;
        margin-bottom: 20px;
    }
    
    .about-hero p {
        font-size: 1.2rem;
        opacity: 0.9;
    }
    
    .story-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
        align-items: center;
    }
    
    .story-text p {
        margin-bottom: 20px;
        line-height: 1.8;
        color: #666;
    }
    
    .story-image img {
        width: 100%;
        border-radius: 10px;
        box-shadow: var(--shadow);
    }
    
    .stats {
        background-color: var(--light-bg);
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
        text-align: center;
    }
    
    .stat-item h3 {
        font-size: 2.5rem;
        color: var(--secondary-color);
        margin-bottom: 10px;
    }
    
    .stat-item p {
        font-size: 1.1rem;
        color: #666;
    }
    
    @media (max-width: 768px) {
        .story-grid {
            grid-template-columns: 1fr;
        }
        
        .about-hero h1 {
            font-size: 2rem;
        }
    }
</style>