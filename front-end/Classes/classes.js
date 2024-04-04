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
        const memberId = 1002001;

        
        if (loginState === 'true') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', signUpEventUrl); 
            xhr.setRequestHeader('Content-Type', 'application/json');

            console.log('signing up for event');
            console.log(eventId, memberId);

            xhr.onload = function() {
                if (xhr.status === 200) {
                    console.log('Successfully added member to event and updated event attendance');
                } 
                else if (xhr.status === 409) {
                    console.log('Member is already registered for event');
                    showToast();
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

function showToast() {
    const toastContainer = document.getElementById('toastContainer');
    toastContainer.innerText = 'You have already signed up for this event';
    toastContainer.style.display = 'block';

    setTimeout(() => {
        toastContainer.style.opacity = '0';
    }, 800);

    setTimeout(() => {
        toastContainer.style.display = 'none';
    }, 8800);
}

