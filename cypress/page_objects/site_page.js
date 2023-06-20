class sitePage {

    elements ={
        postURL : "/posts",
        newPostUrl : "/posts/new",
        signUpURL: "/users/new",
        signInUrl: "/sessions/new",
        friendsUrl: "/friends",

        enterEmail : () => cy.get("#email"),
        enterPassword : () => cy.get("#password"),
        enterUsername : () => cy.get("#username"),
        detailsSubmitButton : () => cy.get("#submit"),
        newPostButton : () => cy.get(".new-post-link"),
        newPostInput : () => cy.get("#message"),
        newPostSubmit : () => cy.get("#new-post-form").submit(),
        newPostForm : () => cy.get("#new-post-form"),
        likeButton : () => cy.get('button[class="like-button"]'),
        numberOfLikes : () => cy.get(".post-likes"),
        logOutButton : () => cy.get("a.nav-link:nth-child(2)"),
        commentInput : () => cy.get('[id="comment"]'),
        commentButton : () => cy.get(".comment-button"),
        pokeButton : () => cy.get('button[class="befriend-button"]'),
        friendsLink : () => cy.get("li.nav-item:nth-child(2)"),
        acceptFriendButton : () => cy.get(".accept-button"),
        rejectFriendButton : () => cy.get(".reject-button")
    }

    seed_db(){
            cy.exec("npm run seed");
    }

    requestFriend(){
        this.elements.pokeButton().click();
    }

    viewFriends(){
        this.elements.friendsLink().click();
    }

    acceptFriendRequest(){
        this.elements.acceptFriendButton().click();
    }

    rejectFriendRequest(){
        this.elements.rejectFriendButton().click();
    }

    makeComment(input){
        this.elements.commentInput().type(input);
        this.elements.commentButton().click();
    }

    shouldContain(element, value){
        cy.get(element).should("contain", value)
    }

    signupAndSignInAs(email, username, password){
        cy.visit(this.elements.signUpURL);
        this.elements.enterEmail().type(email);
        this.elements.enterPassword().type(password);
        this.elements.enterUsername().type(username);
        this.elements.detailsSubmitButton().click();
        this.elements.enterEmail().type(email);
        this.elements.enterPassword().type(password);
        this.elements.detailsSubmitButton().click();
    }
    
    LoginAs(email, password){
        cy.visit(this.elements.signInUrl);
        this.elements.enterEmail().type(email);
        this.elements.enterPassword().type(password);
        this.elements.detailsSubmitButton().click();
    }
    
    createPostWith(input){
        this.elements.newPostButton().click();
        this.elements.newPostInput().type(input);
        this.elements.newPostSubmit();
    }

    likePost(arrayPosition){
        this.elements.likeButton().eq(arrayPosition).click({ multiple: true });
    }

    logOut() {
        this.elements.logOutButton().click();
    }
}
module.exports = new sitePage();
