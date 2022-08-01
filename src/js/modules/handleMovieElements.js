import { getRandomMovie, getMovieDetail } from "./getMovies.js"

export async function initialiseMovie(movieArray, posterNumber) {
	//Get a random movie from the session array
	const movieID = await getRandomMovie(movieArray)
	//Get the detail for that movie
	const movie = await getMovieDetail(movieID)

	//Set a placeholder poster value
	let poster

	if (posterNumber === 1) {
		//Get the current poster and set the metadata
		poster = document.querySelector(".poster")
		setMetadata(movie)
	} else if (posterNumber === 2) {
		//Get the next poster
		poster = document.querySelector(".next-poster")
	}

	//Set the images for the relevant poster
	setImages(movie, posterNumber)

	//Return the movie for use elsewhere
	return movie
}

export function rotateMovie(movieState, movieArray) {
	movieState.currentMovie = movieState.nextMovie
	setImages(movieState.nextMovie, 1)
	setMetadata(movieState.nextMovie, 1)
	initialiseMovie(movieArray, 2).then((movie) => {
		movieState.nextMovie = movie
	})
}

export function setMetadata(movie) {
	let title = document.querySelector(".title")
	let year = document.querySelector(".year")
	let rating = document.querySelector(".rating")
	let genre = document.querySelector(".genre")
	let runtime = document.querySelector(".runtime")
	let synopsis = document.querySelector(".synopsis")
	let imdbLink = document.querySelector(".imdb")

	title.innerText = movie.title
	year.innerText = movie.year
	rating.innerText = movie.rating
	genre.innerText = movie.genre
	runtime.innerText = `${movie.runtime} minutes`
	synopsis.innerText = movie.synopsis

	if (movie.imdbLink) {
		imdbLink.innerText = `IMDb Page`
		imdbLink.href = movie.imdbLink
	}

	if (movie.imdbLink) {
		imdbLink.innerText = `IMDb Page`
		imdbLink.href = movie.imdbLink
	}
}

export function setImages(movie, posterNumber) {
	let poster
	if (posterNumber === 1) {
		let background = document.querySelector(".background")
		poster = document.querySelector(".poster")
		poster.style.backgroundImage = `url(${movie.poster})`
		background.style.backgroundImage = `url(${movie.poster})`
	} else if (posterNumber === 2) {
		poster = document.querySelector(".next-poster")
		const posterTwoImage = (new Image().src = movie.poster)
		console.log(posterTwoImage)
		poster.style.backgroundImage = `url(${movie.poster})`
	}
	poster.style.display = "block"
}
