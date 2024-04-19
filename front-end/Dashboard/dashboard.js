const loggedIn = localStorage.getItem('loggedIn');
const memberId = localStorage.getItem('memberId');
const loginButton = document.getElementById('myAccount');
const logOutBtn = document.getElementById('logoutBtn');
const updateBtn = document.querySelector(".main-btn");
const bookLabel = document.querySelector(".book-selection");
const movieLabel = document.querySelector (".movie-selection");
const deviceLabel = document.querySelector(".device-selection");
const sendPop = document.querySelector('#submitProfileInfo');
const profileSelect = document.getElementById('profile-selection');
const orderSelect = document.getElementById('order-selection');
const holdSelect = document.getElementById('hold-selection');
const eventSelect = document.getElementById('event-selection');
const fineSelect = document.getElementById('fine-selection');
const profileView = document.querySelector('.settings.profile');
const orderView = document.querySelector('.settings.orders');
const holdsView = document.querySelector('.settings.holds');
const eventsView = document.querySelector('.settings.events');
const fineView = document.querySelector('.settings.fines');
const orderReport = document.querySelector('.recent-orders');
const eventReport = document.querySelector('.settings.events');
const profileInfo = document.querySelector('.member-info');
const today = new Date().toLocaleDateString();
const notify = document.querySelector('#notify-user');

/* *********************************************** */
/* **************** BACK END ********************* */
/* *********************************************** */

