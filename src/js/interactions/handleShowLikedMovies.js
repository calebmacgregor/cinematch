export function showLikedMovies(elementState) {
	elementState.likedMoviesContainer.style.display = "block"
	setTimeout(() => {
		elementState.likedMoviesContainer.classList.remove("hidden")
	}, 1)
}
