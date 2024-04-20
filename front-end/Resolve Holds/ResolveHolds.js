// Function to fetch holds from the server and populate the hold list
function fetchHolds() {
    fetch('/getHolds')
      .then(response => response.json())
      .then(data => {
        const holdList = document.getElementById('holdList');
  
        holdList.innerHTML = '';
        data.forEach(hold => {
          const option = document.createElement('option');
          option.value = hold.alert_id;
          option.textContent = hold.alert_msg;
          holdList.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error fetching holds:', error);
      });
  }
  
  // Call fetchHolds when the page loads
  fetchHolds();
  
  // Handle the form submission for resolving a hold
  const resolveHoldForm = document.querySelector('#tab1 form');
  const resolveHoldMessage = document.getElementById('resolveHoldMessage');
  resolveHoldForm.addEventListener('submit', function(event) {
    event.preventDefault();
  
    const selectedHoldId = document.getElementById('holdList').value;
  
    fetch('/resolveHold', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alertId: selectedHoldId }),
    })
      .then(response => response.json())
      .then(data => {
        resolveHoldMessage.textContent = data.message;
        fetchHolds();
      })
      .catch(error => {
        console.error('Error resolving hold:', error);
        resolveHoldMessage.textContent = 'Error resolving hold. Please try again.';
      });
  });
  
  // Function to fetch high-demand items from the server and create a chart
  function fetchHighDemandItems() {
    fetch('/getHighDemandItems')
      .then(response => response.json())
      .then(data => {
        const ctx = document.getElementById('highDemandItemsChart').getContext('2d');
  
        // Extract item names and hold counts from the fetched data
        const itemNames = data.map(item => `${item.item_type}: ${item.item_name}`);
        const holdCounts = data.map(item => item.current_holds);
  
        // Create a new chart using Chart.js
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: itemNames,
            datasets: [{
              label: 'Hold Count',
              data: holdCounts,
              backgroundColor: 'rgba(132, 23, 23, 0.8)',
              borderColor: 'rgba(132, 23, 23, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                stepSize: 1
              }
            },
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'High Demand Items'
              }
            }
          }
        });
      })
      .catch(error => {
        console.error('Error fetching high-demand items:', error);
      });
  }
  
  // Call fetchHighDemandItems when the "High Demand Items" tab is clicked
  document.getElementById('HighDemandButton').addEventListener('click', function() {
    document.getElementById('tab1').style.display = 'none';
    document.getElementById('tab2').style.display = 'block';
    fetchHighDemandItems();
  });
  
  // Show the "Resolve Hold" tab when the "Resolve Hold" button is clicked
  document.getElementById('ResolveHoldButton').addEventListener('click', function() {
    document.getElementById('tab1').style.display = 'block';
    document.getElementById('tab2').style.display = 'none';
  });