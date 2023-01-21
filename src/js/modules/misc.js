import { getMovieDetail } from "./getMovies"

export function renderBanner(coordinatesObject) {
	const likedStatus = document.querySelector(".liked-status")
	let directionCheck = coordinatesObject.deltaX / 100
	if (directionCheck < 0) {
		likedStatus.style.display = "block"
		likedStatus.style.opacity = `${Math.abs(directionCheck)}`
		likedStatus.style.right = "1rem"
		likedStatus.style.left = ""
		likedStatus.style.transform = "rotate(15deg)"
		likedStatus.innerText = "Like"
		likedStatus.style.color = "#53dd6c"
		likedStatus.style.borderColor = "#53dd6c"
	} else if (directionCheck > 0) {
		likedStatus.style.display = "block"
		likedStatus.style.opacity = `${Math.abs(directionCheck)}`
		likedStatus.style.right = ""
		likedStatus.style.left = "1rem"
		likedStatus.style.transform = "rotate(-15deg)"
		likedStatus.innerText = "Dislike"
		likedStatus.style.color = "#FF3C38"
		likedStatus.style.borderColor = "#FF3C38"
	}
}

export function removeBanner() {
	const likedStatus = document.querySelector(".liked-status")
	likedStatus.style.display = "none"
	likedStatus.style.opacity = `0`
	likedStatus.style.right = ""
	likedStatus.style.transform = ""
	likedStatus.innerText = ""
	likedStatus.style.color = ""
	likedStatus.style.borderColor = ""
}

export async function redirectToMatchy(sessionName) {
	window.location.href = `match.html?session=${sessionName}`
}

export function setBodySize() {
	const body = document.querySelector("body")
	body.style.height = `${window.innerHeight}px`
}

export function formatDate(date) {
	function padNumber(number) {
		return number.toString().padStart(2, "0")
	}
	date = new Date(date)
	return [
		padNumber(date.getDate()),
		padNumber(date.getMonth() + 1),
		padNumber(date.getFullYear())
	].join("/")
}

export function notifyOfMatch(movieObject) {
	//Get the viewable height of the viewport
	const vh = window.innerHeight * 0.01
	const notification = document.querySelector(".notification")
	if (window.innerHeight != window.outerHeight) {
		notification.style.bottom = `${vh}vh`
	}

	const movie = getMovieDetail(movieObject)
	movie.then((data) => {
		notification.classList.remove("hidden")

		const notificationMovie = document.querySelector(".notification-movie")
		notificationMovie.style.backgroundImage = `url(${data.poster})`
		notificationMovie.setAttribute("href", data.imdbLink)
	})
}

export function dismissNotification(e) {
	if (!e.target.classList.contains("notification-dismiss")) {
		return
	}
	e.target.closest(".notification").classList.add("hidden")
}

export function populateLikedMovies(movie) {
	const emptyMessage = document.querySelector(".empty-message")
	if (emptyMessage) {
		emptyMessage.remove()
	}

	const likedMoviesContainer = document.querySelector(".liked-movies-container")

	likedMoviesContainer.style.paddingBottom = `${
		(window.outerHeight - window.innerHeight) / 1.5
	}px`
	const likedMoviesList = document.querySelector(".liked-movies-list")

	const likedMovieContainer = document.createElement("div")
	likedMovieContainer.className = "liked-movie-container"

	const likedPoster = document.createElement("a")
	likedPoster.className = "liked-poster"
	likedPoster.setAttribute("href", movie.imdbLink)
	likedPoster.setAttribute("target", "_blank")

	const likedTitle = document.createElement("h3")
	likedTitle.className = "liked-title"

	//Set the poster
	likedPoster.style.backgroundImage = `url(${movie.poster})`

	//Set the title
	likedTitle.innerText = movie.title

	//Construct the element
	likedMovieContainer.appendChild(likedPoster)
	likedMovieContainer.appendChild(likedTitle)

	//Insert the element into the list
	likedMoviesList.appendChild(likedMovieContainer)
}

export function prepareSessionEnd() {
	//Tag the poster as the final movie
	const poster = document.querySelector(".poster")
	poster.dataset.final = "true"

	//Grab the 'next-poster' element
	const nextPoster = document.querySelector(".next-poster")

	//Remove any prior children. This prevents
	//multiple p fields from being added
	nextPoster.innerHTML = ""

	//Set the colour of the 'out of movies' poster
	nextPoster.style.backgroundColor = "#282a36"

	//Create the text element and populate it
	const p = document.createElement("p")
	p.innerText = "Out of movies"

	//Append it to the poster
	nextPoster.appendChild(p)
}

export function endSession() {
	elementState.poster.remove()
	const buttons = document.querySelector(".buttons")
	buttons.remove()
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

			const sizeWarning = document.createElement("p")
			sizeWarning.innerHTML =
				"This app was designed for phones (And tablets, although it looks best on phones). </br></br> If you are on your phone, rotate it to portrait mode. If you're on desktop, try visiting on your phone"

			sizeWarningContainer.appendChild(sizeWarning)
			document.body.appendChild(sizeWarningContainer)
		}
	}
	//If the element has been injected, but the ratio is good now
	else {
		if (elementCheck) elementCheck.classList.remove("visible")
	}
}
