export function setMovie(movie, type) {
	//Set all the details
	if (type == "secondary") {
		let nextPoster = document.querySelector(".next-poster")
		try {
			nextPoster.src = movie.poster
		} catch {
			console.log("No movie provided")
		}
	} else {
		let poster = document.querySelector(".poster")
		let title = document.querySelector(".title")
		let year = document.querySelector(".year")
		let rating = document.querySelector(".rating")
		let runtime = document.querySelector(".runtime")
		let synopsis = document.querySelector(".synopsis")
		let tmdbLink = document.querySelector(".tmdb")

		title.innerText = movie.title
		year.innerText = movie.year
		rating.innerText = movie.rating
		runtime.innerText = `${movie.runtime} minutes`
		synopsis.innerText = movie.synopsis
		tmdbLink.href = movie.tmdbLink ? movie.tmdbLink : ""
		poster.src = movie.poster
		poster.alt = movie.title
		poster.dataset.id = movie.id
		poster.style.display = "block"

		const providersArray = movie.providers?.split("|")
		const providersContainer = document.querySelector("#providers")
		providersContainer.innerHTML = ""
		providersArray.forEach((provider) => {
			const elem = document.createElement("li")
			elem.classList = "provider"
			elem.style.backgroundImage = `url(${provider})`

			providersContainer.appendChild(elem)
		})

		const genresArray = movie.genres.split("|")
		const genresContainer = document.querySelector(".genres")
		genresContainer.innerHTML = ""
		genresArray.forEach((genre) => {
			const elem = document.createElement("li")
			elem.classList = "genre"
			elem.innerText = genre

			genresContainer.appendChild(elem)
		})
	}

	return movie
}
