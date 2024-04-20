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
    getAdminInfo();
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


document.getElementById('employeeConnection').addEventListener('click', () => {
    profileView.classList.add('hide');
    eventView.classList.add('hide');
    inboxView.classList.add('hide');
    employeeView.classList.remove('hide');
});

document.getElementById('eventsConnection').addEventListener('click', () => {
    profileView.classList.add('hide');
    employeeView.classList.add('hide');
    inboxView.classList.add('hide');
    eventView.classList.remove('hide');
});

document.getElementById('inventoryConnection').addEventListener('click', () => {
    profileView.classList.add('hide');
    employeeView.classList.add('hide');
    eventView.classList.add('hide');
    inboxView.classList.remove('hide');
});



function setOrderDate() {
    const startingDate = document.getElementById('start-date');
    const endingDate = document.getElementById('end-date');
    var date = new Date(today).toISOString().slice(0, 10);


    // Sets the values of each to today's date by default
    startingDate.value = date;
    endingDate.value = date;

    //console.log('Set date of ', date);
}




//Calling all the staff 
const backendUrl = 'https://cougarchronicles.onrender.com'; 
const getEmployeesUrl = `${backendUrl}/getEmployees`;
const addEmployeeUrl = `${backendUrl}/addStaff`;
const removeEmployeeUrl = `${backendUrl}/removeStaff`;
const filterEmployeesUrl = `${backendUrl}/filterStaff`;
const getAdminInfosUrl = `${backendUrl}/adminInfo`;
const updateEmployeeRoleUrl = `${backendUrl}/updStaffRole`;


/* Get Member Info for Dashboard */
function getAdminInfo() {
    const adminId = document.getElementById('adminId');
    const staffId = localStorage.getItem('staffId');
    adminId.textContent =  staffId;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', getAdminInfosUrl);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const resultData = JSON.parse(xhr.responseText);
            document.getElementById('admin-name').textContent = resultData.adminInfo.adminName + '!';
            document.getElementById('totalEmplyIntro').textContent = resultData.adminInfo.staffCount;
            document.getElementById('totalEventIntro').textContent = resultData.adminInfo.eventCount;
            document.getElementById('totalItemIntro').textContent = resultData.adminInfo.itemCount;           
        } 
        else {
            console.error('Error:', xhr.statusText);
        }
    };

    const data = JSON.stringify({ staffId: staffId });
    xhr.send(data);
}

document.addEventListener('DOMContentLoaded', function() { 
    const staffId = localStorage.getItem('staffId');
    if (staffId !== null && staffId !== undefined) {
        getAdminInfo();
    }
});



/*Manage Employees Tab*/
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const addEmployeeForm = document.getElementById('addEmployeeForm');
const removeEmployeeBtn = document.getElementById('removeEmployeeBtn');
const removeEmployeeForm = document.getElementById('removeEmployeeForm');
const updEmployeeBtn = document.getElementById('updEmployeeBtn');
const updEmployeeForm = document.getElementById('updEmployeeForm');

addEmployeeBtn.addEventListener('click', () => {
  toggleForm(addEmployeeBtn, addEmployeeForm);
  hideFormIfOpen(removeEmployeeForm);
  hideFormIfOpen(updEmployeeForm);
});

removeEmployeeBtn.addEventListener('click', () => {
  toggleForm(removeEmployeeBtn, removeEmployeeForm);
  hideFormIfOpen(addEmployeeForm);
  hideFormIfOpen(updEmployeeForm);
});

updEmployeeBtn.addEventListener('click', () => {
    toggleForm(updEmployeeBtn, updEmployeeForm);
    hideFormIfOpen(addEmployeeForm);
    hideFormIfOpen(removeEmployeeForm);
});

function toggleForm(btn, form) {
  const icon = btn.querySelector('i');

  if (form.style.display === 'none') {
    form.style.display = 'block';
    icon.className = 'uil uil-angle-up';
  } 
  else {
    form.style.display = 'none';
    icon.className = 'uil uil-angle-down';
  }
}

function hideFormIfOpen(form, btn) {
    if (form.style.display === 'block') {
        form.style.display = 'none';
    }
}

