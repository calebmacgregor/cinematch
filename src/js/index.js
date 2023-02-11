import { checkIfSessionExists } from "./modules/firebaseComms.js"
import { createToast, redirectToMatchy } from "./modules/utils/misc.js"
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
	const images = []

	for (let i = 0; i < 3; i++) {
		const image = new Image()
		image.src = data[i]
		images.push(image)
	}

	frontPoster.style.backgroundImage = `url(${data[0]})`
	leftPoster.style.backgroundImage = `url(${data[1]})`
	rightPoster.style.backgroundImage = `url(${data[2]})`

	frontPoster.style.animation = "main-entrance 1000ms 250ms forwards"
	console.log(frontPoster.style.animation)
	leftPoster.style.animation = "left-entrance 1000ms 250ms forwards"
	rightPoster.style.animation = "right-entrance 1000ms 250ms forwards"
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
