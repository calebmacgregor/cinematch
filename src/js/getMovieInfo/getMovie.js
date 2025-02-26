export async function getMovie(movieArray, index = 0) {
	index = movieArray.length === 1 ? 0 : index

	const movie = movieArray[index]
	movieArray.splice(index, 1)

	return movie
}
