<script>
	import { supabase } from '$lib/supabaseClient'
	import { goto } from '$app/navigation'

	let email = ''
	let password = ''
	let error = ''

	async function login() {
		const { data, error: err } = await supabase.auth.signInWithPassword({
			email,
			password
		})

		if (err) {
			error = err.message
		} else {
			goto('/admin')
		}
	}
</script>

<h2>Admin Login</h2>

<input placeholder="Email" bind:value={email} />
<input type="password" placeholder="Password" bind:value={password} />

<button on:click={login}>Login</button>

<p style="color:red">{error}</p>