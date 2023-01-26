import {
	joinSession,
	deleteSession,
	listenToSession
} from "./modules/firebaseComms.js"
import { initialiseMovie } from "./modules/handleMovieElements.js"
import { cachePosters, dismissNotification } from "./modules/misc.js"
import { elementState, movieState, thresholdState } from "./modules/state.js"
import { Coordinates } from "./modules/classes.js"
import { fadePageOut } from "./modules/misc.js"
import {
	checkAspectRatio,
	clearSwipedCache,
	cachePosters
} from "./modules/misc.js"
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
let cachedPosters = []

checkAspectRatio()

window.addEventListener("resize", checkAspectRatio)

//Import the session
joinSession(session.sessionName)
	.then((data) => {
		sessionStorage.setItem("matchyJoinEpoch", new Date().getTime())
		//Check whether the user has been part of this session before
		let swipedMovies = JSON.parse(
			localStorage.getItem(`${session.sessionName}`)
		)

		if (!swipedMovies) {
			localStorage.setItem(`${session.sessionName}`, JSON.stringify([]))
			swipedMovies = []
		}

		session.likeThreshold = data.likeThreshold
		setHeaderName(session.sessionName)
		listenToSession(session.sessionName, elementState)

		//Only include movies that aren't in the array
		movieArray = data.movies.filter((movie) => !swipedMovies.includes(movie))

		//I may remove this later, but randomizing the order makes each
		//persons session a bit more unique
		movieArray = movieArray.sort(() => {
			const i = Math.random() - 0.5
			return i
		})

		if (movieArray.length === 0) {
			console.log("Empty session")
			fadePageOut("loading-container")
		}
	})
	.then(() => {
		initialiseMovie(movieArray, elementState, 1, cachedPosters).then(
			(movie) => {
				movieState.currentMovie = movie
				elementState.poster.addEventListener("load", () => {
					fadePageOut("loading-container")
				})
			}
		)

		initialiseMovie(movieArray, elementState, 2, cachedPosters).then(
			(movie) => {
				movieState.nextMovie = movie
			}
		)

		cachePosters(10, cachedPosters, movieArray)
	})
	.catch((err) => {
		console.log(err)
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
		session.likeThreshold,
		cachedPosters
	)
)

elementState.poster.addEventListener("click", () => {
	if (elementState.poster.classList.contains("shrunk")) return
	shrinkPoster(elementState)
})

elementState.synopsis.addEventListener("click", () => {
	expandPoster(elementState)
})

elementState.dismiss.addEventListener("click", () => {
	expandPoster(elementState)
})

elementState.menuContainer.addEventListener("click", (e) => {
	elementState.menuPanel.classList.toggle("hidden")
})

elementState.clearSwipeCache.addEventListener("click", () => {
	clearSwipedCache(session.sessionName)
})

elementState.deleteSession.addEventListener("click", () => {
	deleteSession(session.sessionName)
})

document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("btn")) return
	handleButtonPress(
		e,
		coordinates,
		movieState,
		movieArray,
		elementState,
		session.sessionName,
		session.likeThreshold,
		cachedPosters
	)
})

document.addEventListener("click", (e) => {
	if (e.target.classList.contains("menu-icon")) return
	if (!elementState.menuPanel.classList.contains("hidden")) {
		elementState.menuPanel.classList.add("hidden")
	}
})

document.addEventListener("click", (e) => {
	dismissNotification(e)
})

document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("close")) return
	hideLikedMovies(elementState)
})

document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("show-likes")) return
	showLikedMovies(elementState)
})

function setHeaderName(sessionName) {
	const sessionHeaderName = document.querySelector(".session-name")
	sessionHeaderName.textContent = sessionName
}

function hideLikedMovies(elementState) {
	elementState.likedMoviesContainer.classList.add("hidden")
	setTimeout(() => {
		elementState.likedMoviesContainer.style.display = "none"
	}, 250)
}

function showLikedMovies(elementState) {
	elementState.likedMoviesContainer.style.display = "block"
	setTimeout(() => {
		elementState.likedMoviesContainer.classList.remove("hidden")
	}, 1)
}
