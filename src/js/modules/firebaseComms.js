import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { firebaseConfig } from "./firebaseConfig"
import { notifyOfMatch, populateLikedMovies } from "./misc"
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	getDoc,
	doc,
	setDoc,
	addDoc,
	increment,
	updateDoc,
	arrayUnion,
	onSnapshot
} from "firebase/firestore"
import { getMovieDetail } from "./getMovies"
import { elementState } from "./state"

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

//Set up the db connection
const db = getFirestore()

export async function createSession(
	movieArray,
	sessionName,
	likeThreshold,
	sessionSize
) {
	//Check if the session name has already been taken
	let sessionQueryResult = await getDoc(doc(db, "sessions", sessionName))
	if (sessionQueryResult.data()) {
		return { error: 1, errorMessage: "Name already taken" }
	}

	//If the session hasn't been made, carry on
	//Generate the session document
	const session = {
		movies: movieArray,
		sessionSize: sessionSize,
		likeThreshold: likeThreshold,
		likedMovies: [],
		expiryDate: new Date(new Date().getTime() + 86400000)
	}

	//Create it in Firestore
	await setDoc(doc(db, "sessions", sessionName), session)
	return { error: 0, errorMessage: null }
}

export async function createMovie(movieID, sessionName) {
	await addDoc(collection(db, "movies"), {
		movieID: movieID,
		sessionName: sessionName,
		likedCounter: 1,
		expiryDate: new Date(new Date().getTime() + 86400000)
	})
}

export async function checkIfSessionExists(sessionName) {
	const sessionRef = doc(db, "sessions", sessionName)
	const docSnap = await getDoc(sessionRef)
	if (docSnap.exists()) {
		return true
	} else {
		return false
	}
}

export async function joinSession(sessionName) {
	let sessionQueryResult = await getDoc(doc(db, "sessions", sessionName))
	if (!sessionQueryResult.data()) {
		console.log("Session not found, write error code to handle this")
		return
	} else {
		return sessionQueryResult.data()
	}
}

export async function listenToSession(sessionName, elementState) {
	onSnapshot(doc(db, "sessions", sessionName), (doc) => {
		let arr = []
		arr = doc.data().likedMovies

		//Check if the liked movies array actually exists
		if (arr) {
			//Get the most recently liked movie in the array
			const newMovie = arr[arr.length - 1]

			//Populate the list of liked movies
			const likedMoviesList = document.querySelector(".liked-movies-list")
			//Clear out the rendered list of liked movies
			// likedMoviesList.innerHTML = ""
			if (arr.length > 0) {
				//If the movie was liked after the user joined the session,
				//notify the user
				if (
					doc.data().lastLikedEpoch >
					parseInt(sessionStorage.getItem("matchyJoinEpoch"))
				) {
					notifyOfMatch(newMovie, elementState)
				}
				arr.forEach((movieID) => {
					getMovieDetail(movieID).then((movie) => {
						populateLikedMovies(movie)
					})
				})
			}
		}
	})
}

export async function incrementMovie(movieID, sessionName, likeThreshold) {
	//Query to find out if the movie exists
	let movie = await queryMovie(movieID, sessionName)

	//If the movie doesn't exist, create it
	//Movies are created with a liked counter of 1,
	//so there's no need to increment the counter
	if (!movie) {
		createMovie(movieID, sessionName)
		return
	}

	//If the movie does exist, increment the likedCounter
	await updateDoc(doc(db, "movies", movie.id), {
		likedCounter: increment(1),
		expiryDate: new Date(new Date().getTime() + 86400000)
	})
	//Check whether the movie has reached the like threshold
	likeThresholdCheck(movie, likeThreshold, sessionName)

	return
}

export async function likeThresholdCheck(movie, likeThreshold, sessionName) {
	if (movie.data().likedCounter === likeThreshold - 1) {
		const sessionRef = doc(db, "sessions", sessionName)
		//Add the movie ID to the likedmovies array for the session
		await updateDoc(sessionRef, {
			likedMovies: arrayUnion(movie.data().movieID),
			lastUpdate: new Date()
		})

		//Set the lastLikedEpoch
		//This is used for determining when to show
		//liked movies to newly joined users
		await updateDoc(sessionRef, {
			lastLikedEpoch: new Date().getTime()
		})
	}
}

export async function queryMovie(movieID, sessionName) {
	const q = query(
		collection(db, "movies"),
		where("movieID", "==", movieID),
		where("sessionName", "==", sessionName)
	)

	//Get the results of the query
	const querySnapshot = await getDocs(q)

	//If more than one result is returned, throw an error
	//TODO: Redirect the user or something
	if (querySnapshot.docs.length > 1) {
		console.log("Multiple results returned, something has gone wrong")
		return
	}

	//If only one result is returned, return that doc id
	if (querySnapshot.docs.length === 1) {
		return querySnapshot.docs[0]
	}
}
