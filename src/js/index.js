import { checkIfSessionExists } from "./modules/firebaseComms.js"
import { redirectToMatchy } from "./modules/misc.js"
import { createToast } from "./modules/misc.js"
import { checkAspectRatio } from "./modules/misc.js"
import { setBodySize } from "./modules/misc.js"

const form = document.querySelector(".join-session-form")
const input = document.querySelector("#session-name-input")
const createSessionButton = document.querySelector(".new-session")

setBodySize()
checkAspectRatio()

window.addEventListener("resize", checkAspectRatio)

createSessionButton.addEventListener("click", (e) => {
	window.location.assign("/create.html")
})

form.addEventListener("submit", (e) => {
	e.preventDefault()
	if (input.value) {
		checkIfSessionExists(input.value).then((result) => {
			if (result) {
				redirectToMatchy(input.value)
			} else {
				createToast(
					"warning",
					"No session found",
					"There's no session with that name. Check your spelling, or create a new one.",
					3000
				)
			}
		})
	}
})
