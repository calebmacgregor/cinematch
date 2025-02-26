export function getSwiped(sessionName) {
	const storedSwiped = localStorage.getItem(`cinematch-swiped-${sessionName}`)

	if (localStorage.getItem(`cinematch-swiped-${sessionName}`)) {
		return JSON.parse(storedSwiped)
	} else {
		localStorage.setItem(`cinematch-swiped-${sessionName}`, JSON.stringify([]))
		return []
	}
}
