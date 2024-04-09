const loggedIn = localStorage.getItem('loggedIn');
const memberId = localStorage.getItem('memberId');
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

  const backendUrl = 'https://cougarchronicles.onrender.com'; 
  const getUserDashUrl = `${backendUrl}/getDashname`;
  const getUserInfoUrl = `${backendUrl}/getDashInfo`;
  document.addEventListener('DOMContentLoaded', function() {
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUserDashUrl);
    xhr.setRequestHeader('Content-Type', 'text/html');

    xhr.onload = function() {
      if (xhr.status === 200) {
        const greetName = document.querySelector('.user-greet');   
        
        /* Sets the name of the profile information */
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

      // Calls function to load information
      getUserInfo();
  });

  function getUserInfo() {
    // Retrieves user info
    const name = '';
    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const phone_number = document.querySelector("#phone_number");
    const street_addr = document.querySelector("#street_addr");
    const city_addr = document.querySelector("#city_addr");
    const state = document.querySelector("#state");
    const zipcode_addr = document.querySelector("#zipcode_addr");
    const email = document.querySelector("#email");
    const mem_type = document.querySelector("#member-type");
    const status = document.querySelector("#member-status");

    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUserInfoUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      if (xhr.status === 200) {
        // Parses JSON file into individual segments
        const packets = JSON.parse(xhr.responseText);

        // Gets name
        firstName.value = packets.name;
        lastName.value = packets.name;

        // Gets status of membership
        status.value = packets.status;

        // Gets type of membership
        mem_type.value = packets.mem_type;

        // Gets phone number
        phone_number.value = packets.phone_number;

        // Gets street address
        street_addr = packets.street_addr;

        // Gets city address
        city_addr = packets.city_addr;

        // Gets state
        state = packets.state;

        // Gets zipcode
        zipcode_addr = packets.zipcode_addr;

        // Gets email
        email.value = packets.email;
        
      } else {
        console.log("Error retrieving user info");
      }
    };

    xhr.onerror = function() {
      console.error('error', xhr.statusText);
    };


    const data = JSON.stringify({
      memberId: memberId,
      name: name,
      email: email,
      mem_type: mem_type,
      phone_number: phone_number,
      street_addr: street_addr,
      city_addr: city_addr,
      state: state,
      zipcode_addr: zipcode_addr
    });

    xhr.send(data);

    
  }




/* Gets MemberID from local storage and makes it visible on the profile */
window.onload = function() {
  const memberTag = document.getElementById('member-id');
  memberTag.textContent = 'Member ID: ' + memberId;
};
  

      


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