export function removeBanner() {
	const likedStatus = document.querySelector(".liked-status")
	likedStatus.classList.remove("liked")
	likedStatus.classList.remove("disliked")
}
