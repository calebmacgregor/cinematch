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

export async function cachePosters(movieArray) {
	movieArray?.forEach((movie) => {
		const image = new Image()

		getMovieDetail(movie).then((data) => {
			image.src = data.poster
		})
	})
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
