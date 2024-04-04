document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('loggedIn') === null) {
        localStorage.setItem('loggedIn', false);
    }
});


