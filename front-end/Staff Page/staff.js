const logOutBtn = document.getElementById('logoutBtn');
const staffId = localStorage.getItem('staffId');

logOutBtn.addEventListener('click', function(event) {
    console.log('logging out');
    localStorage.setItem('loggedIn', false);
    if (staffId !== null && staffId !== undefined) {
        logOutBtn.href = '../Home/home.html';
        localStorage.removeItem('staffId');
    }
});

// Function to fetch notifications from the server
function fetchNotifications() {
    fetch('/getNotifications')
      .then(response => response.json())
      .then(data => {
        const notificationList = document.getElementById('notificationList');
        const notificationCount = document.getElementById('notificationCount');
  
        notificationList.innerHTML = '';
        data.forEach(notification => {
          const listItem = document.createElement('div');
          listItem.textContent = notification.alert_msg;
          notificationList.appendChild(listItem);
        });
  
        notificationCount.textContent = data.length;
        notificationCount.style.display = data.length > 0 ? 'block' : 'none';
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }
  
  // Call fetchNotifications when the page loads
  fetchNotifications();
  
  // Toggle the notification list when the notification button is clicked
  const notificationButton = document.getElementById('notificationButton');
  const notificationList = document.getElementById('notificationList');
  notificationButton.addEventListener('click', function() {
    notificationList.classList.toggle('show');
  });