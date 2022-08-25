import { getMovieArray } from "./modules/getMovies"
import { createSession } from "./modules/firebaseComms"
import { redirectToMatchy, setBodySize } from "./modules/misc"

const selectedGenres = []
const sessionObject = {}

sessionData(selectedGenres, sessionObject)
populateGenres()

async function populateGenres() {
	const API_KEY = "f1dbd004001c343c62d539bfaf7b8114"
	const genre_url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
	const genreList = document.querySelector(".genres")

	const fetched = await fetch(genre_url)
	const data = await fetched.json()
	const genres = data
	genres.genres.forEach((genre) => {
		const li = document.createElement("li")
		li.classList = "genre-li"
		li.id = `genre-${genre.id}`
		li.setAttribute("data-genre-id", genre.id)
		li.setAttribute("data-genre-name", genre.name)

		const span = document.createElement("span")
		span.classList = "genre-span"
		span.innerText = genre.name
		li.appendChild(span)

		genreList.appendChild(li)
	})
}

function sessionData(selectedGenres, sessionObject) {
	//Get data from all inputs on the page
	const sessionName = document.querySelector("#session-name")
	const likeThreshold = document.querySelector("#like-threshold")
	const sessionSize = document.querySelector("#session-size")
	const fromYear = document.querySelector("#from-date")
	const toYear = document.querySelector("#to-date")

	sessionObject.sessionName = sessionName.value
	sessionObject.likeThreshold = likeThreshold.value
	sessionObject.sessionSize = sessionSize.value
	sessionObject.fromYear = convertYear(fromYear.value, "first")
	sessionObject.toYear = convertYear(toYear.value, "last")
	sessionObject.genres = selectedGenres
}

function submitSession(sessionObject) {
	if (
		//If all required fields exist, submit this.
		sessionObject.sessionName &&
		sessionObject.likeThreshold > 1 &&
		!isNaN(sessionObject.likeThreshold) &&
		sessionObject.sessionSize &&
		!isNaN(sessionObject.sessionSize) &&
		Date.parse(sessionObject.fromYear) &&
		Date.parse(sessionObject.toYear) &&
		sessionObject.genres.length > 0
	) {
		document.querySelector(".submit-session").innerText = "Loading..."
		getMovieArray(
			sessionObject.sessionSize,
			sessionObject.genres,
			sessionObject.fromYear,
			sessionObject.toYear
		).then((data) => {
			createSession(
				data,
				sessionObject.sessionName,
				parseInt(sessionObject.likeThreshold),
				parseInt(sessionObject.sessionSize)
			).then((result) => {
				if (result.error == 1) {
					console.log(result.errorMessage)
					return
				}
				redirectToMatchy(sessionObject.sessionName)
			})
		})
	}
}

const submitButton = document.querySelector(".submit-session")
submitButton.addEventListener("click", (e) => {
	submitSession(sessionObject)
})

//Disable default form behaviour
//TODO: Actually set this form up properly
const form = document.querySelector(".form-gen-container")
form.addEventListener("submit", (e) => {
	e.preventDefault()
	// submitSession(sessionObject)
	// redirectToMatchy()
})

//Handle the opening and closing of the genre selector
function openGenreSelector(e) {
	const genreTrigger = e.target.closest(".genre-trigger")
	if (!genreTrigger) return
	const genresContainer = document.querySelector(".genres-container")
	genresContainer.classList.remove("hidden")
}

function closeGenreSelector(e) {
	const trigger = e.target.closest(".genres-container")
	if (trigger) return
	const genresContainer = document.querySelector(".genres-container")
	genresContainer.classList.add("hidden")
}

document.addEventListener("click", closeGenreSelector)
document.addEventListener("click", openGenreSelector)

//Handle adding items to the genre list
function addToGenreList(e, selectedGenres, sessionObject) {
	if (!e.target.matches(".genre-li, .genre-span")) return
	const elem = e.target.closest(".genre-li")
	const genreTrigger = document.querySelector(".genre-trigger")
	const genreID = elem.dataset.genreId
	if (selectedGenres.includes(genreID)) {
		const idIndex = selectedGenres.indexOf(genreID)
		selectedGenres.splice(idIndex, 1)
		elem.classList.remove("selected")
	} else {
		//Adjust the class to highlight the selected
		elem.classList.add("selected")

		//Add the genre id to the array
		selectedGenres.push(genreID)
	}

	//Set the content of the text
	if (selectedGenres.length === 1) {
		genreTrigger.innerText = selectedGenres[0]
		console.log(selectedGenres)
	} else if (selectedGenres.length > 1) {
		let genres = ""
		selectedGenres.forEach((genre) => {
			genres += `${genre}, `
		})
		genreTrigger.innerText = genres.slice(0, -2)
	} else {
		genreTrigger.innerText = ""
	}
	sessionData(selectedGenres, sessionObject)
}

document.addEventListener("click", (e) => {
	addToGenreList(e, selectedGenres, sessionObject)
})

//Handle removing items from the genre list
function removeGenreTag(e, selectedGenres, sessionObject) {
	const genreTag = e.target.closest(".genre-tag")
	if (!genreTag) return

	//Remove the genre id from the array
	const idIndex = selectedGenres.indexOf(genreTag.dataset.genreId)
	selectedGenres.splice(idIndex, 1)

	//Remove the styling on the genre selector
	const listElement = document.querySelector(
		`#genre-${genreTag.dataset.genreId}`
	)
	listElement.classList.remove("selected")
	//Remove the tag
	e.target.remove()

	sessionData(selectedGenres, sessionObject)
}

document.addEventListener("click", (e) => {
	removeGenreTag(e, selectedGenres, sessionObject)
})

//Keep track of the inputs
document.addEventListener("input", () => {
	sessionData(selectedGenres, sessionObject)
})

function convertYear(year, firstLast) {
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

setBodySize()
