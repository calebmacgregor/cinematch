export const elementState = {
	posterContainer: document.querySelector(".poster-container"),
	nextPosterContainer: document.querySelector(".next-poster-container"),
	poster: document.querySelector(".poster"),
	nextPoster: document.querySelector(".next-poster"),
	background: document.querySelector(".background"),
	nextBackground: document.querySelector(".next-background"),
	likedStatus: document.querySelector(".liked-status"),
	buttons: document.querySelector(".buttons"),
	sessionID: document.querySelector("#session-id"),
	detailTop: document.querySelector(".detail-top"),
	detailBottom: document.querySelector(".detail-bottom"),
	movieMetadata: document.querySelector(".movie-metadata"),
	synopsis: document.querySelector(".synopsis"),
	dismiss: document.querySelector(".dismiss"),
	dismissNotification: document.querySelector(".dismiss-notification"),
	notificationContainer: document.querySelector(".notification-container"),
	notificationTitle: document.querySelector("#notification-title"),
	notificationMovie: document.querySelector(".notification-movie"),
	likedMoviesContainer: document.querySelector(".liked-movies-container"),
	menuContainer: document.querySelector(".menu-container"),
	menuPanel: document.querySelector(".menu-panel"),
	clearSwipeCache: document.querySelector("#clear-swipe-cache"),
	likedMoviesContainer: document.querySelector(".liked-movies-container"),
	deleteSession: document.querySelector("#delete-session")
}

export const thresholdState = {
	edgeThreshold: 5
}

export const movieState = {
	currentMovie: {},
	nextMovie: {}
}
