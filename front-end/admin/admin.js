// This is in case a user is already logged in, the button is the correct one

const loggedIn = localStorage.getItem('loggedIn');
const memberId = localStorage.getItem('memberId');
const staffId = localStorage.getItem('staffId');
const isAdmin = localStorage.getItem('isAdmin');
const loginButton = document.getElementById('myAccount');
const logOutBtn = document.getElementById('logoutBtn');

loginButton.addEventListener('click', function(event) {
    console.log('clicking the one button');
    if (loggedIn === 'true') {
        console.log('user is logged in');
        if (loginButton) {
            if(memberId !== null && memberId !== undefined) {
                loginButton.href = '../Dashboard/dashboard.html';
            }
            else if (staffId !== null && staffId !== undefined && isAdmin === 'false') {
                loginButton.href = '../Staff Page/staff.html';
            }
            else if (isAdmin === 'true') {
                loginButton.href = '#';
            } 
        }
    }
});

logOutBtn.addEventListener('click', function(event) {
    console.log('logging out');
    localStorage.setItem('loggedIn', false);
    if (staffId !== null && staffId !== undefined) {
        logOutBtn.href = '../Home/home.html';
        localStorage.removeItem('staffId');
    }
});