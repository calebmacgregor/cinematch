import { supabase } from "./supabaseClient"

export async function createSession(sessionName, likeThreshold, sessionSize) {
	const { data, error } = await supabase
		.from("sessions")
		.insert({ sessionName: sessionName, sessionSize: sessionSize, likeThreshold: likeThreshold })

	return { data, error }
}