function getEmployeeList() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', getEmployeesUrl);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const employeesDiv = document.querySelector('.table-content');
            employeesDiv.innerHTML = xhr.responseText;
            updateTotalEmployeesCount(); 

            const empRoles = getEmployeeRoles(); 
            populateSupervisorDropdown(empRoles);
            populateSupervisorForUpdate(empRoles);
            
            const empIds = getEmployeesIds();
            populateEmpIdsDropdown(empIds);

            const updEmpIds = getUpdateEmployeesIds();
            populateEmpIdForUpdate(updEmpIds);

            const empEmails = getEmployeesEmail();
            populateEmpEmailsDropdown(empEmails)
        } 
    };
    xhr.send();
}

function getEmployeeRoles() {
    const table = document.getElementById('employeeTable');
    const rows = table.getElementsByClassName('employee-item');
    const employeeRoles = [];

    for (const row of rows) {
        const empRole = row.getElementsByClassName('staff_position')[0].textContent;
        const empName = row.getElementsByClassName('staff_name')[0].textContent;
        const empStatus = row.getElementsByClassName('staff_empl_status')[0].textContent;
        if ((empRole === 'Admin' || empRole === 'Librarian') && empStatus === 'Active') {
            employeeRoles.push(empName);
        }
    }
    return employeeRoles;
}

function populateSupervisorDropdown(employeeRoles) {
    const dropdown = document.getElementById('employeeSupervisor');

    while (dropdown.options.length > 2) {
        dropdown.remove(2);
    }

    employeeRoles.forEach(empRole => {
        const option = document.createElement('option');
        option.value = empRole;
        option.textContent = empRole;
        dropdown.appendChild(option);
    });
}

function populateSupervisorForUpdate(employeeRoles) {
    const dropdown = document.getElementById('updEmployeeSupervisor');

    while (dropdown.options.length > 2) {
        dropdown.remove(2);
    }

    employeeRoles.forEach(empRole => {
        const option = document.createElement('option');
        option.value = empRole;
        option.textContent = empRole;
        dropdown.appendChild(option);
    });
}

function getEmployeesIds() {
    const table = document.getElementById('employeeTable');
    const rows = table.getElementsByClassName('employee-item');
    const empIds = [];

    for (const row of rows) {
        const empId = row.getElementsByClassName('staff_id')[0].textContent;
        empIds.push(empId);
    }
    return empIds;
}

function populateEmpIdsDropdown(empIds) {
    const dropdown = document.getElementById('removeEmployeeId');

    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }

    empIds.forEach(empId => {
        const option = document.createElement('option');
        option.value = empId;
        option.textContent = empId;
        dropdown.appendChild(option);
    });
}

function getUpdateEmployeesIds() {
    const table = document.getElementById('employeeTable');
    const rows = table.getElementsByClassName('employee-item');
    const empIds = [];

    for (const row of rows) {
        const empId = row.getElementsByClassName('staff_id')[0].textContent;
        const empStatus = row.getElementsByClassName('staff_empl_status')[0].textContent;
        if (empStatus === 'Active') {
            empIds.push(empId);
        }
    }
    return empIds;
}

function populateEmpIdForUpdate(empIds) {
    const dropdown = document.getElementById('updEmployeeId');

    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }

    empIds.forEach(empId => {
        const option = document.createElement('option');
        option.value = empId;
        option.textContent = empId;
        dropdown.appendChild(option);
    });
}

function getEmployeesEmail() {
    const table = document.getElementById('employeeTable');
    const rows = table.getElementsByClassName('employee-item');
    const empEmails = [];

    for (const row of rows) {
        const empEmail = row.getElementsByClassName('staff_email')[0].textContent;
        empEmails.push(empEmail);
    }
    return empEmails;
}

function populateEmpEmailsDropdown(empEmails) {
    const dropdown = document.getElementById('removeEmployeeEmail');

    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }

    empEmails.forEach(empEmail => {
        const option = document.createElement('option');
        option.value = empEmail;
        option.textContent = empEmail;
        dropdown.appendChild(option);
    });
}



document.addEventListener('DOMContentLoaded', function() {
    getEmployeeList();
});

