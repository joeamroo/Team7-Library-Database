const loggedIn = localStorage.getItem('loggedIn');
const memberId = localStorage.getItem('memberId');
console.log(memberId);
const loginButton = document.getElementById('myAccount');
const logOutBtn = document.getElementById('logoutBtn');
const profileSelect = document.getElementById('profile-selection');
const orderSelect = document.getElementById('order-selection');
const holdSelect = document.getElementById('hold-selection');
const waitSelect = document.getElementById('waitlist-selection');
const profileView = document.querySelector('.settings.profile');
const orderView = document.querySelector('.settings.orders');
const holdsView = document.querySelector('.settings.holds');
const waitlistView = document.querySelector('.settings.waitlist');

const backendUrl = 'https://cougarchronicles.onrender.com';



logOutBtn.addEventListener('click', function(event) {
  console.log('logging out');
  localStorage.setItem('loggedIn', false);
  if(memberId !== null && memberId !== undefined) {
    logOutBtn.href = '../Home/home.html';
    localStorage.removeItem('memberId');
  }
});


const container = document.getElementById('container');


/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                            Dropdown List                                │
  └─────────────────────────────────────────────────────────────────────────┘
 */

/*var input = document.querySelector(".input-box");
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
      }*/


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
      window.addEventListener("load", showNotification);
      window.addEventListener("load", showDefaults);


      
      profileSelect.addEventListener('click', () => {
        waitlistView.classList.add('hide');
        orderView.classList.add('hide');
        holdsView.classList.add('hide');
        profileView.classList.remove('hide');
         
      });
      

      orderSelect.addEventListener('click', () => {
        profileView.classList.add('hide');
        holdsView.classList.add('hide');
        waitlistView.classList.add('hide');
        orderView.classList.remove('hide');
      });

      holdSelect.addEventListener('click', () => { 
        profileView.classList.add('hide');
        orderView.classList.add('hide');
        waitlistView.classList.add('hide');
        holdsView.classList.remove('hide');
      });

      waitSelect.addEventListener('click', () => {
        profileView.classList.add('hide');
        orderView.classList.add('hide');
        holdsView.classList.add('hide');
        waitlistView.classList.remove('hide');
      });

      /* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              Greets User                                    │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

 
  const getUserDashUrl = `${backendUrl}/getDashname`;
  document.addEventListener('DOMContentLoaded', function() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUserDashUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');
    const memberId = localStorage.getItem('memberId');

    
    xhr.onload = function() {
      if (xhr.status === 200) {
        const greetName = document.querySelector('.user-greet');
        greetName.innerHTML = xhr.responseText;
        console.log(greetName);
      } else {
        console.log('Error retrieving information');
      }
    };

    xhr.onerror = function() {
      console.error('error', xhr.statusText);
    };

    console.log(memberId);
    const data = JSON.stringify({
      memberId: memberId
    });

    

      xhr.send(data);
  });

      


/* ===================== Notification Ends ===================== */
/*
      Reports:

1. Waitlist (hold request)
	Authors, Genres, Year, Rating, Asset Condition
2. Transactions
	Books, Movies, Devices (for a specific date frame), Asset Condition
3. Returns
      Books, Movies, Devices, Asset Condition, 
4. Events
	Events attended this year, or a specific year

  */