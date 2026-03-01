<script>
    let formData = {
        name: '',
        email: '',
        phone: '',
        message: ''
    };
    
    let isSubmitting = false;
    let submitMessage = '';
    
    async function handleSubmit() {
        isSubmitting = true;
        submitMessage = '';
        
        // شبیه‌سازی ارسال فرم
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // اینجا می‌توانید کد ارسال واقعی را اضافه کنید
        submitMessage = 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس می‌گیریم.';
        formData = { name: '', email: '', phone: '', message: '' };
        isSubmitting = false;
    }
</script>

<section class="contact" id="contact">
    <div class="container">
        <h2 class="section-title">تماس با ما</h2>
        
        <div class="contact-wrapper">
            <div class="contact-info">
                <h3>اطلاعات تماس</h3>
                
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <h4>آدرس</h4>
                        <p>تهران، خیابان انقلاب، خیابان قدس، پلاک ۱۲۳</p>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <div>
                        <h4>تلفن</h4>
                        <p>۰۲۱-۱۲۳۴۵۶۷۸</p>
                        <p>۰۲۱-۸۷۶۵۴۳۲۱</p>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <h4>ایمیل</h4>
                        <p>info@kargarprint.ir</p>
                        <p>sales@kargarprint.ir</p>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <h4>ساعات کاری</h4>
                        <p>شنبه تا چهارشنبه: ۹ صبح تا ۶ عصر</p>
                        <p>پنجشنبه: ۹ صبح تا ۲ بعدازظهر</p>
                    </div>
                </div>
                
                <div class="social-links">
                    <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-telegram"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-whatsapp"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-linkedin"></i></a>
                </div>
            </div>
            
            <div class="contact-form">
                <h3>ارسال پیام</h3>
                
                <form on:submit|preventDefault={handleSubmit}>
                    <div class="form-group">
                        <input 
                            type="text" 
                            placeholder="نام و نام خانوادگی"
                            bind:value={formData.name}
                            required
                        >
                    </div>
                    
                    <div class="form-group">
                        <input 
                            type="email" 
                            placeholder="ایمیل"
                            bind:value={formData.email}
                            required
                        >
                    </div>
                    
                    <div class="form-group">
                        <input 
                            type="tel" 
                            placeholder="شماره تماس"
                            bind:value={formData.phone}
                            required
                        >
                    </div>
                    
                    <div class="form-group">
                        <textarea 
                            placeholder="متن پیام"
                            rows="5"
                            bind:value={formData.message}
                            required
                        ></textarea>
                    </div>
                    
                    {#if submitMessage}
                        <div class="submit-message success">
                            {submitMessage}
                        </div>
                    {/if}
                    
                    <button type="submit" class="btn" disabled={isSubmitting}>
                        {#if isSubmitting}
                            <i class="fas fa-spinner fa-spin"></i> در حال ارسال...
                        {:else}
                            ارسال پیام
                        {/if}
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>

<style>
    .contact {
        background-color: var(--light-bg);
    }
    
    .contact-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
    }
    
    .contact-info h3,
    .contact-form h3 {
        margin-bottom: 30px;
        font-size: 1.5rem;
        color: var(--primary-color);
    }
    
    .info-item {
        display: flex;
        gap: 20px;
        margin-bottom: 25px;
    }
    
    .info-item i {
        font-size: 1.5rem;
        color: var(--secondary-color);
        width: 40px;
        text-align: center;
    }
    
    .info-item h4 {
        margin-bottom: 5px;
        color: var(--primary-color);
    }
    
    .info-item p {
        color: #666;
        line-height: 1.8;
    }
    
    .social-links {
        display: flex;
        gap: 15px;
        margin-top: 30px;
    }
    
    .social-links a {
        width: 45px;
        height: 45px;
        background: var(--primary-color);
        color: var(--white);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.3s;
        text-decoration: none;
    }
    
    .social-links a:hover {
        background: var(--secondary-color);
        transform: translateY(-3px);
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-family: 'Vazirmatn', sans-serif;
        font-size: 1rem;
        transition: border-color 0.3s;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--secondary-color);
    }
    
    .submit-message {
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
        text-align: center;
    }
    
    .submit-message.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    @media (max-width: 768px) {
        .contact-wrapper {
            grid-template-columns: 1fr;
            gap: 30px;
        }
    }
</style>