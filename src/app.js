import { setMovie } from "./js/setMovie.js"
import { getMovieMetadata } from "./js/getMovieInfo/getMovieMetadata.js"
import { showLikedMovies } from "./js/interactions/handleShowLikedMovies.js"
import { clearSwipedCache } from "./js/utils/clearSwipedCache.js"
import { elementState } from "./js/elementState.js"
import { Coordinates } from "./js/classes.js"
import { fadePageOut } from "./js/elements/fadePageOut.js"
import { setPosterSize } from "./js/utils/setPosterSize.js"
import { checkAspectRatio } from "./js/utils/checkAspectRatio.js"
import { renderBanner } from "./js/elements/renderBanner.js"
import { removeBanner } from "./js/elements/removeBanner.js"
import { handlePosterSizing } from "./js/interactions.js"
import { handleSwipe } from "./js/interactions/handleSwipe.js"
import { handleButtonPress } from "./js/interactions/handleButtonPress.js"
import { joinSession } from "./supabase/joinSession.js"
import { subscribe } from "./supabase/subscribe.js"
import { incrementMovie } from "./supabase/incrementMovie.js"
import { handleSwiped } from "./js/handlers/handleSwiped.js"
import { deleteSession } from "./supabase/deleteSession.js"
import { handleEndSession } from "./js/handlers/handleEndSession.js"
import { populateLikedMovies } from "./js/utils/populateLikedMovies.js"
import { getLikedMovies } from "./supabase/getLikedMovies.js"
import { cachePosters } from "./js/utils/misc.js"

import posthog from "posthog-js"
posthog.init("phc_wd3kAC3aF01Odr7Lv5MImezHKHroIW489CEVFgInw9t", {
	api_host: "https://us.i.posthog.com"
})

//Get the session from the URL parameters
const params = new URLSearchParams(window.location.search)
let session = params.get("session")

//Set up the global variables that are needed
let coordinates = new Coordinates()
let movieArray = []

const movieState = {
	currentMovie: 0,
	nextMovie: 0
}

checkAspectRatio()

window.addEventListener("resize", () => {
	checkAspectRatio()
	setPosterSize(elementState)
})

//This needs to be set here to make sure the event is attached
//before the image src is updated. Helps prevent issues where the
//image loads before the listener is attached.
elementState.poster.addEventListener("load", () => fadePageOut("loading-container"))
setPosterSize(elementState)

const sessionData = await joinSession(session)

if (!sessionData.sessionName) window.location.href = `/`

const likedMovies = await getLikedMovies(sessionData.sessionName, sessionData.likeThreshold)
populateLikedMovies(likedMovies)

subscribe(session, sessionData.likeThreshold, elementState)

movieArray = sessionData.movieArray

document.querySelector(".session-name").textContent = session

movieArray = movieArray.sort(() => {
	const i = Math.random() - 0.5
	return i
})

cachePosters(movieArray)

movieState.currentMovie = movieArray[movieArray.length - 1]
movieState.nextMovie = movieArray[movieArray.length - 2]

function initialiseMovies(movieState, movieArray) {
	movieState.currentMovie = movieArray.pop()
	movieState.nextMovie = movieArray.pop()
}

initialiseMovies(movieState, movieArray)

const currentMovieMetadata = await getMovieMetadata(movieState.currentMovie)
const nextMovieMetadata = await getMovieMetadata(movieState.nextMovie)

if (!currentMovieMetadata.id) {
	fadePageOut("loading-container")
	handleEndSession()
}

if (currentMovieMetadata.id) {
	setMovie(currentMovieMetadata, "primary")
}
if (nextMovieMetadata.id) {
	setMovie(nextMovieMetadata, "secondary")
}

elementState.poster.addEventListener("touchstart", (e) => coordinates.handleTouchStart(e))

elementState.poster.addEventListener("touchmove", (e) => {
	coordinates.handleMove(e)
	renderBanner(coordinates)
})

elementState.poster.addEventListener("touchend", async () => {
	const result = handleSwipe(coordinates, elementState)

	removeBanner()

	if (result.swiped) {
		handleSwiped(session, movieState, movieArray)

		if (result.liked) {
			incrementMovie(session, Number.parseInt(result.movieID))
		}
	}
})

//Clicking like/dislike buttons
document.addEventListener("click", async (e) => {
	if (!e.target.classList.contains("btn")) return
	const result = handleButtonPress(e, coordinates, elementState)

	handleSwiped(session, movieState, movieArray)

	if (result.liked) {
		incrementMovie(session, Number.parseInt(result.movieID))
	}
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
	clearSwipedCache(session)
})

//Deleting the session
elementState.deleteSession.addEventListener("click", () => {
	deleteSession(session)
})

//Dismissing a notification
document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("notification-container")) {
		return
	}
	e.target.classList.remove("visible")
})

//Showing the liked movies panel
document.addEventListener("click", async (e) => {
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
