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

export function handleSwipe(coordinates, elementState) {
	const speed = 400
	if (elementState.poster.dataset.likedStatus) {
		//Handle the swipe animation
		//Add a transition to smoothly handle the rest of the movement
		elementState.poster.style.transition = `${speed}ms linear`

		//Apply a translate that will send the poster in the correct direction
		elementState.poster.style.transform = `translateX(${
			coordinates.deltaX * -5
		}px) translateY(${coordinates.deltaY * -5}px)`

		//Temporarily disable all interactions
		elementState.body.style.pointerEvents = "none"

		elementState.poster.addEventListener(
			"load",
			() => {
				console.log("Loaded")
				coordinates.instantResetCardCoordinates(coordinates, elementState)
				elementState.body.style.pointerEvents = "all"
			},
			{ once: true }
		)

		return {
			swiped: true,
			liked: elementState.poster.dataset.likedStatus === "liked" ? true : false,
			movieID: elementState.poster.dataset.id
		}
	} else {
		//We only want to enact smooth reset if we've dragged this around
		if (coordinates.touchCurrentX) {
			coordinates.smoothResetCardCoordinates(coordinates, elementState)
		}
		return { swiped: false }
	}
}

export function handleButtonPress(e, coordinates, elementState) {
	if (e.target.classList.contains("like")) {
		elementState.poster.style.transition = `250ms linear`
		elementState.poster.style.transform = "translateX(110vw) rotate(10deg)"
	} else if (e.target.classList.contains("dislike")) {
		elementState.poster.style.transition = `250ms linear`
		elementState.poster.style.transform = "translateX(-110vw) rotate(-10deg)"
	}
	elementState.body.style.pointerEvents = "none"

	elementState.poster.addEventListener(
		"load",
		() => {
			console.log("Loaded")
			coordinates.instantResetCardCoordinates(coordinates, elementState)
			elementState.body.style.pointerEvents = "all"
		},
		{ once: true }
	)

	return {
		liked: e.target.classList.contains("like") ? true : false,
		movieID: elementState.poster.dataset.id
	}
}
