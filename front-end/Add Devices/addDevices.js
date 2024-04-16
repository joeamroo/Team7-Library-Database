const loggedIn = localStorage.getItem('loggedIn');
const memberId = localStorage.getItem('memberId');
const staffId = localStorage.getItem('staffId');
const isAdmin = localStorage.getItem('isAdmin');
const itemTypeSelect = document.getElementById('itemType-selection');
const publicationreleaseDate = document.getElementById('publicationReleaseDate-date');
const backendUrl = 'https://cougarchronicles.onrender.com'; 
const addItemURL = `${backendUrl}/addDevices`;
const addItemBtn = document.getElementById('addItemBtn');
const addItemForm = document.getElementById('addItemForm');

document.getElementById('addItemBtn').addEventListener('click', function(event) {
    event.preventDefault();
    
    const allFieldsFilled = [
        'model', 'brand', 'serialNum','imageLink','totalCopies'
    ].every(id => document.getElementById(id).value.trim() !== "");

    if (allFieldsFilled) {
        const model = document.getElementById('model').value;
        const brand = document.getElementById('brand').value;
        const serialNum = document.getElementById('serialNum').value;
        const imageLink = document.getElementById('imageLink').value;
        const totalCopies = document.getElementById('totalCopies').value;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', addItemURL); 
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('sucessfully added item');
                document.getElementById('model').value = '';
                document.getElementById('brand').value = '';
                document.getElementById('serialNum').value = '';
                document.getElementById('imageLink').value = '';
                document.getElementById('totalCopies').value = '';
            } 
            else {
                console.error('Error:', xhr.statusText);
            }
        };

        const data = JSON.stringify({ 
            model: model,
            brand: brand,
            serialNum: serialNum,
            imageLink:imageLink,
            totalCopies:totalCopies,
        });
        
        xhr.send(data);
    }
    else {
        const submitBtn = document.getElementById('addItemBtn');
        additemBtn.classList.add('shake-button');

        setTimeout(() => {
            additemBtn.classList.remove('shake-button');
        }, 500);
    }
});
