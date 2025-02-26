import { getMovieDetail } from "../getMovieInfo/getMovieDetail"

export async function handleMatch(movieId, elementState) {
	const movie = await getMovieDetail(movieId)

	elementState.notificationTitle.innerText = movie.title
	elementState.notificationMovie.src = movie.poster
	elementState.notificationContainer.classList.add("visible")

	setTimeout(() => {
		elementState.notificationContainer.classList.remove("visible")
	}, 5000)
}
