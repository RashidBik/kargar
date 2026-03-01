<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>درباره مطبعه کارگر</h3>
                <p>
                    با بیش از ۲۰ سال سابقه درخشان در صنعت چاپ و ساخت لوحه‌های برجسته، 
                    همراه همیشگی شما در خلق آثار ماندگار هستیم.
                </p>
            </div>
            
            <div class="footer-section">
                <h3>لینک‌های سریع</h3>
                <ul>
                    <li><a href="/">خانه</a></li>
                    <li><a href="/portfolio">نمونه کارها</a></li>
                    <li><a href="/about">درباره ما</a></li>
                    <li><a href="/contact">تماس با ما</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>خبرنامه</h3>
                <p>برای دریافت آخرین اخبار و تخفیف‌ها، ایمیل خود را وارد کنید.</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="ایمیل شما">
                    <button type="submit"><i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; {new Date().getFullYear()} مطبعه کارگر. تمامی حقوق محفوظ است.</p>
        </div>
    </div>
</footer>

<style>
    .footer {
        background-color: var(--primary-color);
        color: var(--white);
        padding: 60px 0 20px;
    }
    
    .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 40px;
        margin-bottom: 40px;
    }
    
    .footer-section h3 {
        color: var(--white);
        margin-bottom: 20px;
        font-size: 1.2rem;
        position: relative;
        padding-bottom: 10px;
    }
    
    .footer-section h3::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 50px;
        height: 2px;
        background-color: var(--secondary-color);
    }
    
    .footer-section p {
        line-height: 1.8;
        opacity: 0.8;
    }
    
    .footer-section ul {
        list-style: none;
    }
    
    .footer-section ul li {
        margin-bottom: 10px;
    }
    
    .footer-section ul li a {
        color: var(--white);
        text-decoration: none;
        opacity: 0.8;
        transition: opacity 0.3s, padding-right 0.3s;
    }
    
    .footer-section ul li a:hover {
        opacity: 1;
        padding-right: 5px;
    }
    
    .newsletter-form {
        display: flex;
        margin-top: 20px;
    }
    
    .newsletter-form input {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 5px 0 0 5px;
        font-family: 'Vazirmatn', sans-serif;
    }
    
    .newsletter-form button {
        padding: 10px 15px;
        background-color: var(--secondary-color);
        color: var(--white);
        border: none;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .newsletter-form button:hover {
        background-color: #d35400;
    }
    
    .footer-bottom {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .footer-bottom p {
        opacity: 0.6;
        font-size: 0.9rem;
    }
</style>