import { getMovieDetail } from "./getMovies"

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

export async function populateLikedMovies(sessionName) {
	const emptyMessage = document.querySelector(".empty-message")
	if (emptyMessage) {
		emptyMessage.remove()
	}

	const likedMovies = JSON.parse(localStorage.getItem(`LIKED-${sessionName}`))

	const likedMoviesList = document.querySelector(".liked-movies-list")
	likedMoviesList.innerHTML = ""

	likedMovies.forEach((item) => {
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

export function prepareSessionEnd(elementState) {
	//Tag the poster as the final movie
	try {
		elementState.poster.dataset.final = "true"
		elementState.nextPoster.remove()
	} catch (err) {
		console.log(err)
	}
}

export function endSession(elementState) {
	elementState.posterContainer.classList.add("end")
	elementState.posterContainer.innerHTML = "All out of movies 🍿 <br><br>"
	elementState.posterContainer.innerHTML +=
		"Check out your matches by clicking on the ❤️ below."
	elementState.nextPosterContainer.remove()
	elementState.like.style.visibility = "hidden"
	elementState.dislike.style.visibility = "hidden"
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
	const { height, width } = checkAspectRatio()
	const buttonHeight = elementState.buttons.offsetHeight
	const headerHeight = elementState.header.offsetHeight

	const posterAspect = 2 / 3
	const availableVerticalSpace = height * 0.95 - buttonHeight - headerHeight

	const proposedWidth = availableVerticalSpace * posterAspect
	const posterWidth =
		proposedWidth > width * 0.95 ? width * 0.95 : proposedWidth

	elementState.posterContainer.style.width = `${posterWidth}px`
	elementState.nextPosterContainer.style.width = `${posterWidth}px`
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

export async function cachePosters(numberOfPosters, cachedPosters, movieArray) {
	//Need to grab from the start of the array as getMovie takes
	//the last first in the array
	const postersToCache = movieArray.slice(
		cachedPosters.length,
		numberOfPosters + cachedPosters.length
	)

	postersToCache.forEach((poster) => {
		const image = new Image()
		cachedPosters.push(poster)
		getMovieDetail(poster).then((data) => {
			image.src = data.poster
		})
	})

	return cachedPosters
}

export function showLikedMovies(elementState) {
	elementState.likedMoviesContainer.style.display = "block"
	setTimeout(() => {
		elementState.likedMoviesContainer.classList.remove("hidden")
	}, 1)
}

export function createToast(type, title, content, duration = 1000) {
	console.log("Cooking the toast")
	let toastContainer = document.querySelector(".toast-container")

	if (!toastContainer) {
		toastContainer = document.createElement("div")
		toastContainer.classList.add("toast-container")
		document.body.prepend(toastContainer)
	}

	const toast = document.createElement("div")
	toast.classList.add("toast")
	toast.classList.add(`${type}`)
	toast.classList.add("appearing")

	const titleElement = document.createElement("p")
	titleElement.classList.add("title")
	titleElement.innerText = title
	toast.appendChild(titleElement)

	const contentElement = document.createElement("p")
	contentElement.classList.add("content")
	contentElement.innerText = content
	toast.appendChild(contentElement)

	toast.addEventListener("click", () => {
		toast.style.transition = "750ms ease"
		toast.classList.add("removing")
		toast.classList.add("phase-two")

		setTimeout(() => {
			toast.remove()
		}, 800)
	})

	toastContainer.appendChild(toast)

	setTimeout(() => {
		toast.classList.remove("appearing")
	}, 10)

	setTimeout(() => {
		toast.style.transition = "750ms ease"
		toast.classList.add("removing")
		toast.classList.add("phase-two")

		setTimeout(() => {
			toast.remove()
		}, 800)
	}, duration)
}
