import { prepareSessionEnd } from "./misc.js"
import { formatDate } from "./misc.js"
import { Movie } from "./classes.js"

export async function getMovieArray(sessionSize, genreArray, fromDate, toDate) {
	const API_KEY = "f1dbd004001c343c62d539bfaf7b8114"
	const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US`
	const adultParameter = "&include_adult=false"
	const sinceDateParameter = `&primary_release_date.gte=${fromDate}`
	const toDateParameter = `&primary_release_date.lte=${toDate}`
	const voteCountParameter = "&vote_count.gte=100"
	const genreParameter = genreArray
		? `&with_genres=${genreArray.join("|")}`
		: ""
	const URL = `${
		BASE_URL +
		adultParameter +
		voteCountParameter +
		genreParameter +
		sinceDateParameter +
		toDateParameter
	}`
	const PAGE_URL = `&page=`
	const results = []

	const result = await fetch(`${URL}`)
	const resultJson = await result.json()
	const numberOfPages = resultJson.total_pages

	let pages = sessionSize / 20 < 1 ? 1 : Math.ceil(sessionSize / 20)
	pages = pages < numberOfPages ? pages : numberOfPages

	//Grab the first {pages} number of pages
	for (let i = 0; i < pages; i++) {
		let fetched = await fetch(`${URL}${PAGE_URL}${i + 1}`)
		let data = await fetched.json()
		data.results.forEach((item) => {
			results.push(item.id)
		})
	}

	results.length = results.length > sessionSize ? sessionSize : results.length

	return results
}

export async function getMovieDetail(movieID) {
	if (movieID == undefined) {
		return new Movie(
			0,
			undefined,
			"src/assets/thumbs_up.png",
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined
		)
	}
	const API_KEY = process.env.TMDB_API_KEY
	const movieURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}&language=en-US`
	const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w342"
	const imdbBaseURL = "https://www.imdb.com/title/"

	const fetched = await fetch(movieURL)
	const data = await fetched.json()
	const genres = data.genres.slice(0, 2).map((genre) => genre.name)

	return new Movie(
		data.id,
		data.title,
		`${BASE_IMAGE_URL}${data.poster_path}`,
		formatDate(data.release_date),
		`${data.vote_average.toFixed(1)}/10`,
		genres.join(`/`),
		data.runtime,
		data.overview,
		`${imdbBaseURL}${data.imdb_id}`
	)
}

export async function getRandomMovie(movieArray) {
	const length = movieArray.length

	//If this is the last movie, tag it
	if (movieArray.length === 0) {
		prepareSessionEnd()
	}
	const movies = movieArray
	const randomNumber = Math.floor(Math.random() * length)
	const randomMovie = movies[randomNumber]

	movieArray.splice(randomNumber, 1)
	return randomMovie
}

export async function getGenreName(genreID) {}
