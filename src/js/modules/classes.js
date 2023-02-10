export class Coordinates {
	constructor() {
		this.touchStartX = undefined
		this.touchStartY = undefined
		this.touchCurrentX = undefined
		this.touchCurrentY = undefined
		this.deltaX = undefined
		this.deltaY = undefined
		this.rotationPivot = undefined
		this.direction = undefined
		this.viewportHeight = window.innerHeight
		this.poster = document.querySelector(".poster")
	}

	handleTouchStart(e) {
		this.touchStartX = e.touches[0].clientX
		this.touchStartY = e.touches[0].clientY
		if (this.touchStartY < this.viewportHeight / 2) {
			this.rotationPivot = 1
		} else {
			this.rotationPivot = -1
		}
	}

	handleMove(e) {
		//Unsure why, but I need to reset this after each shrink
		this.poster = document.querySelector(".poster")
		if (this.poster.classList.contains("shrunk")) return
		this.touchCurrentX = e.touches[0].clientX
		this.touchCurrentY = e.touches[0].clientY

		this.deltaX = this.touchStartX - this.touchCurrentX
		this.deltaY = this.touchStartY - this.touchCurrentY

		if (this.deltaX * -0.05 > 5) {
			this.poster.dataset.likedStatus = "liked"
		} else if (this.deltaX * -0.05 < -5) {
			this.poster.dataset.likedStatus = "disliked"
		} else {
			this.poster.removeAttribute("data-liked-status")
		}

		this.poster.style.transform = `rotate(${
			this.deltaX * -0.03 * this.rotationPivot
		}deg) translateX(${this.deltaX * -1}px)  translateY(${this.deltaY * -1}px)`
	}

	resetCoordinateTracking() {
		this.touchStartX = undefined
		this.touchStartY = undefined
		this.touchCurrentX = undefined
		this.touchCurrentY = undefined
		this.deltaX = undefined
		this.deltaY = undefined
		this.rotationPivot = undefined
		this.direction = undefined
	}

	instantResetCardCoordinates() {
		this.poster = document.querySelector(".poster")
		if (!this.poster) return
		this.poster.style.transition = ""
		this.poster.style.transform = ""
		this.poster.removeAttribute("data-liked-status")
		this.resetCoordinateTracking()
	}

	smoothResetCardCoordinates() {
		this.poster = document.querySelector(".poster")
		if (!this.poster) return
		this.poster.style.transition = `250ms linear`
		this.poster.style.transform = ""
		this.poster.removeAttribute("data-liked-status")
		setTimeout(() => {
			this.poster.style.transition = "none"
			this.resetCoordinateTracking()
		}, 250)
	}
}

export class Movie {
	constructor(
		id,
		title,
		poster,
		year,
		rating,
		genres,
		runtime,
		synopsis,
		tmdbLink,
		providers
	) {
		this.id = id
		this.title = title
		this.poster = poster
		this.year = year
		this.rating = rating
		this.genres = genres
		this.runtime = runtime
		this.synopsis = synopsis
		this.tmdbLink = tmdbLink
		this.likedStatus = ""
		this.providers = providers
	}
}
