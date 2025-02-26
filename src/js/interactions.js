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
