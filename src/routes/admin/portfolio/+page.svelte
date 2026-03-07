<!-- src/routes/admin/portfolio/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';
    
    // State
    let portfolioItems = [];
    let categories = [];
    let loading = true;
    let error = null;
    let showForm = false;
    let editingItem = null;
    let uploading = false;
    let uploadProgress = {};
    let deleteConfirm = null;
    
    // Form data
    let formData = {
        title: '',
        description: '',
        category_id: '',
        is_featured: false,
        display_order: 0
    };
    
    // Check authentication
    onMount(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            goto('/admin/login');
            return;
        }
        await Promise.all([loadCategories(), loadPortfolio()]);
    });
    
    // Load categories
    async function loadCategories() {
        const { data, error } = await supabase
            .from('portfolio_categories')
            .select('*')
            .order('display_order');
        
        if (error) {
            console.error('Error loading categories:', error);
        } else {
            categories = data || [];
        }
    }
    
    // Load portfolio items
    async function loadPortfolio() {
        try {
            loading = true;
            error = null;
            
            const { data, error: fetchError } = await supabase
                .from('portfolio_items')
                .select(`
                    *,
                    category:portfolio_categories(name),
                    images:portfolio_images(*)
                `)
                .order('display_order');
            
            if (fetchError) throw fetchError;
            
            portfolioItems = data || [];
        } catch (e) {
            error = e.message;
            console.error('Error loading portfolio:', e);
        } finally {
            loading = false;
        }
    }
    
    // Handle form submit
    async function handleSubmit() {
        try {
            if (editingItem) {
                // Update existing item
                const { error } = await supabase
                    .from('portfolio_items')
                    .update({
                        title: formData.title,
                        description: formData.description,
                        category_id: formData.category_id || null,
                        is_featured: formData.is_featured,
                        display_order: formData.display_order,
                        updated_at: new Date()
                    })
                    .eq('id', editingItem.id);
                
                if (error) throw error;
                
            } else {
                // Create new item
                const { data, error } = await supabase
                    .from('portfolio_items')
                    .insert([{
                        title: formData.title,
                        description: formData.description,
                        category_id: formData.category_id || null,
                        is_featured: formData.is_featured,
                        display_order: formData.display_order
                    }])
                    .select();
                
                if (error) throw error;
                editingItem = data[0];
            }
            
            await loadPortfolio();
            
            if (!editingItem) {
                // If not editing (new item created), close form
                showForm = false;
                resetForm();
            }
            
        } catch (e) {
            alert('خطا در ذخیره: ' + e.message);
        }
    }
    
    // Upload images
    async function uploadImages(files) {
        if (!editingItem?.id) {
            alert('لطفاً ابتدا اطلاعات اولیه را ذخیره کنید');
            return;
        }
        
        uploading = true;
        const uploadPromises = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `portfolio/${editingItem.id}/${fileName}`;
            
            uploadProgress[file.name] = 0;
            
            // Upload to storage
            const uploadPromise = supabase.storage
                .from('portfolio-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })
                .then(async (result) => {
                    if (result.error) throw result.error;
                    
                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('portfolio-images')
                        .getPublicUrl(filePath);
                    
                    // Save to database
                    const { error: dbError } = await supabase
                        .from('portfolio_images')
                        .insert([{
                            portfolio_item_id: editingItem.id,
                            image_url: publicUrl,
                            caption: file.name,
                            is_primary: i === 0 && !editingItem.images?.length, // First image is primary if no images exist
                            display_order: (editingItem.images?.length || 0) + i
                        }]);
                    
                    if (dbError) throw dbError;
                    
                    delete uploadProgress[file.name];
                })
                .catch(error => {
                    console.error('Upload error:', error);
                    uploadProgress[file.name] = 'error';
                });
            
            uploadPromises.push(uploadPromise);
        }
        
        await Promise.all(uploadPromises);
        uploading = false;
        await loadPortfolio();
    }
    
    // Set primary image
    async function setPrimaryImage(imageId) {
        if (!editingItem) return;
        
        try {
            // Reset all images to not primary
            await supabase
                .from('portfolio_images')
                .update({ is_primary: false })
                .eq('portfolio_item_id', editingItem.id);
            
            // Set selected as primary
            await supabase
                .from('portfolio_images')
                .update({ is_primary: true })
                .eq('id', imageId);
            
            await loadPortfolio();
        } catch (e) {
            alert('خطا در تنظیم تصویر اصلی');
        }
    }
    
    // Delete image
    async function deleteImage(imageId, imageUrl) {
        if (!confirm('آیا از حذف این تصویر اطمینان دارید؟')) return;
        
        try {
            // Extract path from URL
            const path = imageUrl.split('/').slice(-3).join('/');
            
            // Delete from storage
            await supabase.storage
                .from('portfolio-images')
                .remove([path]);
            
            // Delete from database
            await supabase
                .from('portfolio_images')
                .delete()
                .eq('id', imageId);
            
            await loadPortfolio();
        } catch (e) {
            alert('خطا در حذف تصویر');
        }
    }
    
    // Delete portfolio item
    async function deleteItem(id) {
        if (!confirm('آیا از حذف این آیتم اطمینان دارید؟ تمام تصاویر آن نیز حذف خواهند شد.')) return;
        
        try {
            // Get images to delete from storage
            const { data: images } = await supabase
                .from('portfolio_images')
                .select('image_url')
                .eq('portfolio_item_id', id);
            
            // Delete from storage
            if (images?.length) {
                const paths = images.map(img => {
                    const parts = img.image_url.split('/');
                    return parts.slice(-3).join('/');
                });
                
                await supabase.storage
                    .from('portfolio-images')
                    .remove(paths);
            }
            
            // Delete from database (cascade will delete images)
            await supabase
                .from('portfolio_items')
                .delete()
                .eq('id', id);
            
            await loadPortfolio();
            
        } catch (e) {
            alert('خطا در حذف آیتم');
        }
    }
    
    // Reset form
    function resetForm() {
        formData = {
            title: '',
            description: '',
            category_id: '',
            is_featured: false,
            display_order: 0
        };
        editingItem = null;
    }
    
    // Edit item
    function editItem(item) {
        editingItem = item;
        formData = {
            title: item.title,
            description: item.description || '',
            category_id: item.category_id || '',
            is_featured: item.is_featured,
            display_order: item.display_order
        };
        showForm = true;
    }
