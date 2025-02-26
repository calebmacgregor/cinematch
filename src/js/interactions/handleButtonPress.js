export function handleButtonPress(e, coordinates, elementState) {
	console.log("running")
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