document.getElementById('addEmployeeSubmit').addEventListener('click', function(event) {
    event.preventDefault();
    
    const allFieldsFilled = [
        'addEmployeeName', 'addEmployeePhoneNum', 'employeeEmail', 'employeePassword', 'employeeSupervisor'
    ].every(id => document.getElementById(id).value.trim() !== "");

    if (allFieldsFilled) {
        const name = document.getElementById('addEmployeeName').value.trim();
        const phoneNum = document.getElementById('addEmployeePhoneNum').value.trim();
        const email = document.getElementById('employeeEmail').value.trim();
        const password = document.getElementById('employeePassword').value.trim();
        const supervisor = document.getElementById('employeeSupervisor').value.trim();
        const position = document.getElementById('employeePosition').value.toLowerCase();
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', addEmployeeUrl); 
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('sucessfully added employee');
                document.getElementById('addEmployeeName').value = '';
                document.getElementById('addEmployeePhoneNum').value = '';
                document.getElementById('employeeEmail').value = '';
                document.getElementById('employeePassword').value = '';
                document.getElementById('employeeSupervisor').value = '';
                document.getElementById('employeePosition').value = '';
                getEmployeeList();
                updateTotalEmployeesCount();
            } 
            else {
                console.error('Error:', xhr.statusText);
            }
        };

        const data = JSON.stringify({ 
            name: name, 
            phoneNum: phoneNum, 
            email: email, 
            password: password, 
            supervisor: supervisor, 
            position: position
        });
        
        xhr.send(data);
    }
    else {
        const submitBtn = document.getElementById('addEmployeeSubmit');
        submitBtn.classList.add('shake-button');

        setTimeout(() => {
            submitBtn.classList.remove('shake-button');
        }, 500);
    }
});


document.getElementById('removeEmployeeSubmit').addEventListener('click', function(event) {
    event.preventDefault();
    
    const allFieldsFilled = [
        'removeEmployeeEmail', 'removeEmployeeId', 'removalReason'
    ].every(id => document.getElementById(id).value.trim() !== "");

    if (allFieldsFilled) {
        const email = document.getElementById('removeEmployeeEmail').value.trim();
        const staff_id = document.getElementById('removeEmployeeId').value.trim();
        const empStatus = document.getElementById('removalReason').value;
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', removeEmployeeUrl); 
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('sucessfully removed employee');
                document.getElementById('removeEmployeeEmail').value = '';
                document.getElementById('removeEmployeeId').value = '';
                document.getElementById('removalReason').value = '';
                getEmployeeList();
                updateTotalEmployeesCount();
            } 
            else {
                console.error('Error:', xhr.statusText);
            }
        };

        const data = JSON.stringify({ 
            email: email, 
            staff_id: staff_id,
            empStatus: empStatus
        });
        
        xhr.send(data);
    }
    else {
        const submitBtn = document.getElementById('removeEmployeeSubmit');
        submitBtn.classList.add('shake-button');

        setTimeout(() => {
            submitBtn.classList.remove('shake-button');
        }, 500);
    }
});


document.getElementById('updEmployeeSubmit').addEventListener('click', function(event) {
    event.preventDefault();
    
    const allFieldsFilled = [
        'updEmployeeId', 'updEmployeePosition', 'updEmployeeSupervisor'
    ].every(id => document.getElementById(id).value.trim() !== "");

    if (allFieldsFilled) {
        const empId = document.getElementById('updEmployeeId').value;
        const empPos = document.getElementById('updEmployeePosition').value;
        const empSuper = document.getElementById('updEmployeeSupervisor').value;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', updateEmployeeRoleUrl); 
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('sucessfully updated employee role');
                document.getElementById('updEmployeeId').value = '';
                document.getElementById('updEmployeePosition').value = '';
                document.getElementById('updEmployeeSupervisor').value = '';
                getEmployeeList();
                updateTotalEmployeesCount();
            } 
            else {
                console.error('Error:', xhr.statusText);
            }
        };

        const data = JSON.stringify({ 
            empId: empId,
            empPos: empPos,
            empSuper: empSuper
        });
        
        xhr.send(data);  
    }
    else {
        const submitBtn = document.getElementById('updEmployeeSubmit');
        submitBtn.classList.add('shake-button');

        setTimeout(() => {
            submitBtn.classList.remove('shake-button');
        }, 500);
    }
});



