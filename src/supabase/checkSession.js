import { supabase } from "./supabaseClient"

export async function checkSession(sessionName) {
	const { data, error } = await supabase
		.from("sessions")
		.select(`sessionName`)
		.eq("sessionName", sessionName)

	if (error || data.length == 0) return false

	return true
}
