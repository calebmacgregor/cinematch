import { supabase } from "./supabaseClient"

export async function deleteSession(sessionName) {
	const response = await supabase.from("sessions").delete().eq("sessionName", sessionName)

	window.location.href = `/`

	return response
}
