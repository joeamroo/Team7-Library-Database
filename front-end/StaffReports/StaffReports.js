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

const searchForm = document.getElementById('searchForm');
const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
const generateReportButton = document.getElementById('generateReport');
const reportContainer = document.getElementById('reportContainer');
const reportContent = document.getElementById('reportContent');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const queryParams = new URLSearchParams(formData).toString();
    const apiUrl = `/getMemberData?${queryParams}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
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
        })
        .catch(error => console.error(error));
});

generateReportButton.addEventListener('click', () => {
    const formData = new FormData(searchForm);
    const queryParams = new URLSearchParams(formData).toString();
    const apiUrl = `/generateReport?${queryParams}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(reportData => {
            reportContainer.style.display = 'block';
            const reportHTML = `
                <p>Average Fine Amount: $${reportData.averageFine.toFixed(2)}</p>
                <p>Average Holds: ${reportData.averageHolds}</p>
                <!-- Add more report data as needed -->
            `;
            reportContent.innerHTML = reportHTML;
        })
        .catch(error => console.error(error));
});
