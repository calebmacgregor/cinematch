import { supabase } from "./supabaseClient"
import { getSwiped } from "../js/handlers/getSwiped"

export async function joinSession(sessionName) {
	const swiped = getSwiped(sessionName)

	const { data, error } = await supabase
		.from("sessions")
		.select(`sessionName, likeThreshold, likes ( movieId )`)
		.eq("sessionName", sessionName)
		.not("likes.movieId", "in", `(${swiped})`)

	const sessionData = {
		sessionName: data[0]?.sessionName,
		likeThreshold: data[0]?.likeThreshold,
		movieArray: data[0]?.likes.map((x) => x.movieId)
	}

	return sessionData
}
