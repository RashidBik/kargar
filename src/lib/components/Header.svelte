<script>
    import { page } from '$app/stores';
    let isMenuOpen = false;
    
    const menuItems = [
        { name: 'خانه', path: '/' },
        { name: 'نمونه کارها', path: '/portfolio' },
        { name: 'درباره ما', path: '/about' },
        { name: 'تماس با ما', path: '/contact' }
    ];
</script>

<header class="header">
    <div class="container header-container">
        <div class="logo">
            <a href="/">
                <h1>مطبعه <span>کارگر</span></h1>
            </a>
        </div>
        
        <button class="mobile-menu-btn" on:click={() => isMenuOpen = !isMenuOpen}>
            <i class="fas {isMenuOpen ? 'fa-times' : 'fa-bars'}"></i>
        </button>
        
        <nav class="nav {isMenuOpen ? 'active' : ''}">
            <ul>
                {#each menuItems as item}
                    <li>
                        <a 
                            href={item.path} 
                            class:active={$page.url.pathname === item.path}
                        >
                            {item.name}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</header>

<style>
    .header {
        background-color: var(--white);
        box-shadow: var(--shadow);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }
    
    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80px;
    }
    
    .logo h1 {
        font-size: 1.8rem;
        color: var(--primary-color);
    }
    
    .logo span {
        color: var(--secondary-color);
    }
    
    .nav ul {
        display: flex;
        list-style: none;
        gap: 30px;
    }
    
    .nav a {
        text-decoration: none;
        color: var(--text-color);
        font-weight: 500;
        transition: color 0.3s;
        position: relative;
    }
    
    .nav a:hover,
    .nav a.active {
        color: var(--secondary-color);
    }
    
    .nav a::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: var(--secondary-color);
        transition: width 0.3s;
    }
    
    .nav a:hover::after,
    .nav a.active::after {
        width: 100%;
    }
    
    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--primary-color);
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }
        
        .nav {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background-color: var(--white);
            padding: 20px;
            transform: translateY(-150%);
            transition: transform 0.3s;
            box-shadow: var(--shadow);
        }
        
        .nav.active {
            transform: translateY(0);
        }
        
        .nav ul {
            flex-direction: column;
            gap: 15px;
        }
    }
</style>