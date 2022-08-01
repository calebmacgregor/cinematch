export class Coordinates {
	constructor() {
		this.touchStartX = undefined
		this.touchStartY = undefined
		this.touchStartTime = undefined
		this.touchCurrentX = undefined
		this.touchCurrentY = undefined
		this.touchCurrentTime = undefined
		this.deltaX = undefined
		this.deltaY = undefined
		this.rotationPivot = undefined
		this.speed = undefined
		this.direction = undefined
	}
}

export class Movie {
	constructor(
		id,
		title,
		poster,
		year,
		rating,
		genre,
		runtime,
		synopsis,
		imdbLink
	) {
		this.id = id
		this.title = title
		this.poster = poster
		this.year = year
		this.rating = rating
		this.genre = genre
		this.runtime = runtime
		this.synopsis = synopsis
		this.imdbLink = imdbLink
		this.likedStatus = ""
	}
}
