import { getMovie, getMovieDetail } from "./getMovies.js"

export function setMovie(movie, movieNumber = 1) {
	//Set all the details
	if (movieNumber === 2) {
		let nextPoster = document.querySelector(".next-poster")
		try {
			nextPoster.src = movie.poster
		} catch {
			console.log("No movie provided")
		}
	} else {
		if (movie.id === 0) return
		let poster = document.querySelector(".poster")
		let title = document.querySelector(".title")
		let year = document.querySelector(".year")
		let rating = document.querySelector(".rating")
		let runtime = document.querySelector(".runtime")
		let synopsis = document.querySelector(".synopsis")
		let tmdbLink = document.querySelector(".tmdb")

		title.innerText = movie.title
		year.innerText = movie.year
		rating.innerText = movie.rating
		runtime.innerText = `${movie.runtime} minutes`
		synopsis.innerText = movie.synopsis
		tmdbLink.href = movie.tmdbLink ? movie.tmdbLink : ""
		poster.src = movie.poster
		poster.dataset.id = movie.id
		poster.style.display = "block"

		const providersArray = movie.providers.split("|")
		const providersContainer = document.querySelector("#providers")
		providersContainer.innerHTML = ""
		providersArray.forEach((provider) => {
			const elem = document.createElement("li")
			elem.classList = "provider"
			elem.style.backgroundImage = `url(${provider})`

			providersContainer.appendChild(elem)
		})

		const genresArray = movie.genres.split("|")
		const genresContainer = document.querySelector(".genres")
		genresContainer.innerHTML = ""
		genresArray.forEach((genre) => {
			const elem = document.createElement("li")
			elem.classList = "genre"
			elem.innerText = genre

			genresContainer.appendChild(elem)
		})
	}

	return movie
}

export function setMovieState(movieState, movie, movieNumber) {
	if (movieNumber === 1) {
		movieState.currentMovie = movie
	} else {
		movieState.nextMovie = movie
	}
}

export async function rotateMovie(
	movieState,
	movieArray,
	elementState,
	cachedPosters
) {
	setMovie(movieState.nextMovie, 1)

	elementState.poster.style.pointerEvents = "none"
	elementState.buttons.pointerEvents = "none"

	const nextMovieID = await getMovie(movieArray, elementState, cachedPosters, 0)
	const nextMovie = await getMovieDetail(nextMovieID)

	setMovieState(movieState, nextMovie, 2)

	await setMovie(nextMovie, 2)
	elementState.poster.style.pointerEvents = "all"
	elementState.buttons.pointerEvents = "all"
}
