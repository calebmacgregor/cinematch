import { checkIfSessionExists } from "./modules/firebaseComms.js"
import { redirectToMatchy } from "./modules/misc.js"
import { fadePageOut, fadePageIn } from "./modules/misc.js"

const form = document.querySelector(".join-session-form")
const input = document.querySelector("#session-name-input")
const createSessionButton = document.querySelector(".new-session")

setTimeout(() => {
	fadePageIn("start-container")
}, 250)

createSessionButton.addEventListener("click", (e) => {
	fadePageOut("start-container")
	setTimeout(() => {
		window.location.replace("/session-generator.html")
	}, 250)
})

form.addEventListener("submit", (e) => {
	e.preventDefault()
	if (input.value) {
		checkIfSessionExists(input.value).then((result) => {
			if (result) {
				fadePageOut("start-container")
				setTimeout(() => {
					redirectToMatchy(input.value)
				}, 250)
			} else {
				const joinButton = document.querySelector(".join-session-btn")
				joinButton.innerText = "No session exists :("
				setTimeout(() => {
					joinButton.innerText = "Join Session"
				}, 2000)
			}
		})
	}
})
