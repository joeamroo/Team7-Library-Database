// Function to handle sign up for event
/*function handleSignupButtonClick() {
    const isLoggedIn = true; // Assuming the user is logged in for demonstration

    if (isLoggedIn) {
         // If logged in, confirm the class sign-up
        if (confirm("Are you sure you want to sign up for this class?")) {
            alert("You are signed up for the class!");
        }
    } 
    else {
        // If not logged in, prompt the user to login
        if (confirm("You need to login to sign up for this class. Do you want to login?")) {
            window.location.href = "../login/member-login.html"; // Redirect to the login page
        }
    }
}

// Add event listeners to all signup buttons
const signupButtons = document.querySelectorAll('.signup-button');
signupButtons.forEach(button => {
    button.addEventListener('click', handleSignupButtonClick);
});*/


// Backend calls
const backendUrl = 'https://cougarchronicles.onrender.com'; 
const getEventsUrl = `${backendUrl}/events`;
const signUpEventUrl = `${backendUrl}/event-signup`;

document.addEventListener('DOMContentLoaded', function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', getEventsUrl);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const activeEventsDiv = document.querySelector('.listed-events');
            activeEventsDiv.innerHTML = xhr.responseText;
        } 
    };
    xhr.send();
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('signup-button')) {
        const eventId = parseInt(event.target.closest('.event-item').querySelector('#eventId').textContent);
        const loginState = localStorage.getItem('loggedIn');
        const memberId = 10021001;
        console.log( loginState, memberId);

        
        if (loginState === 'true') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', signUpEventUrl); 
            xhr.setRequestHeader('Content-Type', 'application/json');

            console.log('signing up for event');

            xhr.onload = function() {
                if (xhr.status === 200) {
                    console.log('Successfully added member to event');
                } 
                else {
                    console.error('Error :', xhr.statusText);
                }
            };

            const data = JSON.stringify({ eventId:eventId, memberId:memberId });
            xhr.send(data);

        }
        else {
            // User is not signed in
            window.location.href = '../login/member-login.html'
        }        
    }
});

