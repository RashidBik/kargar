<script>
	import { supabase } from '$lib/supabaseClient'
	import { goto } from '$app/navigation'

	async function logout() {
		await supabase.auth.signOut()
		goto('/admin/login')
	}
</script>

<h1>Admin Dashboard</h1>

<button on:click={logout}>Logout</button>