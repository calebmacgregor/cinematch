export function fadePageOut(containerClassName) {
	const container = document.querySelector(`.${containerClassName}`)
	container.classList.add("hidden")
}
