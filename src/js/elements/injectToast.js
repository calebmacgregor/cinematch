export function createToast(type, title, content, duration = 1000) {
	let toastContainer = document.querySelector(".toast-container")

	if (!toastContainer) {
		toastContainer = document.createElement("div")
		toastContainer.classList.add("toast-container")
		document.body.prepend(toastContainer)
	}

	const toast = document.createElement("div")
	toast.classList.add("toast")
	toast.classList.add(`${type}`)
	toast.classList.add("appearing")

	const titleElement = document.createElement("p")
	titleElement.classList.add("toast-title")
	titleElement.innerText = title
	toast.appendChild(titleElement)

	const contentElement = document.createElement("p")
	contentElement.classList.add("content")
	contentElement.innerText = content
	toast.appendChild(contentElement)

	toast.addEventListener("click", () => {
		toast.style.transition = "750ms ease"
		toast.classList.add("removing")
		toast.classList.add("phase-two")

		setTimeout(() => {
			toast.remove()
		}, 800)
	})

	toastContainer.appendChild(toast)

	setTimeout(() => {
		toast.classList.remove("appearing")
	}, 10)

	setTimeout(() => {
		toast.style.transition = "750ms ease"
		toast.classList.add("removing")
		toast.classList.add("phase-two")

		setTimeout(() => {
			toast.remove()
		}, 800)
	}, duration)
}
