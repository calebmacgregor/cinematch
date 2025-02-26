export function handleSwipe(coordinates, elementState) {
	const speed = 400
	if (elementState.poster.dataset.likedStatus) {
		//Handle the swipe animation
		//Add a transition to smoothly handle the rest of the movement
		elementState.poster.style.transition = `${speed}ms linear`

		//Apply a translate that will send the poster in the correct direction
		elementState.poster.style.transform = `translateX(${coordinates.deltaX * -5}px) translateY(${
			coordinates.deltaY * -5
		}px)`

		//Temporarily disable all interactions
		elementState.body.style.pointerEvents = "none"

		elementState.poster.addEventListener(
			"load",
			() => {
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
