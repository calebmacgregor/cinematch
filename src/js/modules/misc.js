import { getMovieDetail } from "./getMovies"
import { elementState } from "./state"

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
	window.location.href = `app.html?session=${sessionName}`
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

export function notifyOfMatch(movieObject, elementState) {
	const movie = getMovieDetail(movieObject)
	movie.then((data) => {
		console.log(data)
		elementState.notificationTitle.innerText = data.title
		elementState.notificationMovie.src = data.poster
		elementState.notificationContainer.classList.add("visible")
	})
	setTimeout(() => {
		elementState.notificationContainer.classList.remove("visible")
	}, 5000)
}

export function dismissNotification(e) {
	if (!e.target.classList.contains("notification-container")) {
		return
	}
	e.target.classList.remove("visible")
}

export async function populateLikedMovies(movieArray) {
	const emptyMessage = document.querySelector(".empty-message")
	if (emptyMessage) {
		emptyMessage.remove()
	}

	const likedMoviesList = document.querySelector(".liked-movies-list")
	likedMoviesList.innerHTML = ""

	movieArray.forEach((item) => {
		getMovieDetail(item).then((movie) => {
			const likedMovieContainer = document.createElement("div")
			likedMovieContainer.className = "liked-movie-container"

			const likedPoster = document.createElement("a")
			likedPoster.className = "liked-poster"
			likedPoster.setAttribute("href", movie.imdbLink)
			likedPoster.setAttribute("target", "_blank")

			//Set the poster
			likedPoster.style.backgroundImage = `url(${movie.poster})`

			//Construct the element
			likedMovieContainer.appendChild(likedPoster)

			//Insert the element into the list
			likedMoviesList.appendChild(likedMovieContainer)
		})
	})
}

export function prepareSessionEnd() {
	//Tag the poster as the final movie
	const poster = document.querySelector(".poster")
	poster.dataset.final = "true"
	elementState.nextPoster.remove()
}

export function endSession(elementState) {
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

export function updateSwipedMovies(sessionName, movieID) {
	const swipedMovies = JSON.parse(localStorage.getItem(sessionName))

	swipedMovies.push(movieID)

	localStorage.setItem(sessionName, JSON.stringify(swipedMovies))
}

export function clearSwipedCache(sessionName) {
	localStorage.removeItem(sessionName)
	location.reload()
}
