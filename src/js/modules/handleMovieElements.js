import { getMovie, getMovieDetail } from "./getMovies.js"

export async function initialiseMovie(
	movieArray,
	elementState,
	posterNumber = 1,
	cachedPosters,
	index
) {
	//Get a random movie from the session array
	const movieID = await getMovie(movieArray, elementState, cachedPosters, index)

	//Get the detail for that movie
	const movie = await getMovieDetail(movieID)

	//Set the metadata if relevant
	if (posterNumber === 1) {
		setMetadata(movie)
		elementState.poster.dataset.id = movie.id
	}

	//Set the images for the relevant poster
	setImages(movie, posterNumber, elementState)

	//Return the movie for use elsewhere
	return movie
}

export function rotateMovie(
	movieState,
	movieArray,
	elementState,
	cachedPosters
) {
	movieState.currentMovie = movieState.nextMovie
	elementState.poster.dataset.id = movieState.currentMovie.id

	setImages(movieState.nextMovie, 1, elementState)
	setMetadata(movieState.nextMovie)
	initialiseMovie(movieArray, elementState, 2, cachedPosters, 0).then(
		(movie) => {
			movieState.nextMovie = movie
		}
	)
}

export function setMetadata(movie) {
	if (movie.id === 0) return
	let title = document.querySelector(".title")
	let year = document.querySelector(".year")
	let rating = document.querySelector(".rating")
	let genres = document.querySelector(".genres")
	let runtime = document.querySelector(".runtime")
	let synopsis = document.querySelector(".synopsis")
	let tmdbLink = document.querySelector(".tmdb")

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

	title.innerText = movie.title
	year.innerText = movie.year
	rating.innerText = movie.rating
	// genres.innerText = movie.genres
	runtime.innerText = `${movie.runtime} minutes`
	synopsis.innerText = movie.synopsis

	if (movie.tmdbLink) {
		tmdbLink.href = movie.tmdbLink
	}
}

export function setImages(movie, posterNumber, elementState) {
	if (posterNumber === 1) {
		elementState.poster.src = movie.poster
	} else if (posterNumber === 2) {
		elementState.nextPoster.src = movie.poster
	}
	elementState.poster.style.display = "block"
}
