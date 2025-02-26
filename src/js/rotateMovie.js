import { handleEndSession } from "./handlers/handleEndSession.js"
import { setMovie } from "./setMovie.js"

export async function rotateMovie(movie, nextMovie) {
	if (movie && movie.id !== 0) {
		setMovie(movie, "primary")
	} else {
		handleEndSession()
	}

	if (nextMovie) {
		setMovie(nextMovie, "secondary")
	}
}
