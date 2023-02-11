import * as Sentry from "@sentry/browser"
import { BrowserTracing } from "@sentry/tracing"

Sentry.init({
	dsn: "https://fcde7136bd2048e78edcf275b487250e@o4504655204319232.ingest.sentry.io/4504655205302272",

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,
	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	integrations: [new Sentry.Replay()]
})

import {
	joinSession,
	deleteSession,
	listenToSession,
	incrementMovie
} from "./modules/firebaseComms.js"
import {
	rotateMovie,
	setMovie,
	setMovieState
} from "./modules/handleMovieElements.js"
import {
	cachePosters,
	dismissNotification,
	endSession,
	clearSwipedCache,
	cachePosters,
	showLikedMovies,
	updateSwipedMovies
} from "./modules/utils/misc.js"
import { elementState, movieState } from "./modules/state.js"
import { Coordinates } from "./modules/classes.js"
import {
	fadePageOut,
	setPosterSize,
	checkAspectRatio,
	renderBanner,
	removeBanner
} from "./modules/utils/render.js"
import {
	handleButtonPress,
	handleSwipe,
	handlePosterSizing
} from "./modules/interactions.js"
import { getMovie, getMovieDetail } from "./modules/getMovies.js"

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
setPosterSize(elementState)

window.addEventListener("resize", () => {
	checkAspectRatio()
	setPosterSize(elementState)
})

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

		document.querySelector(".session-name").textContent = session.sessionName

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
			endSession(elementState)
			fadePageOut("loading-container")
		}
	})
	.then(() => {
		getMovie(movieArray, elementState, cachedPosters, 0).then((movieID) => {
			getMovieDetail(movieID).then((movie) => {
				setMovie(movie, 1)
				setMovieState(movieState, movie, 1)
			})
		})

		getMovie(movieArray, elementState, cachedPosters, 1).then((movieID) => {
			getMovieDetail(movieID).then((movie) => {
				setMovie(movie, 2)
				setMovieState(movieState, movie, 2)
				setPosterSize(elementState)

				elementState.poster.addEventListener("load", () =>
					fadePageOut("loading-container")
				)
			})
		})

		cachePosters(20, cachedPosters, movieArray)
	})
	.catch((err) => {
		console.log(err)
		window.location.href = "../.."
	})

elementState.poster.addEventListener("touchstart", (e) =>
	coordinates.handleTouchStart(e)
)

elementState.poster.addEventListener("touchmove", (e) => {
	coordinates.handleMove(e)
	renderBanner(coordinates)
})

elementState.poster.addEventListener("touchend", () => {
	const result = handleSwipe(coordinates, elementState)

	removeBanner()

	if (result.swiped) {
		updateSwipedMovies(session.sessionName, Number.parseInt(result.movieID))

		setTimeout(() => {
			elementState.poster.dataset.final && endSession(elementState)
			rotateMovie(movieState, movieArray, elementState, cachedPosters)
		}, 250)

		result.liked &&
			incrementMovie(
				Number.parseInt(result.movieID),
				session.sessionName,
				session.likeThreshold
			)
	}
})

//Clicking like/dislike buttons
document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("btn")) return
	const result = handleButtonPress(e, coordinates, elementState)

	result.liked &&
		incrementMovie(result.movieID, session.sessionName, session.likeThreshold)

	updateSwipedMovies(
		session.sessionName,
		Number.parseInt(elementState.poster.dataset.id)
	)

	setTimeout(() => {
		elementState.poster.dataset.final && endSession(elementState)
		rotateMovie(movieState, movieArray, elementState, cachedPosters)
	}, 250)
})

//Expanding/shrinking the poster
document.addEventListener("click", (e) => {
	if (
		e.target.classList.contains("poster") ||
		e.target.classList.contains("synopsis") ||
		e.target.classList.contains("dismiss")
	)
		handlePosterSizing(elementState)
})

//Toggline the menu
elementState.menuContainer.addEventListener("click", () => {
	elementState.menuPanel.classList.toggle("hidden")
})

//Hiding the menu when it's open and a non-menu click happens
document.addEventListener("click", (e) => {
	if (e.target.classList.contains("menu-icon")) return
	if (!elementState.menuPanel.classList.contains("hidden")) {
		elementState.menuPanel.classList.add("hidden")
	}
})

//Clearing the swipe cache
elementState.clearSwipeCache.addEventListener("click", () => {
	clearSwipedCache(session.sessionName)
})

//Deleting the session
elementState.deleteSession.addEventListener("click", () => {
	deleteSession(session.sessionName)
})

//Dismissing a notification
document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("notification-container")) {
		return
	}
	e.target.classList.remove("visible")
})

//Showing the liked movies panel
document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("show-likes")) return
	showLikedMovies(elementState)
})

//Hiding the liked movies panel
document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("close")) return
	elementState.likedMoviesContainer.classList.add("hidden")
	setTimeout(() => {
		elementState.likedMoviesContainer.style.display = "none"
	}, 250)
})

function setLoadingMessage(message) {
	const loadingContainer = document.querySelector(".loading-container")
	loadingContainer.innerText = message
}

// document.querySelector("#logout").addEventListener("click", () => {
// 	console.log("Attempting signout")
// 	signOut(auth)
// 		.then(() => {
// 			window.location.href = "../.."
// 		})
// 		.catch((error) => {
// 			console.log("Signout unsuccessful", error)
// 		})
// })
