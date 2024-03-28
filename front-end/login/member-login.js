const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
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


function inputValidation() {

    if (firstName.value != "" || lastName.value != ""
        || address.value != "" || city.value != "" 
        || state.value != "" || zipCode.value != ""
        || zipCode.value != "" || email.value != ""
        || password.value != "") {
            shake()
    }

}


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
    window.location.href = '..//Home/home.html';
}
    
// Function for Checklist 3 buttons
function checklist3() {
    var buttonId = event.target.id;
    if (buttonId === 'staff-page-access') {
        window.location = "..//Staff Page/staff.html";
    } else if (buttonId === 'member-page-access') {
        window.location = "..//Dashboard/index.html";
    }
}

// Hash passwords before sending it to the server
function hashPassword(auth) {
    var salt = crypto.randomBytes(128).toString('base64');
    var iterations = 10000;
    var hash = pbkdf2(auth, salt, iterations);

    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    };
}