const backendUrl = 'https://cougarchronicles.onrender.com'; 
const getUserDashUrl = `${backendUrl}/getDashname`;
const getUserInfoUrl = `${backendUrl}/getDashInfo`;
const getUserHoldUrl = `${backendUrl}/getUserHolds`;
const setUserInfoUrl =`${backendUrl}/setDashInfo`;
const getUserOrderUrl =`${backendUrl}/getDashOrders`;
const getUserEventsUrl =`${backendUrl}/getDashEvents`;



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

      // Selects item and reverts dropdown to 
      // original form
      
      bookLabel.addEventListener('click', () => {
        var book_input = '<div class="order-choice">';
        book_input += '<span class="material-icons-outlined"> auto_stories </span>';
        book_input += '<span class="book-label" id="choice">Book</span>';
        book_input += '</div>';
        input.innerHTML = book_input;
        input.click();
      });

      movieLabel.addEventListener('click', () => {
        var movie_input = '<div class="order-choice">';
        movie_input += '<span class="material-icons-outlined"> movie </span>';
        movie_input += '<span class="movie-label" id="choice">Movie</span>';
        movie_input += '</div>';
        input.innerHTML = movie_input;
        input.click();
      });

      deviceLabel.addEventListener('click', () => {
        var movie_input = '<div class="order-choice">';
        movie_input += '<span class="material-icons-outlined"> devices </span>';
        movie_input += '<span class="device-label" id="choice">Device</span>';
        movie_input += '</div>';
        input.innerHTML = movie_input;
        input.click();
      });


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


      /* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                              Canvas View                                    │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

      
      profileSelect.addEventListener('click', () => {
        eventsView.classList.add('hide');
        orderView.classList.add('hide');
        holdsView.classList.add('hide');
        fineView.classList.add('hide');
        profileView.classList.remove('hide');
      });
      

      orderSelect.addEventListener('click', () => {
        profileView.classList.add('hide');
        holdsView.classList.add('hide');
        eventsView.classList.add('hide');
        fineView.classList.add('hide');
        orderView.classList.remove('hide');
      });

      holdSelect.addEventListener('click', () => { 
        profileView.classList.add('hide');
        orderView.classList.add('hide');
        eventsView.classList.add('hide');
        fineView.classList.add('hide');
        holdsView.classList.remove('hide');
      });

      eventSelect.addEventListener('click', () => {
        profileView.classList.add('hide');
        orderView.classList.add('hide');
        holdsView.classList.add('hide');
        fineView.classList.add('hide');
        eventsView.classList.remove('hide');
      });

      fineSelect.addEventListener('click', () => {
        profileView.classList.add('hide');
        orderView.classList.add('hide');
        holdsView.classList.add('hide');
        eventsView.classList.add('hide');
        fineView.classList.remove('hide');
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


    const allFieldsFilled = [
      'firstName', 'lastName', 'phone_number', 'street_addr', 'city_addr',
      'state', 'zipcode_addr', 'email'
  ].every(id => document.getElementById(id).value.trim() !== "");

  //console.log(allFieldsFilled);

  if (!allFieldsFilled) {
  

    // Prevents dialogue from showing
    closePop();

    setTimeout(() => {
      // Sends notification to use that they must fill out form entirely!
       notify.textContent = 'You must fill out all sections to proceed!';
       showNotification();
    }, 900);
  
  } else {
        setProfileInfo();
  }
    
});

function closePop() {
  document.querySelector(".popup").style.display = "none";
}
function openPop() {
  document.querySelector(".popup").style.display = "flex";
}

sendPop.addEventListener('click', function(event) {
  setProfileInfo();
  closePop();
});
ß

function setProfileInfo() {
  
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const phone_number = document.getElementById('phone_number').value;
  const street_addr = document.getElementById('street_addr').value;
  const city_addr = document.getElementById('city_addr').value;
  const state = document.getElementById('state').value;
  const zipcode_addr = document.getElementById('zipcode_addr').value;
  const email = document.getElementById('email').value;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', setUserInfoUrl);
  xhr.setRequestHeader('Content-Type', 'text/html');

  xhr.onload = function() {
    if (xhr.status === 200) {
      //const dataRetrieved = xhr.responseText;
      //console.log(dataRetrieved);
      notify.innerHTML = xhr.responseText;
      showNotification();
    } else {
      notify.innerHTML = "Failed: Please contact a librarian for help!";
      showNotification();
    }
  };

  xhr.onerror = function() {
    console.log('error', xhr.statusText);
  }

  const data = JSON.stringify({
    memberId: memberId,
    firstName: firstName,
    lastName: lastName,
    phone_number: phone_number,
    street_addr: street_addr,
    city_addr: city_addr,
    state: state,
    zipcode_addr: zipcode_addr,
    email: email
  });
  

  xhr.send(data);
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

    const itemValue = '';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUserOrderUrl);
    xhr.setRequestHeader('Content-Type', 'text/html');

    xhr.onload = function() {
      if (xhr.status === 200) {
        orderReport.innerHTML = '  <div class="order-title">Recent Orders</div>';
        orderReport.innerHTML += xhr.responseText;
        //const orderRetrieval = xhr.responseText;
       // orderReport.innerHTML = filterOrderTable(orderRetrieval);
        
        
      } else {
        console.log("Failed to retrieve data");
      }
    };

    xhr.onerror = function() {
      console.error('error', xhr.statusText);
    };

    //console.log(memberId);

    const data = JSON.stringify({
      memberId: memberId
    });


    xhr.send(data);
}

     /* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                               Holds Report                                  │
  └─────────────────────────────────────────────────────────────────────────────┘
 */
  function getUserHoldsReport() {

    const itemValue = '';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUserHoldUrl);
    xhr.setRequestHeader('Content-Type', 'text/html');

    xhr.onload = function() {
      if (xhr.status === 200) {
        //const retrieved = xhr.responseText;
        //console.log(retrieved);
        holdsView.innerHTML(' <div class="holds-title">Outstanding Holds</span>');
        holdsView.innerHTML += xhr.responseText;
    
        
        
      } else {
        console.log("Failed to retrieve data");
      }
    };

    xhr.onerror = function() {
      console.error('error', xhr.statusText);
    };

    //console.log(memberId);

    const data = JSON.stringify({
      memberId: memberId
    });


    xhr.send(data);
}




     /* 
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                               Events Report                                 │
  └─────────────────────────────────────────────────────────────────────────────┘
 */

  function getUserEventsReport() {

    const itemValue = '';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', getUserEventsUrl);
    xhr.setRequestHeader('Content-Type', 'text/html');

    xhr.onload = function() {
      if (xhr.status === 200) {
        //const retrieved = xhr.responseText;
        //console.log(retrieved);
        eventsView.innerHTML = '<div class="event-title">Your Events</span>';
        eventsView.innerHTML += xhr.responseText;
    
        
        
      } else {
        console.log("Failed to retrieve data");
      }
    };

    xhr.onerror = function() {
      console.error('error', xhr.statusText);
    };

    //console.log(memberId);

    const data = JSON.stringify({
      memberId: memberId
    });


    xhr.send(data);
}




