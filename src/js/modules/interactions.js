import { rotateMovie } from "./handleMovieElements.js"
import { incrementMovie } from "./firebaseComms.js"
import { renderBanner, removeBanner, endSession } from "./misc.js"

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
	coordinatesObject.touchCurrentTime = e.timeStamp
	coordinatesObject.touchCurrentY = e.touches[0].clientY
	coordinatesObject.deltaX =
		coordinatesObject.touchStartX - coordinatesObject.touchCurrentX
	coordinatesObject.deltaY =
		coordinatesObject.touchStartY - coordinatesObject.touchCurrentY
	coordinatesObject.direction = coordinatesObject.deltaX < 0 ? "right" : "left"
	elementState.poster.style.transform = `rotate(${
		coordinatesObject.deltaX * -0.03 * coordinatesObject.rotationPivot
	}deg) translateX(${coordinatesObject.deltaX * -1}px)  translateY(${
		coordinatesObject.deltaY * -1
	}px)`
}

export function instantResetCardCoordinates(coordinatesObject, elementState) {
	elementState.poster.style.transition = ""
	elementState.poster.style.transform = ""
	removeBanner()
	resetCoordinateTracking(coordinatesObject)
}

export function smoothResetCardCoordinates(coordinatesObject, elementState) {
	elementState.poster.style.transition = `250ms linear`
	elementState.poster.style.transform = ""
	removeBanner()
	setTimeout(() => {
		elementState.poster.style.transition = "none"
		resetCoordinateTracking(coordinatesObject)
	}, 250)
}

export function resetCoordinateTracking(coordinatesObject) {
	coordinatesObject.touchStartX = undefined
	coordinatesObject.touchStartY = undefined
	coordinatesObject.touchCurrentX = undefined
	coordinatesObject.touchCurrentY = undefined
	coordinatesObject.deltaX = undefined
	coordinatesObject.deltaY = undefined
	coordinatesObject.rotationPivot = undefined
	coordinatesObject.speed = undefined
	coordinatesObject.direction = undefined
}

export function shrinkPoster(elementState) {
	const speed = 250
	//Adjust parent container styling
	elementState.posterContainer.classList.add("shrunk")
	elementState.nextPosterContainer.classList.add("hidden")

	//Adjust main poster styling
	elementState.poster.style.transition = `${speed}ms ease-in-out`
	elementState.poster.classList.add("shrunk")

	//Adjust next poster styling
	elementState.nextPoster.classList.add("hidden")

	//Adjust button styling
	elementState.buttons.classList.add("hidden")

	// The rest of the adjustments happen once the shrinking animation is done
	setTimeout(() => {
		//Adjust content visibility and
		//dynamically set the location of the synopsis
		elementState.movieMetadata.classList.add("visible")
		elementState.synopsis.classList.add("visible")
		elementState.dismiss.classList.add("visible")
	}, speed)
}

export function expandPoster(elementState) {
	const speed = 250
	//Adjust button styling
	elementState.buttons.classList.remove("hidden")

	//Adjust main poster styling
	elementState.poster.style.transition = `${speed}ms ease`
	elementState.poster.classList.remove("shrunk")
	elementState.posterContainer.classList.remove("shrunk")

	elementState.movieMetadata.classList.remove("visible")
	elementState.synopsis.classList.remove("visible")
	elementState.dismiss.classList.remove("visible")
	//Remove the transition from the poster after it has expanded
	setTimeout(() => {
		//Adjust next poster styling
		elementState.nextPosterContainer.classList.remove("hidden")
		// elementState.nextPoster.style.display = "block"
		elementState.poster.style.transition = "none"
	}, speed)
}

export function edgeSwipe(coordinates, movieState, movieArray, elementState) {
	const speed = 250
	elementState.poster.style.transition = `${speed}ms linear`
	elementState.poster.style.transform = `translateX(${
		coordinates.deltaX * -5
	}px) translateY(${coordinates.deltaY * -5}px)`
	setTimeout(() => {
		instantResetCardCoordinates(coordinates, elementState)
		rotateMovie(movieState, movieArray, elementState)
	}, speed)
	removeBanner()
}

export function handleSwipe(
	coordinates,
	thresholdState,
	movieState,
	elementState,
	movieArray,
	sessionName,
	likeThreshold
) {
	if (
		coordinates.deltaX * -0.05 > thresholdState.edgeThreshold ||
		coordinates.deltaX * -0.05 < -thresholdState.edgeThreshold
	) {
		//Handle the swipe animation
		edgeSwipe(coordinates, movieState, movieArray, elementState)
		if (elementState.poster.getBoundingClientRect().x > 0) {
			incrementMovie(movieState.currentMovie.id, sessionName, likeThreshold)
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
	likeThreshold
) {
	if (e.target.classList.contains("like")) {
		incrementMovie(movieState.currentMovie.id, sessionName, likeThreshold)
		coordinates.direction = "right"
		elementState.poster.style.transition = `250ms linear`
		elementState.poster.style.transform = "translateX(500px) rotate(15deg)"
		elementState.poster.classList.remove("liked")
	} else if (e.target.classList.contains("dislike")) {
		coordinates.direction = "left"
		elementState.poster.style.transition = `250ms linear`
		elementState.poster.style.transform = "translateX(-500px) rotate(-15deg)"
		elementState.poster.classList.remove("disliked")
	}

	sessionStorage.setItem("MATCHY-posterLock", "true")
	setTimeout(() => {
		if (elementState.poster.dataset.final === "true") {
			endSession(elementState)
		}
		rotateMovie(movieState, movieArray, elementState)
		instantResetCardCoordinates(coordinates, elementState)
	}, 250)
}
