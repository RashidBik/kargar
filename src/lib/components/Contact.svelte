
<script>
 import { securityMonitor } from '$lib/securityMonitor';

    let formData = {
        name: '',
        email: '',
        phone: '',
        message: ''
    };
    
    let isSubmitting = false;
    let submitMessage = '';
    let messageType = '';
    let errors = {}; // Track validation errors
    
    // Replace with your Formspree endpoint
    const CONTACT_ENDPOINT = 'https://formspree.io/f/maqpnyga';
    
    // 🟢 VALIDATION FUNCTION - This is the important part!
    function validateForm() {
        errors = {};
        let isValid = true;
        
        // Sanitize inputs (remove dangerous characters)
        const sanitize = (str) => {
            if (!str) return '';
            return str.replace(/[<>]/g, '')  // Remove < and > tags
                      .replace(/&/g, '&amp;') // Encode &
                      .trim();
        };
        
        // Apply sanitization
        formData.name = sanitize(formData.name);
        formData.message = sanitize(formData.message);
        
        // 1. Name validation
        if (!formData.name) {
            errors.name = 'نام و نام خانوادگی الزامی است';
            isValid = false;
        } else if (formData.name.length < 3) {
            errors.name = 'نام باید حداقل ۳ کاراکتر باشد';
            isValid = false;
        } else if (formData.name.length > 50) {
            errors.name = 'نام نباید بیشتر از ۵۰ کاراکتر باشد';
            isValid = false;
        }
        
        // 2. Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            errors.email = 'ایمیل الزامی است';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'ایمیل معتبر وارد کنید (مثال: name@domain.com)';
            isValid = false;
        }
        
        // 3. Phone validation (Afghanistan format)
        // Afghan numbers: +93 70 123 4567 or 0701234567
         const cleanPhone = formData.phone.replace(/[-\s+]/g, ''); // Remove dashes, spaces, plus signs
        
        if (!formData.phone) {
            errors.phone = 'شماره تماس الزامی است';
            isValid = false;
        } else if (cleanPhone.length < 10 || cleanPhone.length > 13) {
            errors.phone = 'شماره تماس باید بین ۱۰ تا ۱۳ رقم باشد';
            isValid = false;
        } else if (!/^\d+$/.test(cleanPhone)) { // Check if only digits remain
            errors.phone = 'شماره تماس باید فقط شامل اعداد باشد';
            isValid = false;
        }
        
        // 4. Message validation
        if (!formData.message) {
            errors.message = 'متن پیام الزامی است';
            isValid = false;
        } else if (formData.message.length < 10) {
            errors.message = 'پیام باید حداقل ۱۰ کاراکتر باشد';
            isValid = false;
        } else if (formData.message.length > 1000) {
            errors.message = 'پیام نباید بیشتر از ۱۰۰۰ کاراکتر باشد';
            isValid = false;
        }
        
        return isValid;
    }
    
    async function handleSubmit(event) {
        event.preventDefault();
        
        // 🟢 RUN VALIDATION BEFORE SUBMITTING
        if (!validateForm()) {
            // Show first error at the top
            submitMessage = 'لطفاً خطاهای فرم را اصلاح کنید';
            messageType = 'error';
            return;
        }
        
        isSubmitting = true;
        submitMessage = '';
        messageType = '';
        
        try {
            const response = await fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    _subject: `پیام جدید از ${formData.name}`,
                    _replyto: formData.email
                })
            });

            await securityMonitor.logFormSubmission('contact', formData.email);
            
            if (response.ok) {
                submitMessage = '✅ پیام شما با موفقیت ارسال شد';
                messageType = 'success';
                // Clear form
                formData = { name: '', email: '', phone: '', message: '' };
                errors = {};
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            submitMessage = '❌ خطا در ارسال. لطفاً دوباره تلاش کنید';
            messageType = 'error';
             // Log the error
            await securityMonitor.log('form_error', {
                email: formData.email,
                error: error.message
            });
        } finally {
            isSubmitting = false;
        }
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
                        <p>مزارشریف افغانستان, چهار راهی الکوزی مارکیت شیرخان</p>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <div>
                        <h4>تلفن</h4>
                        <p> 9379-342-5501+</p>
                        <p>9379-420-0124+</p>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <h4>ایمیل</h4>
                        <p>khalidhashimi39@gmail.com</p>
                        <p>kargarsign@gmail.com</p>
                    </div>
                </div>
                
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <h4>ساعات کاری</h4>
                        <p>شنبه تا پنج شنبه: ۹ صبح تا ۸ شب</p>
                      
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
                
                <form on:submit={handleSubmit}>
                    <div class="form-group">
                        <input 
                            type="text" 
                            placeholder="نام و نام خانوادگی"
                            bind:value={formData.name}
                            disabled={isSubmitting}
                            class={errors.name ? 'error' : ''}
                        >
                        {#if errors.name}
                            <span class="error-text">{errors.name}</span>
                        {/if}
                    </div>
                    
                    <div class="form-group">
                        <input 
                            type="email" 
                            placeholder="ایمیل"
                            bind:value={formData.email}
                            disabled={isSubmitting}
                            class={errors.email ? 'error' : ''}
                        >
                        {#if errors.email}
                            <span class="error-text">{errors.email}</span>
                        {/if}
                    </div>
                    
                    <div class="form-group">
                        <input 
                            type="tel" 
                            placeholder="شماره تماس (مثال: +93 70 123 4567)"
                            bind:value={formData.phone}
                            disabled={isSubmitting}
                            class={errors.phone ? 'error' : ''}
                        >
                        {#if errors.phone}
                            <span class="error-text">{errors.phone}</span>
                        {/if}
                    </div>
                    
                    <div class="form-group">
                        <textarea 
                            placeholder="متن پیام"
                            rows="5"
                            bind:value={formData.message}
                            disabled={isSubmitting}
                            class={errors.message ? 'error' : ''}
                            maxlength="1000"
                        ></textarea>
                        {#if errors.message}
                            <span class="error-text">{errors.message}</span>
                        {/if}
                        <small>{formData.message.length}/1000</small>
                    </div>
                    
                    {#if submitMessage}
                        <div class="submit-message {messageType}">
                            {submitMessage}
                        </div>
                    {/if}
                    
                    <button type="submit" class="btn" disabled={isSubmitting}>
                        {#if isSubmitting}
                            <i class="fas fa-spinner fa-spin"></i> در حال ارسال...
                        {:else}
                            <i class="fas fa-paper-plane"></i> ارسال پیام
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
      .error-text {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 5px;
        display: block;
    }
    
    input.error, textarea.error {
        border-color: #e74c3c !important;
        background-color: #fff8f8;
    }
  
    
    .submit-message.error {
        background: #f8d7da;
        color: #721c24;
    }
    
    small {
        display: block;
        text-align: left;
        color: #666;
        margin-top: 5px;
    }
    @media (max-width: 768px) {
        .contact-wrapper {
            grid-template-columns: 1fr;
            gap: 30px;
        }
    }
</style>

