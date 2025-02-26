import { elementState } from "../elementState"

export function handleMovieState(movieArray, movieState) {
	movieState.currentMovie = movieState.nextMovie
	movieState.nextMovie = movieArray.pop()

	if (!movieState.nextMovie) {
		setTimeout(() => {
			elementState.nextPoster.style.visibility = "hidden"
		}, 400)
	}
}
