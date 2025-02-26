export function validateFirstPage(sessionObject) {
	//Clear all validation rules
	const validators = [...document.querySelectorAll(".validator")]
	validators.forEach((validator) => {
		validator.style.visibility = "hidden"
	})

	//Set an optimistic status
	let status = true

	if (!validateName(sessionObject)) status = false
	if (!validateThreshold(sessionObject)) status = false
	if (!validateSize(sessionObject)) status = false

	return status
}

export function validateSecondPage(sessionObject) {
	//Clear all validation rules
	const validators = [...document.querySelectorAll(".validator")]
	validators.forEach((validator) => {
		validator.style.visibility = "hidden"
	})

	//Set an optimistic status
	let status = true

	if (!validateStartYear(sessionObject)) status = false
	if (!validateEndYear(sessionObject)) status = false

	return status
}

export function validateCompleteSession(sessionObject) {
	if (
		//If all required fields exist, submit this.
		validateName(sessionObject) &&
		validateThreshold(sessionObject) &&
		validateSize(sessionObject) &&
		validateStartYear(sessionObject) &&
		validateEndYear(sessionObject) &&
		validateOptionals(sessionObject)
	)
		return true
}

export function validateOptionals(sessionObject) {
	if (sessionObject.providers.length > 0 && sessionObject.country) return true
	else if (sessionObject.providers.length > 0 && !sessionObject.country) {
		document.querySelector("#country option[value=default]").text = "Required"
		return false
	} else if (
		sessionObject.country &&
		(sessionObject.providers.length === 0 || !sessionObject.providers)
	) {
		document.querySelector(".provider-names").innerText = "Required"
		return false
	} else {
		document.querySelector("#country option[value=default]").text = "Optional"
		document.querySelector(".provider-names").innerText = "Optional"
		return true
	}
}

export function validateName(sessionObject) {
	const nameValidation = document.querySelector("#name-validator")
	if (!sessionObject.sessionName) {
		nameValidation.innerText = "Please enter a name"
		nameValidation.style.visibility = "visible"
		return false
	} else {
		nameValidation.style.visibility = "hidden"
		return true
	}
}

export function validateThreshold(sessionObject) {
	const likeThresholdValidator = document.querySelector("#threshold-validator")
	if (sessionObject.likeThreshold < 1 || isNaN(sessionObject.likeThreshold)) {
		likeThresholdValidator.style.visibility = "visible"
		return false
	} else {
		likeThresholdValidator.style.visibility = "hidden"
		return true
	}
}

export function validateSize(sessionObject) {
	const sizeValidator = document.querySelector("#size-validator")
	if (
		sessionObject.sessionSize < 1 ||
		sessionObject.sessionSize > 200 ||
		isNaN(sessionObject.sessionSize)
	) {
		sizeValidator.style.visibility = "visible"
		return false
	} else {
		sizeValidator.style.visibility = "hidden"
		return true
	}
}

export function validateStartYear(sessionObject) {
	const startValidation = document.querySelector("#start-validator")

	if (
		new Date(sessionObject.fromYear) < new Date("1900-01-01") ||
		!Number.parseInt(document.querySelector("#from-date").value)
	) {
		startValidation.style.visibility = "visible"
		return false
	} else {
		startValidation.style.visibility = "hidden"
		return true
	}
}

export function validateEndYear(sessionObject) {
	const endValidation = document.querySelector("#end-validator")

	if (
		new Date(sessionObject.toYear) < new Date(sessionObject.fromYear) ||
		new Date(sessionObject.toYear) < new Date("1900-01-01") ||
		!Number.parseInt(document.querySelector("#to-date").value)
	) {
		endValidation.style.visibility = "visible"
		return false
	} else {
		endValidation.style.visibility = "hidden"
		return true
	}
}
