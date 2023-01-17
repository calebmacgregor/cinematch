import { checkIfSessionExists } from "./modules/firebaseComms.js"
import { redirectToMatchy } from "./modules/misc.js"

const form = document.querySelector(".join-session-form")
const input = document.querySelector("#session-name-input")

form.addEventListener("submit", (e) => {
	e.preventDefault()
	if (input.value) {
		checkIfSessionExists(input.value).then((result) => {
			if (result) {
				redirectToMatchy(input.value)
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

console.log(navigator.userAgent)
