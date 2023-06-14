describe("Registration", () => {
  it("A user signs up and is redirected to sign in", () => {
    // sign up
    cy.visit("/users/new");
    cy.get("#email").type("anyone@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("anything");
    cy.get("#submit").click();

    cy.url().should("include", "/sessions/new");
  });
});
