import { Movie } from "../classes"
import { formatDate } from "../utils/misc"

export async function getMovieDetail(movieID, country = "AU") {
	if (movieID == undefined) {
		return new Movie()
	}

	const apiKey = import.meta.env.VITE_TMDB_API_KEY
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
