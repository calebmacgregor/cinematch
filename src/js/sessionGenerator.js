import { getMovieArray } from "./modules/getMovies"
import { createSession } from "./modules/firebaseComms"
import { redirectToMatchy, setBodySize } from "./modules/misc"

const selectedGenres = []
const sessionObject = {}

defaultDates()
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
	const fromDate = document.querySelector("#from-date")
	const toDate = document.querySelector("#to-date")

	sessionObject.sessionName = sessionName.value
	sessionObject.likeThreshold = likeThreshold.value
	sessionObject.sessionSize = sessionSize.value
	sessionObject.fromDate = fromDate.value
	sessionObject.toDate = toDate.value
	sessionObject.genres = selectedGenres
}

function defaultDates() {
	//Get the date input elements
	const fromDateElement = document.querySelector("#from-date")
	const toDateElement = document.querySelector("#to-date")

	//Generate two current date objects
	let toDate = new Date()
	let fromDate = new Date()

	//Set the from date to be 6 months prior to today
	fromDate.setMonth(fromDate.getMonth() - 6)

	//Format the dates properly
	fromDate = fromDate.toISOString().split("T")[0]
	toDate = toDate.toISOString().split("T")[0]

	//Set the value of the elements to their associated dates
	fromDateElement.value = fromDate
	toDateElement.value = toDate
}

function submitSession(sessionObject) {
	if (
		//If all required fields exist, submit this.
		sessionObject.sessionName &&
		sessionObject.likeThreshold > 1 &&
		!isNaN(sessionObject.likeThreshold) &&
		sessionObject.sessionSize &&
		!isNaN(sessionObject.sessionSize) &&
		Date.parse(sessionObject.fromDate) &&
		Date.parse(sessionObject.toDate) &&
		sessionObject.genres.length > 0
	) {
		document.querySelector(".submit-session").innerText = "Loading..."
		getMovieArray(
			sessionObject.sessionSize,
			sessionObject.genres,
			sessionObject.fromDate,
			sessionObject.toDate
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
	if (!e.target.classList.contains("genre-li")) return
	const genreID = e.target.dataset.genreId
	const genreName = e.target.dataset.genreName
	const genresList = document.querySelector(".genres-list")
	if (selectedGenres.includes(genreID)) {
		//Grab the element tag that needs removing
		const el = document.querySelector(`.tag-${genreName}`)
		el.remove()

		const idIndex = selectedGenres.indexOf(genreID)
		selectedGenres.splice(idIndex, 1)
		e.target.classList.remove("selected")
	} else {
		//Create the tag element
		const el = document.createElement("p")
		el.classList = `genre-tag tag-${genreName}`
		el.setAttribute("data-genre-id", genreID)
		el.setAttribute("data-genre-name", genreName)
		el.innerText = genreName
		el.style.backgroundColor = `#${Math.floor(
			Math.random() * 16777215
		).toString(16)}`
		genresList.appendChild(el)

		//Adjust the class to highlight the selected
		e.target.classList.add("selected")

		//Add the genre id to the array
		selectedGenres.push(genreID)
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

setBodySize()