document.getElementById('searchEmplsButton').addEventListener('click', function(event) {
    event.preventDefault();

    const empStatDropdown = document.getElementById('limitEmpStat').value;
    const positionDropdown = document.getElementById('limitPosition').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', filterEmployeesUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Limit by successful');
            const employeesDiv = document.querySelector('.table-content');
            employeesDiv.innerHTML = xhr.responseText;
            updateTotalEmployeesCount();
        } 
        else {
            console.error('Error:', xhr.statusText);
        }
    };

    const data = JSON.stringify({ empStatus: empStatDropdown, empPosition: positionDropdown});
    xhr.send(data);
});

document.getElementById('resetEmplSearch').addEventListener('click', function(event) {
    document.getElementById('limitEmpStat').value = '';
    document.getElementById('limitPosition').value = ''; 
    getEmployeeList()
});

function updateTotalEmployeesCount() {
    const totalEmployees = document.getElementById('total-count');
    const rowCount = document.getElementById('employeeTable').rows.length - 2;
    totalEmployees.textContent = rowCount;
}

/*Manage Employees Tab End */



/*Manage Events Tab*/
const getEventsUrl = `${backendUrl}/getEventsForAdmin`;
const addEventUrl = `${backendUrl}/insertEvent`;
const removeEventUrl = `${backendUrl}/deleteEvent`;
const filterEventsUrl = `${backendUrl}/filterEvents`;
const adminAlertsUrl = `${backendUrl}/getAdminAlerts`;

const addEventBtn = document.getElementById('addEventBtn');
const addEventForm = document.getElementById('addEventForm');
const removeEventBtn = document.getElementById('removeEventBtn');
const removeEventForm = document.getElementById('removeEventForm');

addEventBtn.addEventListener('click', () => {
  toggleForm(addEventBtn, addEventForm);
  hideFormIfOpen(removeEventForm);
});

removeEventBtn.addEventListener('click', () => {
  toggleForm(removeEventBtn, removeEventForm);
  hideFormIfOpen(addEventForm);
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

function calculateAttendanceStatistics() {
    const tableBody = document.getElementById('eventTableItems');
    const eventRows = tableBody.querySelectorAll('tr[class="event-item"]');
    const eventTotalCount = document.getElementById('eventTotal-count');
    const maxAttendanceSpan = document.getElementById('max-attend');
    const minAttendanceSpan = document.getElementById('min-attend');
    const avgAttendanceSpan = document.getElementById('avg-attend');
    const totalAttendanceSpan = document.getElementById('total-atend');
  
    let maxAttendance = 0;
    let minAttendance = 10000000; 
    let totalAttendance = 0;
    let totalEvents = 0;
  
    for (const row of eventRows) {
      const attendance = parseInt(row.querySelector('#attendance').textContent, 10);
  
      maxAttendance = Math.max(maxAttendance, attendance);
      minAttendance = Math.min(minAttendance, attendance);
      totalAttendance += attendance;
      totalEvents += 1;
    }

    if (maxAttendanceSpan) maxAttendanceSpan.textContent = maxAttendance;
    if (minAttendance === 10000000) {
        minAttendanceSpan.textContent = 0;
    }
    else {
        minAttendanceSpan.textContent = minAttendance;
    }
    if (totalAttendanceSpan) totalAttendanceSpan.textContent = totalAttendance;
    if (eventTotalCount) eventTotalCount.textContent = totalEvents;
  
    const averageAttendance = totalAttendance / eventRows.length || 0;
    const roundedAverage = averageAttendance.toFixed(2);
    if (avgAttendanceSpan) avgAttendanceSpan.textContent = roundedAverage;
}

function getEventList() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', getEventsUrl);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const eventsDiv = document.querySelector('.eventTable-content');
            eventsDiv.innerHTML = xhr.responseText;
            calculateAttendanceStatistics();

            const eventIds = getEventIds(); 
            populateEventDropdown(eventIds);
        } 
    };
    xhr.send();
}

function getEventIds() {
    const table = document.getElementById('eventTable');
    const rows = table.getElementsByClassName('event-item');
    const eventIds = [];

    for (const row of rows) {
        const eventId = row.getElementsByClassName('event_id')[0].textContent;
        eventIds.push(eventId);
    }
    return eventIds;
}

