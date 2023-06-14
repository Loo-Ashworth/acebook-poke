describe("Timeline", () => {
  it("can see likes count on a new post", () => {
    cy.exec('node seeds/cypress.js')
    // sign up
    cy.visit("/users/new");
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    // sign in
    cy.visit("/sessions/new");
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    // submit a post
    cy.visit("/posts");
    cy.contains("New post").click();

    cy.get("#new-post-form").find('[type="text"]').type("Test like and unlike!");
    cy.get("#new-post-form").submit();

    // Assert we can see the post
    cy.get(".posts").should("contain", "Test like and unlike!");

    // Assert that we can see the likes count
    cy.get(".posts").should("contain", "0 likes");

    // Press the like button
    cy.get(".like-button").eq(0).click({ multiple: true })

    // Check post has 1 like
    cy.get(".posts").should("contain", "1 likes");

    // Unlike post
    cy.get(".like-button").eq(0).click({ multiple: true })

    // Check post has 0 likes
    cy.get(".posts").should("contain", "0 likes");
  });
});