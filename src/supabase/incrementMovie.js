import { supabase } from "./supabaseClient"

export async function incrementMovie(sessionName, movieID) {
	//Get the current value of likes for the movie
	const movieQuery = await supabase
		.from("likes")
		.select(`likes`)
		.eq("movieId", movieID)
		.eq("sessionName", sessionName)

	const { data, error } = await supabase
		.from("likes")
		.update({ likes: movieQuery.data[0].likes + 1 })
		.eq("sessionName", sessionName)
		.eq("movieId", movieID)
		.select()

	return
}
