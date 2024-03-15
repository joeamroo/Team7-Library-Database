const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const staff = document.getElementById('toggle-switch');
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

function toggleSwitch() {
    if (staff.checked == true) {
        staffCheck.className = "toggle-switch-active";
        //container.classList.add("active");
    } else {
        staffCheck.className = "toggle-switch";
        //container.classList.add("active");
    }
}
    


 