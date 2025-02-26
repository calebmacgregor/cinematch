import { supabase } from "./supabaseClient"
import { populateLikedMovies } from "../js/utils/populateLikedMovies"
import { getLikedMovies } from "./getLikedMovies"
import { handleMatch } from "../js/handlers/handleMatch"

export async function subscribe(sessionName, likeThreshold, elementState) {
	supabase
		.channel(sessionName)
		.on(
			"postgres_changes",
			{
				event: "UPDATE",
				schema: "public",
				table: "likes",
				filter: `sessionName=eq.${sessionName}`
			},
			async (payload) => {
				if (payload.new.likes >= likeThreshold) {
					const likedMovies = await getLikedMovies(sessionName, likeThreshold)

					handleMatch(payload.new.movieId, elementState)
					populateLikedMovies(likedMovies)
				}
			}
		)
		.subscribe()
}
