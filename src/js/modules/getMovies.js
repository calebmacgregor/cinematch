import { cachePosters, prepareSessionEnd } from "./misc.js"
import { formatDate } from "./misc.js"
import { Movie } from "./classes.js"

export async function getMovieArray(sessionObject) {
	const { sessionSize, genres, providers, fromYear, toYear, country } =
		sessionObject
	const API_KEY = process.env.TMDB_API_KEY
	const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US`
	const adultParameter = "&include_adult=false"
	const sinceDateParameter = `&primary_release_date.gte=${fromYear}`
	const toDateParameter = `&primary_release_date.lte=${toYear}`
	const voteCountParameter = "&vote_count.gte=100"
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
		return new Movie(
			0,
			undefined,
			undefined,
			undefined,
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
	const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500"
	const providerURL = `https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=${API_KEY}`

	const fetched = await fetch(movieURL)
	const data = await fetched.json()
	const genres = data.genres.slice(0, 2).map((genre) => genre.name)

	const fetchedProviders = await fetch(providerURL)
	const providersData = await fetchedProviders.json()
	const providers = []
	providersData.results[country].flatrate.forEach((provider) => {
		providers.push(provider.provider_name)
	})

	return new Movie(
		data.id,
		data.title,
		`${BASE_IMAGE_URL}${data.poster_path}`,
		formatDate(data.release_date),
		`${data.vote_average.toFixed(1)}/10`,
		genres.join(`/`),
		data.runtime,
		data.overview,
		`${providersData.results[country].link}`,
		providers.join([", "])
	)
}

export async function getMovie(movieArray, elementState, cachedPosters, index) {
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

	cachePosters(1, cachedPosters, movieArray)

	return movie
}
