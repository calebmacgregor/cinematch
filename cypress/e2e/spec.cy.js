describe("Join session", () => {
	it("Opens the home page", () => {
		// cy.viewport("iphone-6")
		cy.visit("http://localhost:1234")
		cy.get("#session-name-input").click().type("Demo")

		cy.get(".join-session-btn").click()
	})

	// it("Finds the input box", () => {
	// })
})
