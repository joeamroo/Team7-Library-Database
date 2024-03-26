const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const staff = document.getElementById('toggle-switch');
const svgIcon = document.querySelector('.arrow');
const ArrowLink = document.getElementById('ArrowLink');
const link = document.createElement('a');
var staffCheck = document.querySelector('.toggle-switch');

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

/* Login/Registration to Homepage*/
function homepage() {
    window.location.href = '../Home/home.html';
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

