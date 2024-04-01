const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signinBtn = document.getElementById('sign-in')
const staff = document.getElementById('toggle-switch');
const svgIcon = document.querySelector('.arrow');
const ArrowLink = document.getElementById('ArrowLink');
const forgot = document.getElementById('forgot-password');
const link = document.createElement('a');
const shakeEvent = document.querySelector('.begin');
var staffCheck = document.querySelector('.toggle-switch');

/* --------------------------------------- */
/* ----- Adds a Sign Up Button ----- */
/* ----- and validates input   ----- */
/* --------------------------------------- */

// Get a reference to the form over which you want to overlay the button
const form = document.querySelector('form');

// Create a button element
const overlayButton = document.createElement('button');

// Set some content for the button
overlayButton.textContent = 'Sign Up';

// Style the button to overlay the form
overlayButton.style.position = 'absolute';
overlayButton.style.top = '93%'; // Adjust as necessary
overlayButton.style.left = '50%'; // Adjust as necessary
overlayButton.style.transform = 'translate(-50%, -50%)';
overlayButton.style.zIndex = '10'; // Ensure it's above other items

// Append the button to the form
form.style.position = 'relative'; // Make sure the form is positioned
form.appendChild(overlayButton);

// Optionally, you could also add an event listener to the button
overlayButton.addEventListener('click', function(event) {
    // Prevent the default form submission if necessary
    event.preventDefault();
    
    const allFieldsFilled = [
        'first_name', 'last_name', 'address', 'city_addr', 
        'state_addr', 'zipcode_addr', 'email', 'password'
    ].every(id => document.getElementById(id).value.trim() !== "");

    allFieldsFilled? register() : shake(600);
});
/* --------------------------------------- */


/* The Register Button on the Gray Area */
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

/* The Login Button on the Gray Area */
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

signinBtn.addEventListener('click', () => {
    loginRequest();
})



/* --------------------------------------- */

svgIcon.addEventListener('click', function() {
    // Moves the arrow key left when clicked
    this.classList.toggle('clicked');
  
    // Adds a timeout function
    setTimeout(() => {
        this.classList.remove('clicked');
    }, 600);

    /* Calls homepage */
    homepage();
});


function toggleSwitch() {
    if (staff.checked == true) {
        staffCheck.className = "toggle-switch-active";
        //container.classList.add("active");
    } else {
        staffCheck.className = "toggle-switch";
        //container.classList.add("active");
    }
}
/* --------------------------------------- */

function shake(time) {

    const shakeEvent = document.querySelector('.begin');
    console.log("shake");

    shakeEvent.classList.add('shake');
  
    setTimeout(() => {
        shakeEvent.classList.remove('shake');
    }, time);
}
/* --------------------------------------- */

function forgotPass() {
    console.log("We ran out of time for this implementation.");
    window.alert("Please contact your nearest librarian for help.");
}



/* Login/Registration to Homepage*/
function homepage() {
    window.location.href = '/';
}


/* --------------------------------------- */
/* ------    Login Section   ------ */
/* --------------------------------------- */

function loginRequest() {
    const username = document.getElementById('member-email').value.trim();
    const password = document.getElementById('member-password').value.trim();

    const data = {
        username: username,
        password: password
    };

    console.log(username);
    console.log(password);

    fetch('https://cougarchronicles.onrender.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Login result:', result);
        // Handle the login response (e.g., redirect to dashboard on success)
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the login error (e.g., display an error message)
    });
}

/*function loginValidation() {
    const allLoginFields = [
        'member-email', 'member-password'
    ].every(id => document.getElementById(id).value.trim() !== "");

    // Makes sure all fields are field; otherwise,
    // the user's form will shake.
    allLoginFields?  loginRequest() : shake(800);
}

function loginRequest() {
    const usertext = document.getElementById('member-email');
    const ciphertext = hashPassword(document.getElementById('member-password').value.trim());
    
    sendRequest(usertext, ciphertext);
    console.log(ciphertext);

}


async function hashPassword(password) {
    // Encode the password as UTF-8
    const msgBuffer = new TextEncoder().encode(password); 

    // Hash the password
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // Convert the ArrayBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashArray;
}*/


/* --------------------------------------- */
/* ------    Register Section   ------ */
/* --------------------------------------- */



function register() {
    const backendUrl = 'https://cougarchronicles.onrender.com/login';

    const registerFields = [
        'first_name', 'last_name', 'address', 'city_addr', 
        'state_addr', 'zipcode_addr', 'email', 'password'
    ].every(id => document.getElementById(id).value.trim() !== "");

    const xhr = new XMLHttpRequest();
        xhr.open('POST', backendUrl);
        xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onerror = function() {
        console.error("Error:", xhr.statusText);
    }

    const data = JSON.stringify({
        first_name: registerFields[0],
        last_name: registerFields[1],
        address: registerFields[2],
        city_addr: registerFields[3],
        state_addr: registerFields[4],
        zipcode_addr: registerFields[5],
        email: registerFields[6],
        password: registerFields[7]
    });

    console.log(data);


    xhr.send(data);
}



/*async function sendRequest(user, pass) {
    try {
        const response = await fetch('https://cougarchronicles.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: "user",
                password: "pass"
            }),
        });

        const data = await response.json();
        console.log('Server response:', data);
    } catch (error) {
        console.error('Error sending password to the server:', error);
    }
}*/

// Function for Checklist 3 buttons
/*function checklist3() {
    var buttonId = event.target.id;
    if (buttonId === 'staff-page-access') {
        window.location = "..//Staff Page/staff.html";
    } else if (buttonId === 'member-page-access') {
        window.location = "..//Dashboard/dashboard.html";
    }
}*/

/*$(document).ready(function() {
    var myObject = {
        rPassword: "username",
        sPassword: "password"
    };

    $.ajax({
        url: 'https://cougarchronicles.onrender.com',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(myObject),
        success: function(response) {
            console.log('Server response:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
});*/

