import { joinSession, listenToSession } from "./modules/firebaseComms.js"
import { initialiseMovie } from "./modules/handleMovieElements.js"
import { dismissNotification } from "./modules/misc.js"
import { elementState, movieState, thresholdState } from "./modules/state.js"
import { Coordinates } from "./modules/classes.js"
import { fadePageOut } from "./modules/misc.js"
import { checkAspectRatio } from "./modules/misc.js"
import {
	shrinkPoster,
	expandPoster,
	handleButtonPress,
	handleSwipe,
	handleTouchStart,
	handleMove
} from "./modules/interactions.js"

//Get the session from the URL parameters
const params = new URLSearchParams(window.location.search)
let session = {
	sessionName: params.get("session")
}

//Set up the global variables that are needed
let coordinates = new Coordinates()
let movieArray = []

checkAspectRatio()

window.addEventListener("resize", checkAspectRatio)

//Import the session
joinSession(session.sessionName)
	.then((data) => {
		sessionStorage.setItem("matchyJoinEpoch", new Date().getTime())

		session.likeThreshold = data.likeThreshold
		setHeaderName(session.sessionName)
		listenToSession(session.sessionName)
		movieArray = data.movies
	})
	.then(() => {
		initialiseMovie(movieArray, elementState).then((movie) => {
			movieState.currentMovie = movie
			const poster = document.querySelector(".poster")
			poster.addEventListener("load", () => {
				console.log("loaded")
				fadePageOut("loading-container")
			})
		})

		initialiseMovie(movieArray, elementState, 2).then((movie) => {
			movieState.nextMovie = movie
		})
	})
	.catch(() => {
		window.location.href = "../.."
	})

elementState.poster.addEventListener("touchstart", (e) =>
	handleTouchStart(e, coordinates, window.innerHeight)
)

elementState.poster.addEventListener("touchmove", (e) =>
	handleMove(e, coordinates, elementState)
)

elementState.poster.addEventListener("touchend", (e) =>
	handleSwipe(
		coordinates,
		thresholdState,
		movieState,
		elementState,
		movieArray,
		session.sessionName,
		session.likeThreshold
	)
)

document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("btn")) return
	handleButtonPress(
		e,
		coordinates,
		movieState,
		movieArray,
		elementState,
		session.sessionName,
		session.likeThreshold
	)
})

elementState.poster.addEventListener("click", () => {
	if (elementState.poster.classList.contains("shrunk")) return
	shrinkPoster(elementState)
})

document.addEventListener("click", (e) => {
	const dismissable = e.target.closest(".dismiss-text")
	if (!dismissable) return
	expandPoster(elementState)
})

document.addEventListener("click", (e) => {
	dismissNotification(e)
})

function setHeaderName(sessionName) {
	const sessionHeaderName = document.querySelector(".session-name")
	sessionHeaderName.textContent = sessionName
}

function hideLikedMovies() {
	const likedMoviesContainer = document.querySelector(".liked-movies-container")
	likedMoviesContainer.classList.add("hidden")
	setTimeout(() => {
		likedMoviesContainer.style.display = "none"
	}, 250)
}

document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("close")) return
	hideLikedMovies()
})

function showLikedMovies() {
	const likedMoviesContainer = document.querySelector(".liked-movies-container")
	likedMoviesContainer.style.display = "block"
	setTimeout(() => {
		likedMoviesContainer.classList.remove("hidden")
	}, 1)
}

document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("show-likes")) return
	showLikedMovies()
})
