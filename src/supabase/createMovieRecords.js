import { supabase } from "./supabaseClient"

export async function createMovieRecords(sessionName, movieArray) {
	const bulkInsert = movieArray.map((id) => {
		return { sessionName: sessionName, movieId: id }
	})

	const { data, error } = await supabase.from("likes").insert(bulkInsert)

	return { data, error }
}
