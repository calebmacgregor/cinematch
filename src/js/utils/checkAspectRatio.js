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