</script>

<div class="admin-container">
    <!-- Header -->
    <div class="header">
        <h1>مدیریت نمونه کارها</h1>
        <button class="btn-primary" on:click={() => {
            resetForm();
            showForm = true;
        }}>
            <i class="fas fa-plus"></i>
            افزودن نمونه کار جدید
        </button>
    </div>
    
    <!-- Error Message -->
    {#if error}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {error}
        </div>
    {/if}
    <!-- Form Modal -->
   {#if showForm}
    <!-- Overlay - closes modal when clicked -->
    <div 
        class="modal-overlay" 
        on:click={() => showForm = false}
        role="presentation"  
        aria-hidden="true"    
    >
        <!-- Modal Content - stopPropagation prevents closing when clicking inside -->
        <div 
            class="modal-content" 
            on:click|stopPropagation             
            aria-modal="true"           
            aria-labelledby="modal-title"
            tabindex="-1"                
            role="dialog" 
        aria-hidden="true"
        >
            <div class="modal-header">
                <h2 id="modal-title">{editingItem ? 'ویرایش نمونه کار' : 'نمونه کار جدید'}</h2>
                <!-- Close button - already has proper semantics -->
                <button class="close-btn" on:click={() => showForm = false} aria-label="بستن">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
            
            <!-- Rest of your form remains exactly the same -->
            <form on:submit|preventDefault={handleSubmit}>
                <!-- ... your form fields ... -->
            </form>
            
            <!-- ... rest of your code ... -->
        </div>
    </div>
{/if}
    
    <!-- Portfolio Items List -->
    {#if loading}
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>در حال بارگذاری...</p>
        </div>
    {:else}
        <div class="items-grid">
            {#each portfolioItems as item}
                <div class="item-card">
                    <div class="item-image">
                        {#if item.images?.length}
                            <img 
                                src={item.images.find(i => i.is_primary)?.image_url || item.images[0].image_url} 
                                alt={item.title}
                            >
                            <span class="image-count">
                                <i class="fas fa-images"></i>
                                {item.images.length}
                            </span>
                        {:else}
                            <div class="no-image">
                                <i class="fas fa-image"></i>
                            </div>
                        {/if}
                        {#if item.is_featured}
                            <span class="featured-badge">
                                <i class="fas fa-star"></i>
                            </span>
                        {/if}
                    </div>
                    
                    <div class="item-info">
                        <h3>{item.title}</h3>
                        {#if item.category}
                            <span class="item-category">{item.category.name}</span>
                        {/if}
                        <p class="item-description">
                            {item.description ? item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '') : 'بدون توضیحات'}
                        </p>
                        <div class="item-meta">
                            <span>ترتیب: {item.display_order}</span>
                            <span>تاریخ: {new Date(item.created_at).toLocaleDateString('fa-IR')}</span>
                        </div>
                    </div>
                    
                    <div class="item-actions">
                        <button class="action-btn edit" on:click={() => editItem(item)} title="ویرایش">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" on:click={() => deleteItem(item.id)} title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            {/each}
            
            {#if portfolioItems.length === 0}
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <p>هیچ نمونه کاری وجود ندارد</p>
                    <button class="btn-primary" on:click={() => {
                        resetForm();
                        showForm = true;
                    }}>
                        افزودن اولین نمونه کار
                    </button>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .admin-container {
        max-width: 1200px;
        margin: 50px auto;
        padding: 20px;
        direction: rtl;
        font-family: 'Vazirmatn', sans-serif;
    }
    
    /* Header */
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header h1 {
        color: var(--primary-color, #2c3e50);
        font-size: 1.8rem;
        margin: 0;
    }
    
    /* Buttons */
    .btn-primary {
        background: linear-gradient(135deg, var(--primary-color, #2c3e50), #34495e);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: 'Vazirmatn', sans-serif;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    .btn-primary:hover {
        background: linear-gradient(135deg, #34495e, var(--primary-color, #2c3e50));
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .btn-secondary {
        background: #95a5a6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-family: 'Vazirmatn', sans-serif;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .btn-secondary:hover {
        background: #7f8c8d;
    }
    
    /* Modal */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
    }
    
    .modal-content {
        background: white;
        border-radius: 16px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #ecf0f1;
        position: sticky;
        top: 0;
        background: white;
        border-radius: 16px 16px 0 0;
    }
    
    .modal-header h2 {
        margin: 0;
        color: var(--primary-color, #2c3e50);
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #95a5a6;
        transition: color 0.3s;
    }
    
    .close-btn:hover {
        color: #e74c3c;
    }
    
    /* Forms */
    form {
        padding: 20px;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }
    
    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--primary-color, #2c3e50);
    }
    
    .required {
        color: #e74c3c;
    }
    
    input, textarea, select {
        width: 100%;
        padding: 12px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-family: 'Vazirmatn', sans-serif;
        font-size: 1rem;
        transition: all 0.3s;
    }
    
    input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: var(--secondary-color, #e67e22);
        box-shadow: 0 0 0 3px rgba(230,126,34,0.1);
    }
    
    .checkbox label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }
    
    .checkbox input {
        width: auto;
    }
    
    .form-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 30px;
    }
    
    /* Images Section */
    .images-section {
        padding: 20px;
        border-top: 1px solid #ecf0f1;
    }
    
    .images-section h3 {
        color: var(--primary-color, #2c3e50);
        margin: 0 0 20px 0;
    }
    
    .upload-area {
        border: 3px dashed #e0e0e0;
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        margin-bottom: 20px;
    }
    
    .upload-area:hover {
        border-color: var(--secondary-color, #e67e22);
        background: rgba(230,126,34,0.05);
    }
    
    .upload-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }
    
    .upload-label i {
        font-size: 3rem;
        color: var(--secondary-color, #e67e22);
    }
    
    .upload-hint {
        font-size: 0.85rem;
        color: #95a5a6;
    }
    
    .image-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
        margin-top: 20px;
    }
    
    .image-item {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        aspect-ratio: 1;
        border: 3px solid transparent;
    }
    
    .image-item.primary {
        border-color: var(--secondary-color, #e67e22);
    }
    
    .image-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .image-item:hover .image-overlay {
        opacity: 1;
    }
    
    .image-actions {
        display: flex;
        gap: 8px;
    }
    
    .action-btn {
        width: 35px;
        height: 35px;
        border: none;
        border-radius: 50%;
        background: white;
        color: var(--primary-color, #2c3e50);
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .action-btn.primary:hover {
        background: var(--secondary-color, #e67e22);
        color: white;
    }
    
    .action-btn.delete:hover {
        background: #e74c3c;
        color: white;
    }
    
    .primary-badge {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background: var(--secondary-color, #e67e22);
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
    }
    
    .no-images {
        text-align: center;
        color: #95a5a6;
        padding: 20px;
    }
    
    /* Items Grid */
    .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 25px;
    }
    
    .item-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: all 0.3s;
        position: relative;
    }
    
    .item-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    
    .item-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    
    .item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .no-image {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #f5f7fa, #e4e8eb);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #95a5a6;
        font-size: 3rem;
    }
    
    .image-count {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: rgba(0,0,0,0.6);
        color: white;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .featured-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--secondary-color, #e67e22);
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
    }
    
    .item-info {
        padding: 20px;
    }
    
    .item-info h3 {
        margin: 0 0 5px 0;
        color: var(--primary-color, #2c3e50);
        font-size: 1.2rem;
    }
    
    .item-category {
        display: inline-block;
        background: var(--secondary-color, #e67e22);
        color: white;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
        margin-bottom: 10px;
    }
    
    .item-description {
        color: #666;
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 10px 0;
    }
    
    .item-meta {
        display: flex;
        gap: 15px;
        font-size: 0.8rem;
        color: #95a5a6;
        margin-top: 10px;
    }
    
    .item-actions {
        display: flex;
        gap: 10px;
        padding: 15px 20px;
        border-top: 1px solid #ecf0f1;
    }
    
    .item-actions .action-btn {
        flex: 1;
        border-radius: 6px;
        width: auto;
        height: 35px;
    }
    
    /* Empty State */
    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        background: white;
        border-radius: 12px;
    }
    
    .empty-state i {
        font-size: 4rem;
        color: #95a5a6;
        margin-bottom: 20px;
    }
    
    .empty-state p {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 20px;
    }
    
    /* Loading State */
    .loading-state {
        text-align: center;
        padding: 60px;
    }
    
    .loading-state i {
        font-size: 3rem;
        color: var(--primary-color, #2c3e50);
        margin-bottom: 20px;
    }
    
    /* Error Message */
    .error-message {
        background: #fee;
        color: #e74c3c;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .modal-content {
            margin: 10px;
        }
    }
</style>