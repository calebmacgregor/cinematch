export function setBodySize() {
	const body = document.querySelector("body")
	body.style.height = `${window.innerHeight}px`
}

export function renderBanner(coordinatesObject) {
	const likedStatus = document.querySelector(".liked-status")
	let directionCheck = coordinatesObject.deltaX / 100
	if (directionCheck < 0) {
		likedStatus.classList.add("liked")
		likedStatus.classList.remove("disliked")
		likedStatus.style.opacity = `${Math.abs(directionCheck)}`
	} else if (directionCheck > 0) {
		likedStatus.classList.add("disliked")
		likedStatus.classList.remove("liked")
		likedStatus.style.opacity = `${Math.abs(directionCheck)}`
	}
}

export function removeBanner() {
	const likedStatus = document.querySelector(".liked-status")
	likedStatus.classList.remove("liked")
	likedStatus.classList.remove("disliked")
}

export function fadePageOut(containerClassName) {
	const container = document.querySelector(`.${containerClassName}`)
	container.classList.add("hidden")
}

export function fadePageIn(containerClassName) {
	const container = document.querySelector(`.${containerClassName}`)
	container.classList.remove("hidden")
}

export function checkAspectRatio() {
	const width = window.innerWidth
	const height = window.innerHeight
	const aspectRatio = width / height

	const elementCheck = document.querySelector(".size-warning-container")

	//If the ratio is bad
	if (aspectRatio > 1.1) {
		//If the warning element has already been injected
		if (elementCheck) {
			elementCheck.classList.add("visible")
		}
		//If the element hasn't been injected
		else if (!elementCheck) {
			const sizeWarningContainer = document.createElement("div")
			sizeWarningContainer.classList.add("size-warning-container")
			sizeWarningContainer.classList.add("visible")

			const sizeWarningHeader = document.createElement("H2")
			sizeWarningHeader.innerHTML = "Woops..."
			sizeWarningContainer.appendChild(sizeWarningHeader)

			const sizeWarning = document.createElement("p")
			sizeWarning.innerHTML =
				"This app was designed for phones. </br></br> If you are on your phone, rotate it to portrait mode. If you're on desktop, try visiting on your phone"

			sizeWarningContainer.appendChild(sizeWarning)
			document.body.appendChild(sizeWarningContainer)
		}
	}
	//If the element has been injected, but the ratio is good now
	else {
		if (elementCheck) elementCheck.classList.remove("visible")
	}

	return { height, width, aspectRatio }
}

export function setPosterSize(elementState) {
	const height = window.innerHeight
	const width = window.innerWidth
	const buttonHeight = elementState.buttons.offsetHeight
	const headerHeight = elementState.header.offsetHeight

	const posterAspect = 2 / 3
	const availableVerticalSpace = height * 0.95 - buttonHeight - headerHeight

	const proposedWidth = availableVerticalSpace * posterAspect
	const posterWidth =
		proposedWidth > width * 0.95 ? width * 0.95 : proposedWidth

	elementState.posterContainer.style.width = `${posterWidth}px`
	elementState.nextPosterContainer.style.width = `${posterWidth}px`

	//Setting the size of the metadata in here as well
	elementState.movieMetadata.style.height = `${posterWidth * (2 / 3)}px`
}
