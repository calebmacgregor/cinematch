import { getMovieDetail } from "../getMovies"

export async function redirectToMatchy(sessionName) {
	window.location.href = `app.html?session=${sessionName}`
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
			likedPoster.setAttribute("href", movie.tmdbLink)
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
	titleElement.classList.add("toast-title")
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

export function convertYear(year, firstLast) {
	if (!year) return undefined
	let date
	const currentYear = new Date().getFullYear()
	if (year > currentYear) {
		year = currentYear
	} else if (year < 1900) {
		year = 1900
	}
	if (firstLast === "first") {
		date = new Date(year, 0, 2)
	} else if (firstLast === "last") {
		date = new Date(year, 11, 32)
	}
	return date.toISOString().split("T")[0]
}
