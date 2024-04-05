const loggedIn = localStorage.getItem('loggedIn');
const memberId = localStorage.getItem('memberId');
const staffId = localStorage.getItem('staffId');
const isAdmin = localStorage.getItem('isAdmin');
const loginButton = document.getElementById('myAccount');

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
                loginButton.href = '../admin/admin.html';
            } 
        }
    }
});

// Backend calls
const backendUrl = 'https://cougarchronicles.onrender.com'; 
const getEventsUrl = `${backendUrl}/events`;
const signUpEventUrl = `${backendUrl}/event-signup`;

document.addEventListener('DOMContentLoaded', function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', getEventsUrl);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const activeEventsDiv = document.querySelector('.listed-events');
            activeEventsDiv.innerHTML = xhr.responseText;
        } 
    };
    xhr.send();
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('signup-button')) {
        const eventId = parseInt(event.target.closest('.event-item').querySelector('#eventId').textContent);
        const loginState = localStorage.getItem('loggedIn');
        const memberId = 1002001;

        
        if (loginState === 'true') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', signUpEventUrl); 
            xhr.setRequestHeader('Content-Type', 'application/json');


            xhr.onload = function() {
                if (xhr.status === 200) {
                    console.log('Successfully added member to event and updated event attendance');
                    showSuccessfulToast(event.target.closest('.event-item'));
                } 
                else if (xhr.status === 409) {
                    console.log('Member is already registered for event');
                    showDenialToast(event.target.closest('.event-item'));
                }
                else {
                    console.error('Error :', xhr.statusText);
                }
            };

            const data = JSON.stringify({ eventId:eventId, memberId:memberId });
            xhr.send(data);

        }
        else {
            // User is not signed in
            window.location.href = '../login/member-login.html'
        }
    }
});

function showDenialToast(eventItemElement) {
    let toastContainer = eventItemElement.querySelector('.toast-container');

    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.classList.add('toast-container');
      eventItemElement.appendChild(toastContainer);
    }
  
    toastContainer.innerText = 'You have already signed up for this event';
    toastContainer.style.display = 'block';
  
    setTimeout(() => {
      toastContainer.style.opacity = '0';
    }, 800);
  
    setTimeout(() => {
      toastContainer.style.display = 'none';
    }, 8800);
}

function showSuccessfulToast(eventItemElement) {
    let toastContainer = eventItemElement.querySelector('.toast-container');

    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.classList.add('toast-container');
      eventItemElement.appendChild(toastContainer);
    }
  
    toastContainer.innerText = 'Successfully registered for event';
    toastContainer.style.display = 'block';
  
    setTimeout(() => {
      toastContainer.style.opacity = '0';
    }, 1100);
  
    setTimeout(() => {
      toastContainer.style.display = 'none';
    }, 11000);
}
