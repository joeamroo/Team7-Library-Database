const logOutBtn = document.getElementById('logoutBtn');
const staffId = localStorage.getItem('staffId');
const backButton = document.getElementById('backButton');

const reportBackButton = document.getElementById('reportBackButton');
const resultsBackButton = document.getElementById('resultsBackButton');

reportBackButton.addEventListener('click', () => {
  searchForm.style.display = 'block';
  reportContainer.style.display = 'none';
});

resultsBackButton.addEventListener('click', () => {
  searchForm.style.display = 'block';
  resultsContainer.style.display = 'none';
});
 

logOutBtn.addEventListener('click', function(event) {
  console.log('logging out');
  localStorage.setItem('loggedIn', false);
  if (staffId !== null && staffId !== undefined) {
    logOutBtn.href = '../Home/home.html';
    localStorage.removeItem('staffId');
  }
});

const backendUrl = 'https://cougarchronicles.onrender.com'; 
const searchForm = document.getElementById('searchForm');
const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
const generateReportButton = document.getElementById('generateReport');
const reportContainer = document.getElementById('reportContainer');
const reportContent = document.getElementById('reportContent');
const chartContainer = document.getElementById('chartContainer');


searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const queryParams = new URLSearchParams(formData).toString();
    const getMembersUrl = `${backendUrl}/reportmembers?${queryParams}`;
  
    const xhr = new XMLHttpRequest();
    xhr.open('GET', getMembersUrl);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resultsTable.innerHTML = '';
        data.forEach(member => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${member.member_id}</td>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone_number}</td>
            <td>${member.street_addr}, ${member.city_addr}, ${member.state} ${member.zipcode_addr}</td>
            <td>${member.fine}</td>
            <td>${member.transaction_id || '-'}</td>
            <td>${member.date_created || '-'}</td>
            <td>${member.due_date || '-'}</td>
            <td>${member.return_date || '-'}</td>
          `;
          resultsTable.appendChild(row);
        });
        resultsContainer.style.display = 'block';
      } else {
        console.error('Error:', xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error('Network error');
    };
    xhr.send();
  });
  
  generateReportButton.addEventListener('click', () => {
    const formData = new FormData(searchForm);
    const queryParams = new URLSearchParams(formData).toString();
    const generateReportUrl = `${backendUrl}/generateReport?${queryParams}`;
  
    const xhr = new XMLHttpRequest();
    xhr.open('GET', generateReportUrl);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const reportData = JSON.parse(xhr.responseText);
        reportContainer.style.display = 'block';
        searchForm.style.display = 'none';
        const reportHTML = `
          <p>Average Fine Amount: $${reportData.averageFine.toFixed(2)}</p>
          <p>Average Holds: ${reportData.averageHolds}</p>
        `;
        reportContent.innerHTML = reportHTML;
  
        // Populate chart data
        const chartData = {
          labels: reportData.memberData.map(member => member.member_id),
          datasets: [
            {
              label: 'Fine',
              data: reportData.memberData.map(member => member.fine),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Holds',
              data: reportData.memberData.map(member => member.holds),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Average Fine',
              data: reportData.memberData.map(() => reportData.averageFine),
              type: 'line',
              borderColor: 'rgba(255, 99, 132, 0.8)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'Average Holds',
              data: reportData.memberData.map(() => reportData.averageHolds),
              type: 'line',
              borderColor: 'rgba(54, 162, 235, 0.8)',
              borderWidth: 2,
              fill: false,
            },
          ],
        };
  
        // Create chart
        const ctx = document.getElementById('reportChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: chartData,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
  
        chartContainer.style.display = 'block';
      } else {
        console.error('Error:', xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error('Network error');
    };
    xhr.send();
  });
  
  