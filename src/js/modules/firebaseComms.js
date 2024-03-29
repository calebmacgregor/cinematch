import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { firebaseConfig } from "./firebaseConfig"
import { getAuth, signInAnonymously, signOut } from "firebase/auth"
import { populateLikedMovies, notifyOfMatch } from "./utils/misc.js"
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
	deleteDoc,
	increment,
	updateDoc,
	arrayUnion,
	onSnapshot
} from "firebase/firestore"

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth()
const db = getFirestore()

export async function createSession(
	movieArray,
	sessionName,
	likeThreshold,
	sessionSize
) {
	//Get the user

	await signInAnonymously(auth)
	const user = auth.currentUser.uid
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
		expiryDate: new Date(new Date().getTime() + 86400000),
		createdBy: user
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
	signInAnonymously(auth)
		.then(() => {})
		.catch((error) => {
			const errorCode = error.code
			const errorMessage = error.message
			console.log(errorCode, errorMessage)
		})

	let sessionQueryResult = await getDoc(doc(db, "sessions", sessionName))
	if (!sessionQueryResult.data()) {
		console.log("Session not found, write error code to handle this")
		return
	} else {
		return sessionQueryResult.data()
	}
}

export async function deleteSession(sessionName) {
	signOut(auth)
	await deleteMovies(sessionName)
	await deleteDoc(doc(db, "sessions", sessionName)).then(() => {
		window.location.href = "../.."
	})
	localStorage.removeItem(`LIKED-${sessionName}`)
}

export async function listenToSession(sessionName, elementState) {
	onSnapshot(doc(db, "sessions", sessionName), (doc) => {
		let arr = []
		arr = doc.data()?.likedMovies

		const stringifiedArray = JSON.stringify(arr)
		const storedDocs = localStorage.getItem(`LIKED-${sessionName}`)

		if (arr) {
			const newMovie = arr[arr.length - 1]

			if (
				doc.data().lastLikedEpoch >
				parseInt(sessionStorage.getItem("matchyJoinEpoch"))
			) {
				notifyOfMatch(newMovie, elementState)
			}

			if (stringifiedArray !== storedDocs || !storedDocs) {
				localStorage.setItem(`LIKED-${sessionName}`, JSON.stringify(arr))
				populateLikedMovies(sessionName)
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

async function deleteMovies(sessionName) {
	const moviesRef = collection(db, "movies")

	const q = query(moviesRef, where("sessionName", "==", sessionName))

	const querySnapshot = await getDocs(q)

	querySnapshot.forEach((movie) => {
		deleteDoc(doc(db, "movies", movie.id))
	})
}
