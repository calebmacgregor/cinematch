export function renderBanner(coordinatesObject) {
	const likedStatus = document.querySelector(".liked-status")
	let directionCheck = coordinatesObject.deltaX / 100
	if (directionCheck < 0) {
		likedStatus.classList.add("liked")
		likedStatus.classList.remove("disliked")
		likedStatus.style.opacity = `${Math.abs(directionCheck)}`
	} else if (directionCheck > 0) {
		likedStatus.classList.add("disliked")
		likedStatus.classList.remove("liked")
		likedStatus.style.opacity = `${Math.abs(directionCheck)}`
	}
}
