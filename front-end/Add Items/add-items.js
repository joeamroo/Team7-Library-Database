const loggedIn = localStorage.getItem('loggedIn');
const memberId = localStorage.getItem('memberId');
const staffId = localStorage.getItem('staffId');
const isAdmin = localStorage.getItem('isAdmin');
const itemTypeSelect = document.getElementById('itemType-selection');
const publicationreleaseDate = document.getElementById('publicationReleaseDate-date');
const addItemURL = `${backendUrl}/add%20Items/add-items.html`;
const addItemBtn = document.getElementById('addItemBtn');
const addItemForm = document.getElementById('addItemForm');

addItemBtn.addEventListener('click', () => {
    toggleForm(addItemBtn, addItemForm);
  });

document.getElementById('main-btn').addEventListener('click', function(event) {
    event.preventDefault();
    
    const allFieldsFilled = [
        'itemType', 'title', 'authorDirector', 'isbn', 'category', 'publisherProducer', 'publicationReleaseDate'
    ].every(id => document.getElementById(id).value.trim() !== "");

    if (allFieldsFilled) {
        const itemType = document.getElementById('itemType').value.trim();
        const title = document.getElementById('title').value.trim();
        const authorDirector = document.getElementById('authorDirector').value.trim();
        const isbn = document.getElementById('isbn').value.trim();
        const category = document.getElementById('category').value;
        const publisherProducer = document.getElementById('publisherProducer').value;
        const publicationReleaseDate = document.getElementById('publicationReleaseDate').value;


        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', addItemURL); 
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('sucessfully added item');
                document.getElementById('itemType').value = '';
                document.getElementById('title').value = '';
                document.getElementById('authorDirector').value = '';
                document.getElementById('isbn').value = '';
                document.getElementById('category').value = '';
                document.getElementById('publisherProducer').value = '';
                document.getElementById('publicationReleaseDate').value = '';
            } 
            else {
                console.error('Error:', xhr.statusText);
            }
        };

        const data = JSON.stringify({ 
            itemType: itemType, 
            title: title, 
            authorDirector: authorDirector, 
            isbn: isbn, 
            date: date,
            category: category,
            publisherProducer: publisherProducer,
            publicationReleaseDate: publicationReleaseDate
        });
        
        xhr.send(data);
    }
    else {
        const submitBtn = document.getElementById('main-btn');
        additemBtn.classList.add('shake-button');

        setTimeout(() => {
            additemBtn.classList.remove('shake-button');
        }, 500);
    }
});


