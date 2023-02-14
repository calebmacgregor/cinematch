import { checkIfSessionExists } from "./modules/firebaseComms.js"
import { createToast, redirectToApp } from "./modules/utils/misc.js"
import { checkAspectRatio } from "./modules/utils/render.js"
import { setBodySize } from "./modules/utils/render.js"
import { getRandomPoster } from "./modules/getMovies.js"

const form = document.querySelector(".join-session-form")
const input = document.querySelector("#session-name-input")
const createSessionButton = document.querySelector(".new-session")

const [frontPoster, leftPoster, rightPoster] = [
	...document.querySelectorAll(".poster")
]
const posterBackdrops = getRandomPoster()

posterBackdrops.then((data) => {
	frontPoster.src = data[0]
	frontPoster.addEventListener("load", () => {
		frontPoster.style.transition = "1000ms ease"
		frontPoster.classList.remove("offscreen")
	})

	leftPoster.src = data[1]
	leftPoster.addEventListener("load", () => {
		leftPoster.style.transition = "1000ms ease"
		leftPoster.classList.remove("offscreen")
	})

	rightPoster.src = data[2]
	rightPoster.addEventListener("load", () => {
		rightPoster.style.transition = "1000ms ease"
		rightPoster.classList.remove("offscreen")
	})
})

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
				redirectToApp(input.value)
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