function populateEventDropdown(eventIds) {
    const dropdown = document.getElementById('eventId');

    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }

    eventIds.forEach(eventId => {
        const option = document.createElement('option');
        option.value = eventId;
        option.textContent = eventId;
        dropdown.appendChild(option);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    getEventList();
    getTriggerAlert();
    const eventsAlertModal = document.getElementById('eventsAlert');
    const acceptMsgBtn = document.getElementById('accept-msg');
    acceptMsgBtn.addEventListener('click', function() {
        eventsAlertModal.style.display = 'none'; 
    });
});

function adjustTriggerAlertHeight() {
    const ulElements = document.querySelectorAll('.trigEvents ul');
    const numULs = ulElements.length;
    const modalHeight = 200 + (numULs * 40);
    const alertAdminModal = document.querySelector('.alert-admin');
    alertAdminModal.style.height = modalHeight + 'px';
}

function getTriggerAlert() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', adminAlertsUrl);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const alertsDiv = document.querySelector('.trigEvents');
            alertsDiv.innerHTML = xhr.responseText;
            adjustTriggerAlertHeight();

            const eventsAlertModal = document.getElementById('eventsAlert');
            if (xhr.responseText !== '') {
                eventsAlertModal.style.display = 'block';
            } 
            else {
                eventsAlertModal.style.display = 'none';
            }
        } 
    };
    xhr.send();
}


document.getElementById('addEventSubmit').addEventListener('click', function(event) {
    event.preventDefault();
    
    const allFieldsFilled = [
        'addEventName', 'addEventDes', 'eventImg', 'eventCategory', 'eventSponsor', 'eventDate', 'eventStart', 'eventEnd'
    ].every(id => document.getElementById(id).value.trim() !== "");

    if (allFieldsFilled) {
        const name = document.getElementById('addEventName').value.trim();
        const des = document.getElementById('addEventDes').value.trim();
        const img = document.getElementById('eventImg').value.trim();
        const category = document.getElementById('eventCategory').value;
        const sponsor = document.getElementById('eventSponsor').value.trim();
        const date = document.getElementById('eventDate').value;
        const startTime = document.getElementById('eventStart').value;
        const endTime = document.getElementById('eventEnd').value;

        function padTime(time) {
            return time.length === 1 ? `0${time}` : time;
        }

        const [sthourStr, stminuteStr] = startTime.split(':');
        let stHour = parseInt(sthourStr, 10);
        const stMinute = parseInt(stminuteStr, 10);
        let stPeriod = 'AM';

        if (stHour >= 12) {
            stPeriod = 'PM';
            if (stHour > 12) {
                stHour -= 12;
            }
        }

        const normalizedStartTime = `${padTime(stHour)}:${stMinute}`;


        const [endhourStr, endminuteStr] = endTime.split(':');
        let endHour = parseInt(endhourStr, 10);
        const endMinute = parseInt(endminuteStr, 10);
        let endPeriod = 'AM';

        if (endHour >= 12) {
            endPeriod = 'PM';
            if (endHour > 12) {
                endHour -= 12;
            }
        }

        const normalizedEndTime = `${padTime(endHour)}:${endMinute}`;

        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', addEventUrl); 
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('sucessfully added employee');
                document.getElementById('addEventName').value = '';
                document.getElementById('addEventDes').value = '';
                document.getElementById('eventCategory').value = '';
                document.getElementById('eventImg').value = '';
                document.getElementById('eventSponsor').value = '';
                document.getElementById('eventDate').value = '';
                document.getElementById('eventStart').value = '';
                document.getElementById('eventEnd').value = '';
                getEventList();
                calculateAttendanceStatistics();
            } 
            else {
                console.error('Error:', xhr.statusText);
            }
        };

        const data = JSON.stringify({ 
            name: name, 
            des: des, 
            img: img, 
            category: category,
            sponsor: sponsor, 
            date: date, 
            normalizedStartTime: normalizedStartTime,
            stPeriod: stPeriod,
            normalizedEndTime: normalizedEndTime,
            endPeriod: endPeriod
        });
        
        xhr.send(data);
    }
    else {
        const submitBtn = document.getElementById('addEventSubmit');
        submitBtn.classList.add('shake-button');

        setTimeout(() => {
            submitBtn.classList.remove('shake-button');
        }, 500);
    }
});

