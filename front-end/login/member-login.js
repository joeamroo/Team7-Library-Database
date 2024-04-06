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
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* --------------------------------------- */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* --------------------------------------- */
// Gaby added this, change if needed to fit desired functionality

const backendUrl = 'https://cougarchronicles.onrender.com'; 
const registerUrl = `${backendUrl}/registerMember`;
const logInUrl = `${backendUrl}/logIn`;

//This is for creating a new account
overlayButton.addEventListener('click', function(event) {
    // Prevent the default form submission if necessary
    event.preventDefault();
    
    const allFieldsFilled = [
        'first_name', 'last_name', 
        'state_addr', 'phone_num', 'email', 'password'
    ].every(id => document.getElementById(id).value.trim() !== "");


    if (allFieldsFilled) {
        const fName = document.getElementById('first_name').value.trim();
        const lName = document.getElementById('last_name').value.trim();
        const fullName = fName + ' ' + lName;
        const addr = document.getElementById('address').value.trim();
        const city = document.getElementById('city_addr').value.trim();
        const state = document.getElementById('state_addr').value.trim().toLowerCase();
        const zipcode = document.getElementById('zipcode_addr').value.trim();
        const phoneNum = '+1' + document.getElementById('phone_num').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();


        const allFieldsFilledToRemove = [
            'first_name', 'last_name', 'address', 'city_addr',
            'state_addr', 'zipcode_addr', 'phone_num', 'email', 'password'
        ].forEach(id => {
            const element = document.getElementById(id);
            element.value = "";
        });


        let memType;

        if (state === 'texas') {
            memType = 'InState';
        }
        else {
            memType = 'OutState';
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', registerUrl);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status === 200) {
                showSuccessfulToast();
                console.log('successfully created member');
            } 
            else {
                console.error('Error:', xhr.statusText);
            }
        };

        const data = JSON.stringify({
            fullName: fullName,
            addr: addr,
            city: city,
            state: state,
            zipcode: zipcode,
            phoneNum: phoneNum,
            email: email,
            password: password,
            memType: memType
        });

        xhr.send(data)
    } 
    else {
        shake(600);
    }
        
});

function showSuccessfulToast() {
    let toastContainer = document.getElementById('toastContainer');

    toastContainer.innerText = 'Successfully created account';
    toastContainer.style.display = 'block';
    toastContainer.style.opacity = '1';
  
    setTimeout(() => {
      toastContainer.style.opacity = '0';
    }, 1100);
  
    setTimeout(() => {
      toastContainer.style.display = 'none';
    }, 11000);
}

signinBtn.addEventListener('click', () => {
    event.preventDefault();

    const allFieldsFilled = [
        'member-email', 'member-password'
    ].every(id => document.getElementById(id).value.trim() !== "");

    if (allFieldsFilled) {
        const email = document.getElementById('member-email').value.trim();
        const password = document.getElementById('member-password').value.trim();
        let isStaff;

        if (staff.checked === true) {
            isStaff = true;
        }
        else {
            isStaff = false;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', logInUrl); 
        xhr.setRequestHeader('Content-Type', 'application/json');


        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('successful log in');
                localStorage.setItem('loggedIn', true);
                const responseData = JSON.parse(xhr.responseText);
                
                if ('memberId' in responseData) {
                    const memberId = responseData.memberId;

                    localStorage.removeItem('staffId');
                    localStorage.setItem('memberId', memberId);
                    localStorage.setItem('isAdmin', false);
                    window.location.href = '../Dashboard/dashboard.html';
                }
                else if ('staffId' in responseData) {
                    const staffId = responseData.staffId;
                    const isAdmin = responseData.isAdmin;

                    localStorage.removeItem('memberId');
                    localStorage.setItem('staffId', staffId);
                    localStorage.setItem('isAdmin', isAdmin);

                    if (isAdmin === false) {
                        window.location.href = '../Staff Page/staff.html';
                    }
                    else {
                        window.location.href = '../admin/admin.html';
                    }
                    
                }
            }
            else if (xhr.status === 409) {
                const response = JSON.parse(xhr.responseText);
                showNoLoginToast()
                console.log(response);
            }
            else {
                console.error('Error :', xhr.statusText);
            }
        }

        const data = JSON.stringify({ 
            email: email,
            password: password,
            isStaff: isStaff
        });

        xhr.send(data);
    }
    else {
        console.log('enter soemthing');
    }

});

function showNoLoginToast() {
    let toastContainer = document.getElementById('loginToastContainer');

    toastContainer.innerText = 'User not found';
    toastContainer.style.display = 'block';
    toastContainer.style.opacity = '1';
  
    setTimeout(() => {
      toastContainer.style.opacity = '0';
    }, 1100);
  
    setTimeout(() => {
      toastContainer.style.display = 'none';
    }, 11000);
}


/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* --------------------------------------- */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* --------------------------------------- */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
/* ======================================= */
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
/*signinBtn.addEventListener('click', () => {
    loginValidation();
});*/



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

const sendReturnUrl = `${backendUrl}/loginUser`;

/* --------------------------------------- */
/* ------    Login Section   ------ */
/* --------------------------------------- */




/*function sendRequest() {
  const user = document.getElementById('member-email').value.trim();
  const pass = document.getElementById('member-password').value.trim();
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://cougarchronicles.onrender.com/loginUser', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
  if (xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);
    console.log(response);
    // Process the response data here
    // ...
  } else {
    console.error('Error:', xhr.status);
  }
};

xhr.onerror = function() {
  console.error('Request failed');
};

// Prepare the data to be sent as JSON
const data = JSON.stringify( {
  username: user,
  password: pass
});

console.log(data);

xhr.send(JSON.stringify(data));
}*/





/* --------------------------------------- */
/* ------    Login Section   ------ */
/* --------------------------------------- */

// Makes sure all fields are not empty
/*function loginValidation() { 
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
    const cipher = scramPassword(document.getElementById('member-password').value);
    const ciphertext = String(cipher);
   
    console.log(usertext);
    console.log(ciphertext);
    storeSession(usertext, ciphertext);
    sendRequest(usertext, ciphertext);

}*/
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

/*function storeSession(user, auth) {
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
}*/





// Sends credentials to server
function sendRequest(user, pass) {
    
    const data = {
        username: user,
        password: pass
    }
    
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

    xhr.send(JSON.stringify(data));
}


/* --------------------------------------- */
/* ------    Register Section   ------ */
/* --------------------------------------- */



/*function register() {
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
}*/

/* ==========================================================================
   Section: Notification System
   ========================================================================== */

   /*Better to have it upon successful login or after reaching dashboard */

/*let notification = document.querySelector(".notification");

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
    window.addEventListener("load", showNotification);*/

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

