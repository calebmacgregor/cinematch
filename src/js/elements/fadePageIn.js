export function fadePageIn(containerClassName) {
	const container = document.querySelector(`.${containerClassName}`)
	container.classList.remove("hidden")
}