function filterOrderTable(tableHTML) {

  // Create a temporary element to hold the table HTML
  const tempElement = document.createElement('div');
  tempElement.innerHTML = tableHTML;

  // Select the table element from the temporary element
  const table = tempElement.querySelector('table');

  // Select all the table rows
  const rows = table.getElementsByTagName('tr');

  // Loop through each row
  for (let i = 0; i < rows.length; i++) {
    // Select all the cells in the current row
    const cells = rows[i].getElementsByTagName('td');
  
  // Loop through each cell in the row
  for (let j = 0; j < cells.length; j++) {
    // Check for all items with NULL values
    if (cells[j].id === 'item' && cells[j] === 'NULL') {
      if(cells[j].value === 'book') {
        // handler
      }
    } 
  }
}

} // filterOrderTable (ends)








        /*// Text inside form (prompt)
    const notice = document.querySelector('#profile-flag');

    // Title of Form
    const submitTitle = document.querySelector('#submitTitle');

    // Submit button
    const submitButton = document.querySelector('#submitProfileInfo');

    // Close button
    const closePrompt = document.querySelector('#closeProfilePrompt');
  */

     /* submitTitle.textContent = 'WARNING';
    notice.textContent = 'Make sure all sections are filled out before submitting!';
    submitButton.disabled = true;


  
    setTimeout(() => {
      // Simulate close click
    closePrompt.click();
      // Reverts text
      submitTitle.textContent = 'Submit Details';
      notice.textContent = 'Are you sure you want to submit the details? You can later edit them' +
      'in details section';
      // Enables button again
      submitButton.disabled = false;
    }, 1100);
    */

      


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



  //Pay fine functionality (Gaby)

  const updateMemberFineUrl = `${backendUrl}/updMemberFine`;
  const getFineUrl = `${backendUrl}/getFineAmount`;

  function getFine() {
    const memberId = localStorage.getItem('memberId');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', getFineUrl);

    xhr.onload = function() {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        const fine_amount = responseData.gotFine;

        document.getElementById('amount').textContent = '$' + fine_amount;
      } 
      else {
        console.error('Error:', xhr.statusText);
      }
    };

    const data = JSON.stringify({ memberId });

    xhr.send(data);
  }

  document.addEventListener('DOMContentLoaded', function() {
    const memberId = localStorage.getItem('memberId');
    if (memberId !== null && memberId !== undefined) {
      getFine();
      console.log('entering this section');
      setInterval(getFine, 30000);
    }
    else {
      console.log('no user so no fine');
    }
  });

  document.getElementById('payFineBtn').addEventListener('click', function(event) {
    event.preventDefault();
    
    const allFieldsFilled = [
      'first-name', 'last-name', 'card-number', 'cvv', 'exp-date'
    ].every(id => document.getElementById(id).value.trim() !== "");

    if (allFieldsFilled) {
      const memberId = localStorage.getItem('memberId');
        
      const xhr = new XMLHttpRequest();
      xhr.open('POST', updateMemberFineUrl); 
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = function() {
        if (xhr.status === 200) {
          getFine();
          document.getElementById('first-name').value = '';
          document.getElementById('last-name').value = '';
          document.getElementById('card-number').value = '';
          document.getElementById('cvv').value = '';
          document.getElementById('exp-date').value = '';
        }
        else {
          console.error('Error:', xhr.statusText);
        }
      };

      const data = JSON.stringify({ memberId });
      
      xhr.send(data);  
    }
    else {
      const submitBtn = document.getElementById('payFineBtn');
      submitBtn.classList.add('shake-button');

      setTimeout(() => {
        submitBtn.classList.remove('shake-button');
      }, 500);
    }
  });