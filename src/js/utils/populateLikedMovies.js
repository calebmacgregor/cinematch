import { getMovieDetail } from "../getMovieInfo/getMovieDetail"

export async function populateLikedMovies(likedMovies) {
	if (!likedMovies || likedMovies.length === 0) return

	const emptyMessage = document.querySelector(".empty-message")
	if (emptyMessage) {
		emptyMessage.remove()
	}

	const likedMoviesList = document.querySelector(".liked-movies-list")
	likedMoviesList.innerHTML = ""

	likedMovies.forEach((item) => {
		getMovieDetail(item).then((movie) => {
			const likedMovieContainer = document.createElement("div")
			likedMovieContainer.className = "liked-movie-container"

			const likedPoster = document.createElement("a")
			likedPoster.className = "liked-poster"
			likedPoster.setAttribute("href", movie.tmdbLink)
			likedPoster.setAttribute("target", "_blank")

			//Set the poster
			likedPoster.style.backgroundImage = `url(${movie.poster})`

			//Construct the element
			likedMovieContainer.appendChild(likedPoster)

			//Insert the element into the list
			likedMoviesList.appendChild(likedMovieContainer)
		})
	})
}
