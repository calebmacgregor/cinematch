import { getMovieArray } from "./modules/getMovies"
import { createSession } from "./modules/firebaseComms"
import {
	createToast,
	redirectToMatchy,
	setBodySize,
	convertYear,
	fadePageIn,
	fadePageOut
} from "./modules/misc"

const prevButton = document.querySelector(".previous-page")
const nextButton = document.querySelector(".next-page")
const submitButton = document.querySelector(".submit-session")
const form = document.querySelector(".form-gen-container")

const inputPages = [...document.querySelectorAll(".input-page")]
const selectorContainers = [...document.querySelectorAll(".selector-container")]

let ACTIVE_PAGE = 0

const selectedGenres = []
const selectedProviders = []
const sessionObject = {}

setSessionData(selectedGenres, selectedProviders, sessionObject)
setBodySize()
populateProviders()
populateRegions()
populateGenres()

setTimeout(() => {
	fadePageIn("form-gen-container")
}, 250)

prevButton.addEventListener("click", previousPage)
nextButton.addEventListener("click", nextPage)

submitButton.addEventListener("click", () => {
	submitSession(sessionObject)
})

document.addEventListener("click", openSelector)

form.addEventListener("submit", (e) => {
	e.preventDefault()
})

document.addEventListener("click", (e) => {
	handleProviderSelections(e, selectedProviders, sessionObject)
	handleGenreSelections(e, selectedGenres, sessionObject)
})

document.addEventListener("input", () => {
	setSessionData(selectedGenres, selectedProviders, sessionObject)
})

document.body.addEventListener("keydown", (e) => {
	if (e.key !== "Enter") return
	nextPage()
})

document.addEventListener("click", (e) => {
	const shade = e.target.closest(".shade")
	if (!shade) return

	selectorContainers.forEach((container) => {
		container.classList.add("hidden")
	})
})

async function populateGenres() {
	const API_KEY = process.env.TMDB_API_KEY
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
	return genres
}

async function populateProviders(watchRegion = "AU") {
	const API_KEY = process.env.TMDB_API_KEY
	const provider_url = `https://api.themoviedb.org/3/watch/providers/movie?api_key=${API_KEY}&language=en-US&watch_region=${watchRegion}`
	const providerList = document.querySelector(".providers")

	const fetched = await fetch(provider_url)
	let providerData = await fetched.json()

	// const filteredProviders = providerData.results.filter((provider) =>
	// 	wantedProviders.includes(provider.provider_name)
	// )

	providerData.results.forEach((provider) => {
		const li = document.createElement("li")
		li.classList = "provider-li"
		li.id = `provider-${provider.provider_id}`
		li.setAttribute("data-provider-id", provider.provider_id)
		li.setAttribute("data-provider-name", provider.provider_name)

		const span = document.createElement("span")
		span.classList = "provider-span"
		span.innerText = provider.provider_name
		li.appendChild(span)

		providerList.appendChild(li)
	})
}

async function populateRegions() {
	const API_KEY = process.env.TMDB_API_KEY
	const region_url = `https://api.themoviedb.org/3/watch/providers/regions?api_key=${API_KEY}&language=en-US`
	const regionList = document.querySelector("#country")

	const fetched = await fetch(region_url)
	const regionData = await fetched.json()

	regionData.results.forEach((region) => {
		const option = document.createElement("option")
		option.value = region.iso_3166_1
		option.innerHTML = region.native_name

		regionList.appendChild(option)
	})
}

function setSessionData(selectedGenres, selectedProviders, sessionObject) {
	//Get data from all inputs on the page
	const sessionName = document.querySelector("#session-name")
	const likeThreshold = document.querySelector("#like-threshold")
	const sessionSize = document.querySelector("#session-size")
	const fromYear = document.querySelector("#from-date")
	const toYear = document.querySelector("#to-date")
	const country = document.querySelector("#country")

	sessionObject.sessionName = sessionName.value
	sessionObject.likeThreshold = likeThreshold.value
	sessionObject.sessionSize = sessionSize.value
	sessionObject.fromYear = convertYear(fromYear.value, "first")
	sessionObject.toYear = convertYear(toYear.value, "last")
	sessionObject.genres = selectedGenres
	sessionObject.providers = selectedProviders
	sessionObject.country =
		country.value === "default" ? undefined : country.value

	return sessionObject
}

