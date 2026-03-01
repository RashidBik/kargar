<script>
	import { supabase } from '$lib/supabaseClient'

	let category = ''
	let title = ''
	let description = ''
	let file

	async function uploadProduct() {
		if (!file) return alert("عکس انتخاب نشده")

		// 1️⃣ اپلود عکس
		const fileName = Date.now() + '-' + file.name

		const { error: uploadError } = await supabase.storage
			.from('products')
			.upload(fileName, file)

		if (uploadError) {
			alert(uploadError.message)
			return
		}

		// 2️⃣ گرفتن URL عکس
		const { data } = supabase.storage
			.from('products')
			.getPublicUrl(fileName)

		const imageUrl = data.publicUrl

		// 3️⃣ ذخیره در دیتابیس
		const { error } = await supabase
			.from('products')
			.insert([
				{ category, title, description, image: imageUrl }
			])

		if (error) {
			alert(error.message)
		} else {
			alert("محصول موفقانه اضافه شد")
		}
	}
</script>

<h2>افزودن محصول</h2>

<input placeholder="دسته بندی" bind:value={category} />
<input placeholder="عنوان" bind:value={title} />
<textarea placeholder="توضیحات" bind:value={description}></textarea>
<input type="file" on:change={(e) => file = e.target.files[0]} />

<button on:click={uploadProduct}>
	ذخیره محصول
</button>