document.getElementById('removeEventSubmit').addEventListener('click', function(event) {
    event.preventDefault();
    
    const allFieldsFilled = document.getElementById('eventId').value.trim() !== "";

    if (allFieldsFilled) {
        const eventId = document.getElementById('eventId').value.trim();
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', removeEventUrl); 
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('sucessfully removed event');
                document.getElementById('eventId').value = '';
                getEventList();
                calculateAttendanceStatistics();
            } 
            else {
                console.error('Error:', xhr.statusText);
            }
        };

        const data = JSON.stringify({ eventId });
        
        xhr.send(data);
    }
    else {
        const submitBtn = document.getElementById('removeEventSubmit');
        submitBtn.classList.add('shake-button');

        setTimeout(() => {
            submitBtn.classList.remove('shake-button');
        }, 500);
    }
});

const fromDateInput = document.getElementById('fromDate');
const toDateInput = document.getElementById('toDate');
const searchButton = document.getElementById('searchEventsButton');
const sponsorInput = document.getElementById('limitSponsor');
const memTypeInput = document.getElementById('limitMember');
const timeInput = document.getElementById('limitTime');

searchButton.addEventListener('click', () => {
  const startDate = fromDateInput.value;
  const endDate = toDateInput.value;
  const sponsor = sponsorInput.value;
  const memType = memTypeInput.value;
  const time = timeInput.value;

  if (startDate && endDate) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', filterEventsUrl); 
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('sucessfully filtered event');
            const filteredEventsDiv = document.querySelector('.eventTable-content');
            filteredEventsDiv.innerHTML = xhr.responseText;
            calculateAttendanceStatistics();
        } 
        else {
            console.error('Error:', xhr.statusText);
        }
    };

    const data = JSON.stringify({ 
        startDate: startDate, 
        endDate: endDate,
        sponsor: sponsor,
        memType: memType,
        time: time
    });
        
    xhr.send(data);
  } 
  else {
    alert("Date range required");
    const submitBtn = document.getElementById('searchEventsButton');
        submitBtn.classList.add('shake-button');

        setTimeout(() => {
            submitBtn.classList.remove('shake-button');
        }, 500);
  }
});

document.getElementById('resetEventFilters').addEventListener('click', function(event) {
    document.getElementById('limitSponsor').value = '';
    document.getElementById('limitMember').value = '';
    document.getElementById('limitTime').value = '';
    document.getElementById('toDate').value = '';
    document.getElementById('fromDate').value = '';
    getEventList();
});


/*Manage Events Tab End*/


/*Manage Inventory Tab*/
const getItemsUrl = `${backendUrl}/getItemsForAdmin`;
const filterCatalogItemsUrl = `${backendUrl}/filterCatalogItems`;

function getItemList() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', getItemsUrl);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const catalogDiv = document.querySelector('.catalogTable-content');
            catalogDiv.innerHTML = xhr.responseText;
            updateTotalCatalogItemsCount()
        } 
    };
    xhr.send();
}

document.addEventListener('DOMContentLoaded', function() {
    getItemList();
});

document.getElementById('searchCatalogButton').addEventListener('click', function(event) {
    const itemType = document.getElementById('itemType').value;
    const itemCondition = document.getElementById('item-condition').value;
    const checkoutDate = document.getElementById('checkDate').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', filterCatalogItemsUrl); 
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('sucessfully filtered catalog items event');
            
            const catalogDiv = document.querySelector('.catalogTable-content');
            catalogDiv.innerHTML = xhr.responseText;
            updateTotalCatalogItemsCount()
        } 
        else {
            console.error('Error:', xhr.statusText);
        }
    };

    
    const data = JSON.stringify({ itemType: itemType, itemCondition: itemCondition, checkoutDate: checkoutDate });
    console.log(data);
        
    xhr.send(data);
});

document.getElementById('resetTable').addEventListener('click', function(event) {
    document.getElementById('itemType').value = '';
    document.getElementById('item-condition').value = '';
    document.getElementById('checkDate').value = '';
    getItemList();
});

function updateTotalCatalogItemsCount() {
    const totalItems = document.getElementById('totalItemsCount');
    const rowCount = document.getElementById('catalogTable').rows.length - 1;
    totalItems.textContent = rowCount;
}











 