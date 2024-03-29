import { cachePosters, prepareSessionEnd, formatDate } from "./utils/misc.js"
import { Movie } from "./classes.js"

export async function getMovieArray(sessionObject) {
	const { sessionSize, genres, providers, fromYear, toYear, country } =
		sessionObject
	const API_KEY = process.env.TMDB_API_KEY
	const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US`
	const adultParameter = "&include_adult=false"
	const sinceDateParameter = `&primary_release_date.gte=${fromYear}`
	const toDateParameter = `&primary_release_date.lte=${toYear}`
	const voteCountParameter = "&vote_count.gte=10"
	const genreParameter = genres ? `&with_genres=${genres.join("|")}` : ""
	const providerParameter = providers
		? `&with_watch_providers=${providers.join("|")}`
		: ""
	const regionParameter =
		country === undefined ? "" : `&watch_region=${country}`

	const URL = `${
		BASE_URL +
		adultParameter +
		voteCountParameter +
		genreParameter +
		providerParameter +
		sinceDateParameter +
		toDateParameter +
		regionParameter
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

export async function getMovieDetail(movieID, country = "AU") {
	if (movieID == undefined) {
		return new Movie()
	}

	const apiKey = process.env.TMDB_API_KEY
	const movieURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}&language=en-US`
	const baseImageUrl = "https://image.tmdb.org/t/p/w500"
	const providerURL = `https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=${apiKey}`

	const fetched = await fetch(movieURL)
	const data = await fetched.json()
	const genres = data.genres ? data.genres.map((genre) => genre.name) : []

	const fetchedProviders = await fetch(providerURL)
	const providersJson = await fetchedProviders.json()
	const providersData = providersJson?.results[country]?.flatrate
	const providers = providersData
		? providersJson.results[country].flatrate.map(
				(provider) => `${baseImageUrl}${provider.logo_path}`
		  )
		: []

	return new Movie(
		data.id,
		data.title,
		`${baseImageUrl}${data.poster_path}`,
		formatDate(data.release_date),
		`${data.vote_average.toFixed(1)}/10`,
		genres.join(`|`),
		data.runtime,
		data.overview,
		`${providersJson ? providersJson?.results[country]?.link : ""}`,
		providers.join(["|"])
	)
}

export async function getMovie(
	movieArray,
	elementState,
	cachedPosters,
	index = 0
) {
	//If this is the last movie, tag it
	if (movieArray.length === 0 && elementState.poster.dataset.final != "true") {
		prepareSessionEnd(elementState)
	}

	//If there are only 2 movies available at the start of the session then
	//I need to make sure the input index is 0, or it'll try
	//and grab an out of range movie
	index = movieArray.length === 1 ? 0 : index

	const movie = movieArray[index]
	movieArray.splice(index, 1)

	cachePosters(3, cachedPosters, movieArray)

	return movie
}

export async function getRandomPoster() {
	const apiKey = process.env.TMDB_API_KEY
	const pageNumber = Math.floor(Math.random() * 50 + 1)
	const baseURL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}&adult=false&vote_count.gte=100`

	const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w342"

	const fetched = await fetch(baseURL)
	const data = await fetched.json()

	const posters = []

	data.results.slice(0, 3).forEach((result) => {
		const url = `${BASE_IMAGE_URL}${result.poster_path}`
		posters.push(url)
	})

	return posters
}

// function injectError(message) {
// 	//Check if an error injection already exsits
// 	const errorCheck = document.querySelector(".error")
// 	if (errorCheck) return

// 	const errorElement = document.createElement("div")
// 	errorElement.classList.add("error")

// 	const errorMessage = document.createElement("p")
// 	errorMessage.classList.add("error-message")
// 	errorMessage.innerText = message

// 	errorElement.appendChild(errorMessage)

// 	document.body.appendChild(errorElement)
// }
