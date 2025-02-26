export function clearSwipedCache(sessionName) {
	localStorage.removeItem(`cinematch-swiped-${sessionName}`)
	location.reload()
}
