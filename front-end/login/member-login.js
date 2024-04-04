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
overlayButton.style.top = '95%'; // Adjust as necessary
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

/* The Login Button on the White Area */
signinBtn.addEventListener('click', () => {
    loginValidation();
});



/* -----------------------------s---------- */

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
    window.location.href = '../Home/home.html';
}


/* --------------------------------------- */
/* ------    Login Section   ------ */
/* --------------------------------------- */

/*function loginRequest() {
  const username = document.getElementById('member-email').value.trim();
  const password = document.getElementById('member-password').value.trim();

  const data = {
    username: username,
    password: password
  };

  console.log(data);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://cougarchronicles.onrender.com/login', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function() {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      console.log('Login result:', response);
      // Handle the login response (e.g., redirect to dashboard on success)
    } else {
      console.error('Login error:', xhr.status);
      console.error('Login error:', xhr.responseText);
      // Handle the login error (e.g., display an error message)
    }
  };

  xhr.onerror = function() {
    console.error('Request error');
    // Handle the request error (e.g., display an error message)
  };

  xhr.send(JSON.stringify(data));
}*/





/* --------------------------------------- */
/* ------    Login Section   ------ */
/* --------------------------------------- */

// Makes sure all fields are not empty
function loginValidation() { 
    const allLoginFields = [
        'member-email', 'member-password'
    ].every(id => document.getElementById(id).value.trim() !== "");

    // Makes sure all fields are field; otherwise,
    // the user's form will shake.
    allLoginFields?  loginRequest() : shake(800);
}
// Stores email and hashes password
function loginRequest() { 
    const usertext = document.getElementById('member-email').value;
    const ciphertext = scramPassword(document.getElementById('member-password').value);

   // localStorage.setItem("user", usertext);
    //localStorage.setItem("auth", ciphertext);
    //sendRequest(usertext, ciphertext);
    //const item = localStorage.getItem('auth');
   // console.log('item');
    //console.log(ciphertext);
    storeDatabase(usertext, ciphertext);

}
// Hashes password and returns to loginRequest
/*async function hashPassword(password) {
    // Encode the password as UTF-8
    const msgBuffer = new TextEncoder().encode(password); 

    // Hash the password
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // Convert the ArrayBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashBuffer;
}*/

function storeSession(user, auth) {
  localStorage.setItem("user-session", user);
  localStorage.setItem("auth-session", auth);
}

function scramPassword(password) {
  var hash = 0, i, chr;
  if (password.length === 0) return hash;
  for (i = 0; i < password.length; i++) {
    chr = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}


const backendUrl = 'https://cougarchronicles.onrender.com'; 
const sendReturnUrl = `${backendUrl}/loginUser`;


// Sends credentials to server
/*function sendRequest(username, password) {
    
    const data = JSON.stringify( {
        username: username,
        password: password
    });
    
      console.log(data);
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', sendReturnUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log("it worked");

        }
        else {
            console.log('Error returning items:', xhr.statusText);
        }
    }

    xhr.send(data);
}*/


/* --------------------------------------- */
/* ------    Register Section   ------ */
/* --------------------------------------- */



function register() {
    const backendUrl = 'https://cougarchronicles.onrender.com/loginUser';

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

/* ==========================================================================
   Section: Notification System
   ========================================================================== */

let notification = document.querySelector(".notification");

      function showNotification() {
        if (notification.classList.contains("hidden")) {
          notification.classList.toggle("hidden");
        }
        notification.classList.toggle("active");
        const timeout = setTimeout(() => {
          if (
            notification.classList.contains("active") &&
            !notification.classList.contains("hidden")
          ) {
            notification.classList.toggle("active");
            notification.classList.toggle("hidden");
          } else {
            window.clearTimeout(timeout);
          }
        }, 5000);
      }
    
      function closeNote() {
        notification.classList.toggle("active");
        notification.classList.toggle("hidden");
      }

    
      // Show notification on page load
      window.addEventListener("load", showNotification);

/* ===================== Notification Ends ===================== */

/*async function sendRequest(user, pass) {
    try {
        const response = await fetch('https://cougarchronicles.onrender.com/loginUser', {
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


function storeDatabase(user, pass) {
  localStorage.setItem('user_session', user);
  localStorage.setItem('auth_session', pass);
  console.log('Data', pass);
}