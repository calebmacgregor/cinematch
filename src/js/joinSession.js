import { redirectToMatchy } from "./modules/misc.js"

const form = document.querySelector(".join-session-form")
const input = document.querySelector("#session-name-input")

form.addEventListener("submit", (e) => {
	e.preventDefault()
	if (input.value) {
		redirectToMatchy(input.value)
	}
})

function setDistanceFromBottom() {
	const button = document.querySelector(".new-session")
	const body = document.querySelector(".body")
	// body.style.height = window.innerHeight
	if (window.innerHeight < window.outerHeight) {
		button.style.bottom = `${(window.outerHeight - window.innerHeight) / 1.5}px`
	}
}

// setDistanceFromBottom()
