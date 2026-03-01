import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient'

export async function load() {
	const { data } = await supabase.auth.getSession()

	if (!data.session) {
		throw redirect(303, '/admin/login')
	}
}