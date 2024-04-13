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
    window.location.href = '../Forgot-pwd/forgot-pwd.html'
}



/* Login/Registration to Homepage*/
function homepage() {
    window.location.href = '../Home/home.html';
}

const sendReturnUrl = `${backendUrl}/loginUser`;





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


