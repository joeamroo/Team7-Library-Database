const logOutBtn = document.getElementById('logoutBtn');
const staffId = localStorage.getItem('staffId');
 
const filters = {
    name: queryObject.name || '',
    memberId: queryObject.memberId || '',
    hasFine: queryObject.hasFines === 'true',
    noTransactions: queryObject.noTransactions === 'true',
    };


logOutBtn.addEventListener('click', function(event) {
  console.log('logging out');
  localStorage.setItem('loggedIn', false);
  if (staffId !== null && staffId !== undefined) {
    logOutBtn.href = '../Home/home.html';
    localStorage.removeItem('staffId');
  }
});

const searchForm = document.getElementById('searchForm');
const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
const generateReportButton = document.getElementById('generateReport');
const reportContainer = document.getElementById('reportContainer');
const reportContent = document.getElementById('reportContent');
const backendUrl = 'https://cougarchronicles.onrender.com';


searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const queryParams = new URLSearchParams(formData).toString();
  const getMembersUrl = `${backendUrl}/reportmembers?${queryParams}`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', getMembersUrl);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      resultsTable.innerHTML = '';
      data.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${member.member_id}</td>
          <td>${member.name}</td>
          <td>${member.email}</td>
          <td>${member.status}</td>
          <td>${member.mem_type}</td>
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
    } else {
      console.error('Error:', xhr.statusText);
    }
  };
  xhr.onerror = function() {
    console.error('Network error');
  };
  xhr.send();
});

generateReportButton.addEventListener('click', () => {
  const formData = new FormData(searchForm);
  const queryParams = new URLSearchParams(formData).toString();
  const generateReportUrl = `${backendUrl}/reportreports?${queryParams}`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', generateReportUrl);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const reportData = JSON.parse(xhr.responseText);
      reportContainer.style.display = 'block';
      const reportHTML = `
        <p>Average Fine Amount: $${reportData.averageFine.toFixed(2)}</p>
        <p>Average Holds: ${reportData.averageHolds}</p>
      `;
      reportContent.innerHTML = reportHTML;
    } else {
      console.error('Error:', xhr.statusText);
    }
  };
  xhr.onerror = function() {
    console.error('Network error');
  };
  xhr.send();
});