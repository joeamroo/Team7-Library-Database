// This is in case a user is already logged in, the button is the correct one
const loggedIn = localStorage.getItem('loggedIn');
const memberId = localStorage.getItem('memberId');
const staffId = localStorage.getItem('staffId');
const isAdmin = localStorage.getItem('isAdmin');
const logOutBtn = document.getElementById('logout-selection');
const updateBtn = document.querySelector(".main-btn");
const profileSelect = document.getElementById('profile-selection');
const employeeSelect = document.getElementById('employee-selection');
const eventSelect = document.getElementById('event-selection');
const inboxSelect = document.getElementById('inbox-selection');
const profileView = document.querySelector('.settings.profile');
const employeeView = document.querySelector('.settings.employees');
const eventView = document.querySelector('.settings.event');
const inboxView = document.querySelector('.settings.inbox');
const profileInfo = document.querySelector('.member-info');
const today = new Date().toLocaleDateString();


logOutBtn.addEventListener('click', function(event) {
    console.log('logging out');
    localStorage.setItem('loggedIn', false);
    if (staffId !== null && staffId !== undefined) {
        logOutBtn.href = '../Home/home.html';
        localStorage.removeItem('staffId');
    }
});


const container = document.getElementById('container');



/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                            Dropdown List                                │
  └─────────────────────────────────────────────────────────────────────────┘
 */
/*
var input = document.querySelector(".input-box");
      input.onclick = function () {
        this.classList.toggle("open");
        let list = this.nextElementSibling;
        if (list.style.maxHeight) {
          list.style.maxHeight = null;
          list.style.boxShadow = null;
        } else {
          list.style.maxHeight = list.scrollHeight + "px";
          list.style.boxShadow =
            "0 1px 2px 0 rgba(0, 0, 0, 0.15),0 1px 3px 1px rgba(0, 0, 0, 0.1)";
        }
      };

      var rad = document.querySelectorAll(".radio");
      rad.forEach((item) => {
        item.addEventListener("change", () => {
          input.innerHTML = item.nextElementSibling.innerHTML;
          input.click();
        });
      });

      var label = document.querySelectorAll("label");
      function search(searchin) {
        let searchVal = searchin.value;
        searchVal = searchVal.toUpperCase();
        label.forEach((item) => {
          let checkVal = item.querySelector(".name").innerHTML;
          checkVal = checkVal.toUpperCase();
          if (checkVal.indexOf(searchVal) == -1) {
            item.style.display = "none";
          } else {
            item.style.display = "flex";
          }
          let list = input.nextElementSibling;
          list.style.maxHeight = list.scrollHeight + "px";
        });
      }
*/

/* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                         Notification Settings                               │
  └─────────────────────────────────────────────────────────────────────────────┘
 */


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

function showDefaults() {
    const element = document.querySelector('a#profile-selection.default-click');

     // Simulate a click event
    element.click();
}
                
// Show notification on page load
//window.addEventListener("load", showNotification);
window.addEventListener("load", showDefaults);
    

                
profileSelect.addEventListener('click', () => {
    employeeView.classList.add('hide');
    eventView.classList.add('hide');
    inboxView.classList.add('hide');
    profileView.classList.remove('hide');
});
                

employeeSelect.addEventListener('click', () => {
    profileView.classList.add('hide');
    eventView.classList.add('hide');
    inboxView.classList.add('hide');
    employeeView.classList.remove('hide');
});

eventSelect.addEventListener('click', () => { 
    profileView.classList.add('hide');
    employeeView.classList.add('hide');
    inboxView.classList.add('hide');
    eventView.classList.remove('hide');
});

inboxSelect.addEventListener('click', () => {
    profileView.classList.add('hide');
    employeeView.classList.add('hide');
    eventView.classList.add('hide');
    inboxView.classList.remove('hide');
});

      /* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              Greets User                                    │
  └─────────────────────────────────────────────────────────────────────────────┘

    
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           Updates User Info                                 │
  └─────────────────────────────────────────────────────────────────────────────┘



  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              Orders (date form)                             │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

function setOrderDate() {
    const startingDate = document.getElementById('start-date');
    const endingDate = document.getElementById('end-date');
    var date = new Date(today).toISOString().slice(0, 10);


    // Sets the values of each to today's date by default
    startingDate.value = date;
    endingDate.value = date;

    //console.log('Set date of ', date);
}


/* Gets MemberID from local storage and makes it visible on the profile */
window.onload = function() {
  const memberTag = document.getElementById('member-id');
  memberTag.textContent = 'Member ID: ' + memberId;
  getUserInfo();
  setOrderDate();
};


const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const addEmployeeForm = document.getElementById('addEmployeeForm');
const removeEmployeeBtn = document.getElementById('removeEmployeeBtn');
const removeEmployeeForm = document.getElementById('removeEmployeeForm');

addEmployeeBtn.addEventListener('click', () => {
  toggleForm(addEmployeeBtn, addEmployeeForm);
});

removeEmployeeBtn.addEventListener('click', () => {
  toggleForm(removeEmployeeBtn, removeEmployeeForm);
});

function toggleForm(btn, form) {
  const icon = btn.querySelector('i');

  if (form.style.display === 'none') {
    form.style.display = 'block';
    icon.className = 'uil uil-angle-up';
  } else {
    form.style.display = 'none';
    icon.className = 'uil uil-angle-down';
  }
}