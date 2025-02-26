import { getMovieDetail } from "../getMovieInfo/getMovieDetail"

export function formatDate(date) {
	function padNumber(number) {
		return number.toString().padStart(2, "0")
	}
	date = new Date(date)
	return [
		padNumber(date.getDate()),
		padNumber(date.getMonth() + 1),
		padNumber(date.getFullYear())
	].join("/")
}

export async function cachePosters(numberOfPosters, cachedPosters, movieArray) {
	//Need to grab from the start of the array as getMovie takes
	//the last first in the array
	const postersToCache = movieArray.slice(
		cachedPosters.length,
		numberOfPosters + cachedPosters.length
	)

	postersToCache.forEach((poster) => {
		const image = new Image()
		cachedPosters.push(poster)
		getMovieDetail(poster).then((data) => {
			image.src = data.poster
		})
	})

	return cachedPosters
}

export function convertYear(year, firstLast) {
	if (!year) return undefined
	let date
	const currentYear = new Date().getFullYear()
	if (year > currentYear) {
		year = currentYear
	} else if (year < 1900) {
		year = 1900
	}
	if (firstLast === "first") {
		date = new Date(year, 0, 2)
	} else if (firstLast === "last") {
		date = new Date(year, 11, 32)
	}
	return date.toISOString().split("T")[0]
}
