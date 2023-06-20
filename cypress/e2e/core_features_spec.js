import sitePage, { LoginAs } from "../page_objects/site_page"

before(() => {
sitePage.seed_db();
})

// The Database is Seeded/Dropped as Empty by Default

// When test blocks are separated the session is cleared so you may 
// need to use the LoginAs() method provided to test features
// which are behind signup/login wall.

describe("Test Core Site Feature Functionality", () => {

it('1) Can Access Homepage', () => {
    cy.visit("/");
    cy.get(".title").should("contain", "Acebook");
})

it('2) Can Signup and Signin', () => {
    sitePage.signupAndSignInAs("test@test.com", "testerman", "password123");
    cy.url().should("include", "/posts");
    
})

it('3) Can Make a Post and See It', () => {
    sitePage.LoginAs("test@test.com", "password123")
    sitePage.createPostWith("THIS IS NEWER");
    sitePage.shouldContain(".posts", "THIS IS NEWER")
})

it('4) Can See Likes Counts On Post', () => {
    sitePage.LoginAs("test@test.com", "password123");
    sitePage.createPostWith("THIS IS NEWER");
    sitePage.shouldContain(".posts", "THIS IS NEWER")
    sitePage.likePost(0)
    sitePage.nthShouldContain(".post-likes", 0, "1 likes")
})

it('5) Can See Posts In Reverse Order', () => {
    sitePage.seed_db(); // DB reseeded to ensure posts are clear and not clashing during tests
    sitePage.signupAndSignInAs("test@test.com", "testerman", "password123");
    sitePage.createPostWith("THIS IS OLDER");
    sitePage.shouldContain(".posts", "THIS IS OLDER")
    sitePage.createPostWith("THIS IS NEWER");
    sitePage.shouldContain(".posts", "THIS IS NEWER")
    cy.get('.post-message').then($elements => {
        const textArray = Array.from($elements).map(element => Cypress.$(element).text());
    expect(textArray).to.deep.equal(['THIS IS NEWER', 'THIS IS OLDER']);
    })
})

it('6) Can See Multiple Different Likes Counts On Posts', () => {
    sitePage.seed_db(); // DB reseeded to ensure posts are clear and not clashing during tests
    sitePage.signupAndSignInAs("test@test.com", "testerman", "password123");
    sitePage.createPostWith("THIS IS OLDER");
    sitePage.createPostWith("THIS IS NEWER");
    sitePage.shouldContain(".posts", "THIS IS OLDER")
    sitePage.shouldContain(".posts", "THIS IS NEWER")
    sitePage.likePost(1)
    sitePage.nthShouldContain(".post-likes", 0, "0 likes") // .eq(0) checks first instance of a post on the page
    sitePage.nthShouldContain(".post-likes", 1, "1 likes") // .eq(1) checks second instance of a post on the page
})

it('7) User can like another users post & Likes add up', () => {
    sitePage.seed_db(); // DB reseeded to ensure posts are clear and not clashing during tests
    sitePage.signupAndSignInAs("test1@test.com", "tester1", "password123"); // First test user creation
    sitePage.createPostWith("TEST 1 POST");
    sitePage.likePost(0); // Likes the first visible post on the page
    sitePage.logOut(); // Log out of first account
    sitePage.signupAndSignInAs("test2@test.com", "tester2", "password123"); // Second test user creation
    sitePage.likePost(0);
    sitePage.nthShouldContain(".post-likes", 0, "2 likes");
    sitePage.shouldContain(".liked-by-tooltip", "tester1");
    sitePage.shouldContain(".liked-by-tooltip", "tester2");
})

it('8) User can like and unlike another users post & Likes count updates', () => {
    sitePage.seed_db(); // DB reseeded to ensure posts are clear and not clashing during tests
    sitePage.signupAndSignInAs("test1@test.com", "tester1", "password123"); // First test user creation
    sitePage.createPostWith("TEST 1 POST");
    sitePage.likePost(0); // Likes the first visible post on the page
    sitePage.logOut(); // Log out of first account
    sitePage.signupAndSignInAs("test2@test.com", "tester2", "password123"); // Second test user creation
    sitePage.likePost(0);
    sitePage.nthShouldContain(".post-likes", 0, "2 likes");
    sitePage.shouldContain(".liked-by-tooltip", "tester1");
    sitePage.shouldContain(".liked-by-tooltip", "tester2");
    sitePage.logOut(); // Log out of second account
    sitePage.LoginAs("test1@test.com", "password123"); // Log in as user 1
    sitePage.likePost(0);
    sitePage.nthShouldContain(".post-likes", 0, "1 likes");
    sitePage.shouldContain(".liked-by-tooltip", "tester2");
})

it('9) User can comment on another users post', () => {
    sitePage.seed_db(); // DB reseeded to ensure posts are clear and not clashing during tests
    sitePage.signupAndSignInAs("test1@test.com", "tester1", "password123"); // First test user creation
    sitePage.createPostWith("TEST 1 POST");
    sitePage.logOut(); // Log out of first account
    sitePage.signupAndSignInAs("test2@test.com", "tester2", "password123"); // Second test user creation
    sitePage.makeComment("Nice post");
    sitePage.nthShouldContain("i", 0, "Nice post");
})

it('10) User can comment on their own post', () => {
    sitePage.seed_db(); // DB reseeded to ensure posts are clear and not clashing during tests
    sitePage.signupAndSignInAs("test1@test.com", "tester1", "password123"); // First test user creation
    sitePage.createPostWith("TEST 1 POST");
    sitePage.makeComment("Nice post");
    sitePage.nthShouldContain("i", 0, "Nice post");
})

it('11) User can request a friend and the request can be accepted', () => {
    sitePage.seed_db(); // DB reseeded to ensure posts are clear and not clashing during tests
    sitePage.signupAndSignInAs("test1@test.com", "tester1", "password123"); // First test user creation
    sitePage.createPostWith("TEST 1 POST");
    sitePage.logOut(); // Log out of first account
    sitePage.signupAndSignInAs("test2@test.com", "tester2", "password123"); // Second test user creation
    sitePage.requestFriend(); // Click poke button to request friend
    sitePage.viewFriends(); // Go to friends page
    sitePage.shouldContain(".friendship-requests", "tester1");
    sitePage.logOut(); // Log out of second account
    sitePage.LoginAs("test1@test.com", "password123"); // Log in as first user
    sitePage.viewFriends(); // Go to friends page
    sitePage.shouldContain(".pending-section", "tester2");
    sitePage.acceptFriendRequest(); // Accept friend request
    sitePage.shouldContain(".accepted-friendships", "tester2");
})

it('12) User can request a friend and the request can be rejected', () => {
    sitePage.seed_db(); // DB reseeded to ensure posts are clear and not clashing during tests
    sitePage.signupAndSignInAs("test1@test.com", "tester1", "password123"); // First test user creation
    sitePage.createPostWith("TEST 1 POST");
    sitePage.logOut(); // Log out of first account
    sitePage.signupAndSignInAs("test2@test.com", "tester2", "password123"); // Second test user creation
    sitePage.requestFriend(); // Click poke button to request friend
    sitePage.viewFriends(); // Go to friends page
    sitePage.shouldContain(".friendship-requests", "tester1");
    sitePage.logOut(); // Log out of second account
    sitePage.LoginAs("test1@test.com", "password123"); // Log in as first user
    sitePage.viewFriends(); // Go to friends page
    sitePage.shouldContain(".pending-section", "tester2");
    sitePage.rejectFriendRequest(); // Accept friend request
    sitePage.shouldContain(".accepted-friendships", "");
})

it('13) Post with only a space not allowed', () => {
    sitePage.LoginAs("test1@test.com", "password123")
    sitePage.createPostWith(" ");
    sitePage.shouldContain("#new-post-form", "Error: An error occurred while creating the post.")
})

it('14) Post with oover 500 characters not allowed', () => {
    sitePage.LoginAs("test1@test.com", "password123")
    sitePage.createPostWith("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nibh tellus, finibus ut justo vestibulum, viverra iaculis sem. Vivamus massa ex, sodales vel orci nec, maximus tincidunt mi. Mauris pulvinar dapibus vestibulum. Nunc dignissim sem nec ullamcorper eleifend. Nunc euismod in elit eu lacinia. Sed hendrerit tortor nec iaculis suscipit. In iaculis vel risus id finibus. Cras semper, turpis vitae interdum efficitur, eros odio scelerisque diam, euismod tristique felis quam non elit porta ante.");
    sitePage.shouldContain("#new-post-form", "Error: An error occurred while creating the post.")
})
});
