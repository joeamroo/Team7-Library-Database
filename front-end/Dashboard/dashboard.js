const loggedIn = localStorage.getItem('loggedIn');
const memberId = localStorage.getItem('memberId');
const loginButton = document.getElementById('myAccount');
const logOutBtn = document.getElementById('logoutBtn');
const updateBtn = document.querySelector(".main-btn");
const profileSelect = document.getElementById('profile-selection');
const orderSelect = document.getElementById('order-selection');
const holdSelect = document.getElementById('hold-selection');
const waitSelect = document.getElementById('waitlist-selection');
const profileView = document.querySelector('.settings.profile');
const orderView = document.querySelector('.settings.orders');
const holdsView = document.querySelector('.settings.holds');
const waitlistView = document.querySelector('.settings.waitlist');
const orderReport = document.querySelector('.recent-orders');
const profileInfo = document.querySelector('.member-info');
const today = new Date().toLocaleDateString();

/* *********************************************** */
/* **************** BACK END ********************* */
/* *********************************************** */

const backendUrl = 'https://cougarchronicles.onrender.com'; 
const getUserDashUrl = `${backendUrl}/getDashname`;
const getUserInfoUrl = `${backendUrl}/getDashInfo`;
const getUserOrderUrl =`${backendUrl}/getDashOrders`;


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



  document.addEventListener('DOMContentLoaded', function() {
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUserDashUrl);
    xhr.setRequestHeader('Content-Type', 'text/html');

    xhr.onload = function() {
      if (xhr.status === 200) {
        const greetName = document.querySelector('.user-greet');   
        
        /* Sets the name of the profile information */
        greetName.innerHTML = xhr.responseText;
        //console.log(greetName);
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

     /* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                       MemberId Retrieval from Storage                       │
  └─────────────────────────────────────────────────────────────────────────────┘
 */


/* Gets MemberID from local storage and makes it visible on the profile */
window.onload = function() {
    const memberTag = document.getElementById('member-id');
    memberTag.textContent = 'Member ID: ' + memberId;
    getUserInfo();
    setOrderDate();
};

    /* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           Updates User Info                                 │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

 

updateBtn.addEventListener('click', function(event) {
  openPop();
});

function closePop() {
  document.querySelector(".popup").style.display = "none";
}
function openPop() {
  document.querySelector(".popup").style.display = "flex";
  console.log('clicked pop');
}


  /* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              User Info (member-id)                          │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

  function getUserInfo() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUserInfoUrl);
    xhr.setRequestHeader('Content-Type', 'text/html');

    xhr.onload = function() {
      if (xhr.status === 200) {
        //const dataRetrieved = xhr.responseText;
        //console.log(dataRetrieved);
        profileInfo.innerHTML = xhr.responseText;
      } else {
        console.log("Failed to retrieve data");
      }
    };

    xhr.onerror = function() {
      console.log('error', xhr.statusText);
    }

    const data = JSON.stringify({
      memberId: memberId
    });

    xhr.send(data);
  }


   /* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              Orders (date form)                             │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

  function setOrderDate() {

    // Get the current date
    const currentDate = new Date();

    // Extract the year, month, and day from the current date
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    const startingDate = document.getElementById('start-date');
    const endingDate = document.getElementById('end-date');
    var sdate = new Date(today).toISOString().slice(0, 10);
    var one_year = new Date(year + 1, month, day)
    var edate = new Date(one_year).toISOString().slice(0, 10);

    // Sets the values of each to today's date by default
    startingDate.value = sdate;
    endingDate.value = edate;
  }


     /* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              Orders Report                                  │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

function getUserOrderReport() {

    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUserOrderUrl);
    xhr.setRequestHeader('Content-Type', 'text/html');

    xhr.onload = function() {
      if (xhr.status === 200) {
        //const dataRetrieved = xhr.responseText;
        //console.log(dataRetrieved);
        orderReport.innerHTML = xhr.responseText;
      } else {
        console.log("Failed to retrieve data");
      }
    };

    xhr.onerror = function() {
      console.log('error', xhr.statusText);
    }

    const data = JSON.stringify({
      memberId: memberId
    });

    xhr.send(data);
}











  

      


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
// Calls function to load information
      getUserInfo();
  */

      /*function getUserInfo() {
    // Retrieves user info
    const name = '';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUserInfoUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      if (xhr.status === 200) {
       
        const packets = JSON.parse(xhr.responseText);
        console.log(packets);

        // User info elements from top of code
        userData.forEach(function(item) {
          // Update the value of each element with the corresponding data from the server
          item.element.textContent = packets[item.key];
        });
      } else {
        console.error('Error fetching user info:', xhr.status);
      }
    };
        

    xhr.onerror = function() {
      console.error('error', xhr.statusText);
    };

    // Sends memberID and server sends back profile info
    xhr.send(JSON.stringify({memberId: memberId}));
  }*/