export async function getRandomPoster() {
	const apiKey = import.meta.env.VITE_TMDB_API_KEY
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
