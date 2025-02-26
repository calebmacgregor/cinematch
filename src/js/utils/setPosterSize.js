export function setPosterSize(elementState) {
	const height = window.innerHeight
	const width = window.innerWidth
	const buttonHeight = elementState.buttons.offsetHeight
	const headerHeight = elementState.header.offsetHeight

	const posterAspect = 2 / 3
	const availableVerticalSpace = height * 0.95 - buttonHeight - headerHeight

	const proposedWidth = availableVerticalSpace * posterAspect
	const posterWidth = proposedWidth > width * 0.95 ? width * 0.95 : proposedWidth

	elementState.posterContainer.style.width = `${posterWidth}px`
	elementState.nextPosterContainer.style.width = `${posterWidth}px`

	//Setting the size of the metadata in here as well
	elementState.movieMetadata.style.height = `${posterWidth * (2 / 3)}px`
}
