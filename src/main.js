import { getRandomPoster } from "./js/getMovieInfo/getRandomPoster"
import { checkAspectRatio } from "./js/utils/checkAspectRatio"
import { setBodySize } from "./js/utils/setBodySize"
import { checkSession } from "./supabase/checkSession"
import { createToast } from "./js/elements/injectToast"

import posthog from "posthog-js"
posthog.init("phc_wd3kAC3aF01Odr7Lv5MImezHKHroIW489CEVFgInw9t", {
	api_host: "https://us.i.posthog.com"
})

const form = document.querySelector(".join-session-form")
const input = document.querySelector("#session-name-input")
const createSessionButton = document.querySelector(".new-session")

const [frontPoster, leftPoster, rightPoster] = [...document.querySelectorAll(".poster")]
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

createSessionButton.addEventListener("click", () => {
	window.location.assign("create.html")
})

form.addEventListener("submit", async (e) => {
	e.preventDefault()

	const session = await checkSession(input.value)

	if (!session) {
		createToast(
			"error",
			"No session found",
			`Can't find a session - check your spelling or create a new one`,
			5000
		)
	}

	if (session) {
		window.location.assign(`/app?session=${input.value}`)
	}
})
