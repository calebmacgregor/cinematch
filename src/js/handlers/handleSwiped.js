import { getMovieMetadata } from "../getMovieInfo/getMovieMetadata"
import { handleMovieState } from "./handleMovieState"
import { rotateMovie } from "../rotateMovie"

export async function handleSwiped(sessionName, movieState, movieArray) {
	const storedSwiped = JSON.parse(localStorage.getItem(`cinematch-swiped-${sessionName}`))

	const movieId = Number.parseInt(movieState.currentMovie)

	storedSwiped.push(movieId)
	localStorage.setItem(`cinematch-swiped-${sessionName}`, JSON.stringify(storedSwiped))

	const nextMovieMetadata = await getMovieMetadata(movieState.nextMovie)
	handleMovieState(movieArray, movieState)

	const cachedMovieMetadata = await getMovieMetadata(movieState.nextMovie)

	setTimeout(() => {
		rotateMovie(nextMovieMetadata, cachedMovieMetadata)
	}, 400)

	return storedSwiped
}
