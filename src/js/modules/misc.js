import { getMovieDetail } from "./getMovies"

export class Coordinates {
	constructor() {
		this.touchStartX = undefined
		this.touchStartY = undefined
		this.touchStartTime = undefined
		this.touchCurrentX = undefined
		this.touchCurrentY = undefined
		this.touchCurrentTime = undefined
		this.deltaX = undefined
		this.deltaY = undefined
		this.rotationPivot = undefined
		this.speed = undefined
		this.direction = undefined
	}
}

export class Movie {
	constructor(
		id,
		title,
		poster,
		year,
		rating,
		genre,
		runtime,
		synopsis,
		imdbLink
	) {
		this.id = id
		this.title = title
		this.poster = poster
		this.year = year
		this.rating = rating
		this.genre = genre
		this.runtime = runtime
		this.synopsis = synopsis
		this.imdbLink = imdbLink
		this.likedStatus = ""
	}
}

export const elementState = {
	poster: document.querySelector(".poster"),
	nextPoster: document.querySelector(".next-poster"),
	background: document.querySelector(".background"),
	nextBackground: document.querySelector(".next-background"),
	likedStatus: document.querySelector(".liked-status"),
	buttons: document.querySelector(".buttons"),
	sessionID: document.querySelector("#session-id"),
	loading: document.querySelector(".session-loading"),
	detailTop: document.querySelector(".detail-top"),
	detailBottom: document.querySelector(".detail-bottom"),
	sessionLoadingText: document.querySelector(".session-loading-text"),
	sessionLoadingPercentage: document.querySelector(
		".session-loading-percentage"
	)
}

export const thresholdState = {
	speedThreshold: 0.3,
	edgeThreshold: 5
}

export const movieState = {
	currentMovie: {},
	nextMovie: {},
	backupMovie: {}
}

export function outOfMovies() {
	//Placeholder
}

export function renderBanner(coordinatesObject) {
	const likedStatus = document.querySelector(".liked-status")
	let directionCheck = coordinatesObject.deltaX / 100
	if (directionCheck < 0) {
		likedStatus.style.display = "block"
		likedStatus.style.opacity = `${Math.abs(directionCheck)}`
		likedStatus.style.right = "1rem"
		likedStatus.style.left = ""
		likedStatus.style.transform = "rotate(15deg)"
		likedStatus.innerText = "Like"
		likedStatus.style.color = "#53dd6c"
		likedStatus.style.borderColor = "#53dd6c"
	} else if (directionCheck > 0) {
		likedStatus.style.display = "block"
		likedStatus.style.opacity = `${Math.abs(directionCheck)}`
		likedStatus.style.right = ""
		likedStatus.style.left = "1rem"
		likedStatus.style.transform = "rotate(-15deg)"
		likedStatus.innerText = "Dislike"
		likedStatus.style.color = "#FF3C38"
		likedStatus.style.borderColor = "#FF3C38"
	}
}

export function removeBanner() {
	const likedStatus = document.querySelector(".liked-status")
	likedStatus.style.display = "none"
	likedStatus.style.opacity = `0`
	likedStatus.style.right = ""
	likedStatus.style.transform = ""
	likedStatus.innerText = ""
	likedStatus.style.color = ""
	likedStatus.style.borderColor = ""
}

export async function redirectToMatchy(sessionName) {
	window.location.href = `match.html?session=${sessionName}`
}

export function notifyOfMatch(movieObject) {
	//Get the viewable height of the viewport
	const vh = window.innerHeight * 0.01
	const notification = document.querySelector(".notification")
	if (window.innerHeight != window.outerHeight) {
		notification.style.bottom = `${vh}vh`
	}

	const movie = getMovieDetail(movieObject)
	movie.then((data) => {
		notification.classList.remove("hidden")

		const notificationMovie = document.querySelector(".notification-movie")
		notificationMovie.style.backgroundImage = `url(${data.poster})`
		notificationMovie.setAttribute("href", data.imdbLink)
	})
}

export function dismissNotification(e) {
	if (!e.target.classList.contains("notification-dismiss")) {
		return
	}
	e.target.closest(".notification").classList.add("hidden")
}

export function populateLikedMovies(movie) {
	const emptyMessage = document.querySelector(".empty-message")
	if (emptyMessage) {
		emptyMessage.remove()
	}

	const likedMoviesContainer = document.querySelector(".liked-movies-container")

	likedMoviesContainer.style.paddingBottom = `${
		(window.outerHeight - window.innerHeight) / 1.5
	}px`
	const likedMoviesList = document.querySelector(".liked-movies-list")

	const likedMovieContainer = document.createElement("div")
	likedMovieContainer.className = "liked-movie-container"

	const likedPoster = document.createElement("a")
	likedPoster.className = "liked-poster"
	likedPoster.setAttribute("href", movie.imdbLink)
	likedPoster.setAttribute("target", "_blank")

	const likedTitle = document.createElement("h3")
	likedTitle.className = "liked-title"

	//Set the poster
	likedPoster.style.backgroundImage = `url(${movie.poster})`

	//Set the title
	likedTitle.innerText = movie.title

	//Construct the element
	likedMovieContainer.appendChild(likedPoster)
	likedMovieContainer.appendChild(likedTitle)

	//Insert the element into the list
	likedMoviesList.appendChild(likedMovieContainer)
}
