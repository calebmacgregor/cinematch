export async function getMovieArray(sessionObject) {
	const { sessionSize, genres, providers, fromYear, toYear, country } = sessionObject
	const API_KEY = import.meta.env.VITE_TMDB_API_KEY
	const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US`
	const adultParameter = "&include_adult=false"
	const sinceDateParameter = `&primary_release_date.gte=${fromYear}`
	const toDateParameter = `&primary_release_date.lte=${toYear}`
	const voteCountParameter = "&vote_count.gte=10"
	const genreParameter = genres ? `&with_genres=${genres.join("|")}` : ""
	const providerParameter = providers ? `&with_watch_providers=${providers.join("|")}` : ""
	const regionParameter = country === undefined ? "" : `&watch_region=${country}`

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