function submitSession(sessionObject) {
	if (validateCompleteSession(sessionObject)) {
		document.querySelector(".submit-session").innerText = "Loading..."
		getMovieArray(sessionObject).then((data) => {
			createSession(
				data,
				sessionObject.sessionName,
				parseInt(sessionObject.likeThreshold),
				parseInt(sessionObject.sessionSize)
			).then((result) => {
				if (result.error == 1) {
					createToast(
						"error",
						"Name already taken",
						"Looks like that name is taken. Try picking a different one",
						2000
					)
					document.querySelector(".submit-session").innerText = "Create"
					return
				}
				redirectToMatchy(sessionObject.sessionName)
			})
		})
	}
}

function openSelector(e) {
	const selectorTrigger = e.target.closest(".selector-trigger")
	if (!selectorTrigger) return

	const container = selectorTrigger.closest(".input-container")
	const selectorContainer = container.querySelector(".selector-container")
	selectorContainer.classList.remove("hidden")
}

function nextPage() {
	if (ACTIVE_PAGE === 0) {
		if (!validateFirstPage(sessionObject)) {
			console.log("Invalid first page")
			return
		}
	} else if (ACTIVE_PAGE === 1) {
		if (!validateSecondPage(sessionObject)) {
			console.log("Invalid second page")
			return
		}
	}
	fadePageOut("form-gen-container")
	setTimeout(() => {
		//Set the new active page
		ACTIVE_PAGE += 1
		if (ACTIVE_PAGE > 0) {
			prevButton.classList.remove("hidden")
		}

		if (ACTIVE_PAGE === inputPages.length - 1) {
			nextButton.classList.add("hidden")
		}

		if (ACTIVE_PAGE === inputPages.length - 1) {
			submitButton.classList.remove("hidden")
		}

		//Remove the active status from every page
		inputPages.forEach((page) => (page.dataset.status = "inactive"))

		//Set the active status ont he correct page
		inputPages[ACTIVE_PAGE].dataset.status = "active"

		//Fade back in
		fadePageIn("form-gen-container")
	}, 250)
}

function previousPage() {
	fadePageOut("form-gen-container")
	setTimeout(() => {
		//Set the new active page
		ACTIVE_PAGE -= 1

		if (ACTIVE_PAGE === 0) {
			prevButton.classList.add("hidden")
		}

		if (ACTIVE_PAGE < inputPages.length - 1) {
			nextButton.classList.remove("hidden")
		}

		if (ACTIVE_PAGE < inputPages.length - 1) {
			submitButton.classList.add("hidden")
		}

		//Remove the active status from every page
		inputPages.forEach((page) => (page.dataset.status = "inactive"))

		//Set the active status ont he correct page
		inputPages[ACTIVE_PAGE].dataset.status = "active"

		//Fade back in
		fadePageIn("form-gen-container")
	}, 250)
}

function handleGenreSelections(e, selectedGenres, sessionObject) {
	if (!e.target.matches(".genre-li, .genre-span")) return
	const elem = e.target.closest(".genre-li")
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

	const genreNames = document.querySelector(".genre-names")
	genreNames.innerText =
		selectedGenres.length === 0
			? "Required"
			: `${selectedGenres.length} selected`
	setSessionData(selectedGenres, selectedProviders, sessionObject)
}

function handleProviderSelections(e, selectedProviders, sessionObject) {
	if (!e.target.matches(".provider-li, .provider-span")) return
	const elem = e.target.closest(".provider-li")
	const providerID = elem.dataset.providerId

	if (selectedProviders.includes(providerID)) {
		const idIndex = selectedProviders.indexOf(providerID)
		selectedProviders.splice(idIndex, 1)
		elem.classList.remove("selected")
	} else {
		//Adjust the class to highlight the selected
		elem.classList.add("selected")

		//Add the genre id to the array
		selectedProviders.push(providerID)
	}
	const providerNames = document.querySelector(".provider-names")
	providerNames.innerText =
		selectedProviders.length === 0
			? "Optional"
			: `${selectedProviders.length} selected`
	setSessionData(selectedGenres, selectedProviders, sessionObject)
}

function validateFirstPage(sessionObject) {
	if (
		//If all required fields exist, submit this.
		sessionObject.sessionName &&
		sessionObject.likeThreshold > 1 &&
		!isNaN(sessionObject.likeThreshold) &&
		sessionObject.sessionSize &&
		!isNaN(sessionObject.sessionSize)
	)
		return true
}

function validateSecondPage(sessionObject) {
	if (
		Date.parse(sessionObject.fromYear) &&
		Date.parse(sessionObject.toYear) &&
		sessionObject.genres.length > 0
	)
		return true
}

function validateCompleteSession(sessionObject) {
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
	)
		return true
}

function flagIncompleteInputs() {
	const inputs = [...document.querySelectorAll("[data-status=active] input")]
	inputs.forEach((input) => {
		input.classList.add("invalid")
	})
}

// flagIncompleteInputs()
