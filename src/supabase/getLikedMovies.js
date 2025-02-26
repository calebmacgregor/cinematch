import { supabase } from "./supabaseClient"

export async function getLikedMovies(sessionName, likeThreshold) {
	const { data, error } = await supabase
		.from("likes")
		.select(`movieId`)
		.eq("sessionName", sessionName)
		.gte("likes", likeThreshold)

	if (data && data.length > 0) {
		return data.map((x) => x.movieId)
	} else {
		return false
	}
}
