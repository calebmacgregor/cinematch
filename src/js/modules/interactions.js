import { rotateMovie } from "./handleMovieElements.js"
import { incrementMovie } from "./firebaseComms.js"
import {
	renderBanner,
	removeBanner,
	endSession,
	updateSwipedMovies
} from "./misc.js"

export function handleTouchStart(e, coordinatesObject, viewportHeight) {
	coordinatesObject.touchStartX = e.touches[0].clientX
	coordinatesObject.touchStartY = e.touches[0].clientY
	if (coordinatesObject.touchStartY < viewportHeight / 2) {
		coordinatesObject.rotationPivot = 1
	} else {
		coordinatesObject.rotationPivot = -1
	}
}

export function handleMove(e, coordinatesObject, elementState) {
	if (elementState.poster.classList.contains("shrunk")) return
	renderBanner(coordinatesObject)
	coordinatesObject.touchCurrentX = e.touches[0].clientX
	coordinatesObject.touchCurrentY = e.touches[0].clientY

	coordinatesObject.deltaX =
		coordinatesObject.touchStartX - coordinatesObject.touchCurrentX
	coordinatesObject.deltaY =
		coordinatesObject.touchStartY - coordinatesObject.touchCurrentY

	if (coordinatesObject.deltaX * -0.05 > 5) {
		elementState.poster.dataset.likedStatus = "liked"
	} else if (coordinatesObject.deltaX * -0.05 < -5) {
		elementState.poster.dataset.likedStatus = "disliked"
	} else {
		elementState.poster.removeAttribute("data-liked-status")
	}

	elementState.poster.style.transform = `rotate(${
		coordinatesObject.deltaX * -0.03 * coordinatesObject.rotationPivot
	}deg) translateX(${coordinatesObject.deltaX * -1}px)  translateY(${
		coordinatesObject.deltaY * -1
	}px)`
}

function instantResetCardCoordinates(coordinatesObject, elementState) {
	elementState.poster.style.transition = ""
	elementState.poster.style.transform = ""
	elementState.poster.removeAttribute("data-liked-status")
	removeBanner()
	resetCoordinateTracking(coordinatesObject)
}

function smoothResetCardCoordinates(coordinatesObject, elementState) {
	elementState.poster.style.transition = `250ms linear`
	elementState.poster.style.transform = ""
	elementState.poster.removeAttribute("data-liked-status")
	removeBanner()
	setTimeout(() => {
		elementState.poster.style.transition = "none"
		resetCoordinateTracking(coordinatesObject)
	}, 250)
}

export function resetCoordinateTracking(coordinatesObject) {
	Object.keys(coordinatesObject).forEach(
		(i) => (coordinatesObject[i] = undefined)
	)
}

export function handlePosterSizing(elementState) {
	const speed = 250

	if (elementState.posterContainer.classList.contains("shrunk")) {
		elementState.posterContainer.classList.remove("shrunk")
		elementState.poster.style.transition = `${speed}ms ease`
		elementState.poster.classList.remove("shrunk")

		elementState.movieMetadata.classList.remove("visible")
		elementState.synopsis.classList.remove("visible")
		elementState.dismiss.classList.remove("visible")

		elementState.buttons.classList.remove("hidden")

		setTimeout(() => {
			elementState.nextPosterContainer.classList.remove("hidden")
			elementState.poster.style.transition = "none"
		}, speed)
	} else {
		elementState.posterContainer.classList.add("shrunk")
		elementState.poster.style.transition = `${speed}ms ease-in-out`
		elementState.poster.classList.add("shrunk")

		elementState.nextPosterContainer.classList.add("hidden")
		elementState.nextPoster.classList.add("hidden")

		elementState.buttons.classList.add("hidden")

		// The rest of the adjustments happen once the shrinking animation is done
		setTimeout(() => {
			elementState.movieMetadata.classList.add("visible")
			elementState.synopsis.classList.add("visible")
			elementState.dismiss.classList.add("visible")
		}, speed)
	}
}

export function handleSwipe(
	coordinates,
	movieState,
	elementState,
	movieArray,
	sessionName,
	likeThreshold,
	cachedPosters
) {
	if (elementState.poster.dataset.likedStatus) {
		updateSwipedMovies(
			sessionName,
			Number.parseInt(elementState.poster.dataset.id)
		)

		//Handle the swipe animation
		//Add a transition to smoothly handle the rest of the movement
		elementState.poster.style.transition = `250ms linear`

		//Apply a translate that will send the poster in the correct direction
		elementState.poster.style.transform = `translateX(${
			coordinates.deltaX * -5
		}px) translateY(${coordinates.deltaY * -5}px)`

		//Temporarily disable all interactions
		elementState.body.style.pointerEvents = "none"

		setTimeout(() => {
			instantResetCardCoordinates(coordinates, elementState)
			rotateMovie(movieState, movieArray, elementState, cachedPosters)
			elementState.body.style.pointerEvents = "all"
		}, 250)

		removeBanner()

		if (elementState.poster.dataset.likedStatus === "liked") {
			incrementMovie(
				Number.parseInt(elementState.poster.dataset.id),
				sessionName,
				likeThreshold
			)
		}

		if (elementState.poster.dataset.final === "true") {
			endSession(elementState)
		}
	} else {
		removeBanner()
		//We only want to enact smooth reset if we've dragged this around
		if (coordinates.touchCurrentX) {
			smoothResetCardCoordinates(coordinates, elementState)
		}
	}
}

export function handleButtonPress(
	e,
	coordinates,
	movieState,
	movieArray,
	elementState,
	sessionName,
	likeThreshold,
	cachedPosters
) {
	if (e.target.classList.contains("like")) {
		incrementMovie(
			Number.parseInt(elementState.poster.dataset.id),
			sessionName,
			likeThreshold
		)
		elementState.poster.style.transition = `250ms linear`
		elementState.poster.style.transform = "translateX(500px) rotate(15deg)"
	} else if (e.target.classList.contains("dislike")) {
		elementState.poster.style.transition = `250ms linear`
		elementState.poster.style.transform = "translateX(-500px) rotate(-15deg)"
	}
	elementState.body.style.pointerEvents = "none"
	setTimeout(() => {
		if (elementState.poster.dataset.final === "true") {
			endSession(elementState)
		}
		rotateMovie(movieState, movieArray, elementState, cachedPosters)
		instantResetCardCoordinates(coordinates, elementState)
		elementState.body.style.pointerEvents = "all"
	}, 250)

	updateSwipedMovies(
		sessionName,
		Number.parseInt(elementState.poster.dataset.id)
	)
}
