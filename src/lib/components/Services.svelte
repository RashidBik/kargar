<script>
    const services = [
        {
            icon: 'fa-solid fa-medal',
            title: 'لوحه برجسته',
            description: 'ساخت انواع لوحه‌های برجسته، تندیس‌ها و پلاک‌های افتخار با بهترین کیفیت'
        },
        {
            icon: 'fa-solid fa-print',
            title: 'چاپ دیجیتال',
            description: 'چاپ دیجیتال با بالاترین کیفیت و سرعت برای انواع محصولات'
        },
        {
            icon: 'fa-solid fa-newspaper',
            title: 'چاپ افست',
            description: 'چاپ افست رنگی و سیاه سفید برای تیراژهای بالا'
        },
        {
            icon: 'fa-solid fa-paint-roller',
            title: 'چاپ سیلک',
            description: 'چاپ سیلک روی انواع سطوح با دوام و کیفیت عالی'
        },
        {
            icon: 'fa-solid fa-crop',
            title: 'طراحی گرافیک',
            description: 'خدمات طراحی گرافیک تخصصی برای انواع محصولات چاپی'
        },
        {
            icon: 'fa-solid fa-box',
            title: 'بسته‌بندی',
            description: 'طراحی و چاپ انواع جعبه‌ها و بسته‌بندی‌های تبلیغاتی'
        }
    ];
</script>

<section class="services">
    <div class="container">
        <h2 class="section-title">خدمات ما</h2>
        <div class="services-grid">
            {#each services as service}
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas {service.icon}"></i>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .services {
        background-color: var(--light-bg);
    }
    
    .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
    }
    
    .service-card {
        background: var(--white);
        padding: 40px 30px;
        border-radius: 10px;
        text-align: center;
        box-shadow: var(--shadow);
        transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .service-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    
    .service-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
    }
    
    .service-icon i {
        font-size: 2.5rem;
        color: var(--white);
    }
    
    .service-card h3 {
        margin-bottom: 15px;
        font-size: 1.3rem;
    }
    
    .service-card p {
        color: #666;
        line-height: 1.8;
    }
</style>