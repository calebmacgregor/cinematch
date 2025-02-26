import { elementState } from "../elementState"

export function handleEndSession() {
	elementState.nextPosterContainer.remove()

	elementState.like.style.transition = "250ms ease"
	elementState.like.style.opacity = "0"

	elementState.dislike.style.transition = "250ms ease"
	elementState.dislike.style.opacity = "0"

	elementState.posterContainer.style.transition = "250ms ease"
	elementState.posterContainer.style.opacity = "0"

	setTimeout(() => {
		elementState.posterContainer.style.opacity = "1"
		elementState.posterContainer.classList.add("end")
		elementState.posterContainer.innerHTML = "All out of movies 🍿 <br><br>"
		elementState.posterContainer.innerHTML += "Check out your matches by clicking on the ❤️ below."
		elementState.body.style.pointerEvents = "all"
	}, 250)
}
