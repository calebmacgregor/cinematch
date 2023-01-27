export const elementState = {
	body: document.querySelector("body"),
	posterContainer: document.querySelector(".poster-container"),
	nextPosterContainer: document.querySelector(".next-poster-container"),
	poster: document.querySelector(".poster"),
	nextPoster: document.querySelector(".next-poster"),
	buttons: document.querySelector(".buttons"),
	movieMetadata: document.querySelector(".movie-metadata"),
	synopsis: document.querySelector(".synopsis"),
	dismiss: document.querySelector(".dismiss"),
	notificationContainer: document.querySelector(".notification-container"),
	notificationTitle: document.querySelector("#notification-title"),
	notificationMovie: document.querySelector(".notification-movie"),
	likedMoviesContainer: document.querySelector(".liked-movies-container"),
	menuContainer: document.querySelector(".menu-container"),
	menuPanel: document.querySelector(".menu-panel"),
	clearSwipeCache: document.querySelector("#clear-swipe-cache"),
	likedMoviesContainer: document.querySelector(".liked-movies-container"),
	deleteSession: document.querySelector("#delete-session"),
	like: document.querySelector(".like"),
	dislike: document.querySelector(".dislike")
}

export const movieState = {
	currentMovie: {},
	nextMovie: {}
}
