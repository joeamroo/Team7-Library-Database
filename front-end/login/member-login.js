const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const signUpBtn = document.getElementById('sign-up');
const loginBtn = document.getElementById('login');
const staff = document.getElementById('toggle-switch');
const svgIcon = document.querySelector('.arrow');
const ArrowLink = document.getElementById('ArrowLink');
const link = document.createElement('a');
const textboxes = container.querySelectorAll('input[type=""]');
var staffCheck = document.querySelector('.toggle-switch');

// Input Fields
const firstName = document.getElementById('first_name').value.trim();
const lastName = document.getElementById('last_name').value.trim();
const address = document.getElementById('address').value.trim();
const city = document.getElementById('city_addr').value.trim();
const state = document.getElementById('state_addr').value.trim();
const zipCode = document.getElementById('zipcode_addr').value.trim();
const email = document.getElementById('email').value.trim();
const password = document.getElementById('password').value.trim();

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
overlayButton.style.zIndex = '2'; // Ensure it's above other items

// Append the button to the form
form.style.position = 'relative'; // Make sure the form is positioned
form.appendChild(overlayButton);

// Optionally, you could also add an event listener to the button
overlayButton.addEventListener('click', function(event) {
    // Prevent the default form submission if necessary
    event.preventDefault();
    
    // Add logic for what should happen when the button is clicked
let validReg = inputValidation(firstName, lastName, address, city, state,
                                zipCode, email, password);
                                
window.alert(validReg.toString());
});


/* If the register button is clicked, it enables
   the register portion */
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

/* If the login button is clicked, it disables
   the register portion */
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});



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

function inputValidation(a, b, c, d, e, f, g) {
   // makes sure none of them are empty
   if ((a.value.length === 0) || (b.value.length === 0) ||
   (c.value.length === 0) || (d.value.length === 0) ||
   (e.value.length === 0) || (f.value.length === 0) ||
   (g.value.length === 0)) {

        return false;
   } else {
        return true;
   }
}

function toggleSwitch() {
    if (staff.checked == true) {
        staffCheck.className = "toggle-switch-active";
        //container.classList.add("active");
    } else {
        staffCheck.className = "toggle-switch";
        //container.classList.add("active");
    }
}


function shake() {
    // Optionally, remove the class after the animation ends to allow re-triggering
    form.classList.className = "shake";

    setTimeout(() => {
        form.classList.className = "form";
    }, 600);
}



/* Login/Registration to Homepage*/
function homepage() {
    window.location.href = '/';
}
    
// Function for Checklist 3 buttons
function checklist3() {
    var buttonId = event.target.id;
    if (buttonId === 'staff-page-access') {
        window.location = "..//Staff Page/staff.html";
    } else if (buttonId === 'member-page-access') {
        window.location = "..//Dashboard/dashboard.html";
    }
}

// Hash passwords before sending it to the server 
// Registration purposes
function hashPassword(auth) {
    const salt = crypto.randomBytes(128).toString('base64');
    const iterations = 10000;
    const keyLength = 64; 
    const digest = 'sha512';
    const hash = pbkdf2(auth, salt, iterations, keyLength, digest).toString('base64');

    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    };
}

function loginRequest(auth) {
    // Hashes the password inputed by user
    const reqHash = hashPassword(auth);

    // Compares the hash with the one stored in the server

}

