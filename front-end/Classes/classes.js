// Function to handle the button click event
    function handleSignupButtonClick() {
        const isLoggedIn = false; // Assuming the user is logged in for demonstration

        if (isLoggedIn) {
            // If logged in, confirm the class sign-up
            if (confirm("Are you sure you want to sign up for this class?")) {
                alert("You are signed up for the class!");
            }
        } else {
            // If not logged in, prompt the user to login
            if (confirm("You need to login to sign up for this class. Do you want to login?")) {
                window.location.href = "/front-end/login/member-login.html"; // Redirect to the login page
            }
        }
    }

    // Add event listeners to all signup buttons
    const signupButtons = document.querySelectorAll('.signup-button');
    signupButtons.forEach(button => {
        button.addEventListener('click', handleSignupButtonClick);
    });
