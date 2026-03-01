<script>
    import Contact from '$lib/components/Contact.svelte';
</script>

<section class="contact-page-hero">
    <div class="container">
        <h1>تماس با ما</h1>
        <p>همراه شما هستیم</p>
    </div>
</section>

<Contact />

<!-- نقشه گوگل -->
<section class="map">
    <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.844987654321!2d51.123456789012!3d35.123456789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDA3JzI0LjQiTiA1McKwMDcnMjQuNCJF!5e0!3m2!1sen!2s!4v1234567890123" 
        width="100%" 
        height="450" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy">
    </iframe>
</section>

<style>
    .contact-page-hero {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: var(--white);
        text-align: center;
        padding: 120px 0 80px;
        margin-top: 80px;
    }
    
    .contact-page-hero h1 {
        color: var(--white);
        font-size: 3rem;
        margin-bottom: 20px;
    }
    
    .contact-page-hero p {
        font-size: 1.2rem;
        opacity: 0.9;
    }
    
    .map {
        margin-top: -50px;
    }
    
    @media (max-width: 768px) {
        .contact-page-hero h1 {
            font-size: 2rem;
        }
    }
</style>