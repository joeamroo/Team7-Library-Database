// NEED to delete and remove chosen items once confirm checkout is called
// localStorage.removeItem('chosenItems');

const memberId = localStorage.getItem('memberId');
const memIdElement = document.getElementById('mem-id');

if (memIdElement && memberId) {
    memIdElement.innerHTML = memberId;
}

const backendUrl = 'https://cougarchronicles.onrender.com'; 
const checkoutInsertUrl = `${backendUrl}/checkout-insert`;

document.addEventListener('DOMContentLoaded', function() {
    const finalizeBtn = document.getElementById('finalize-btn');
    const totalItemsSpan = document.getElementById('total-items');
  
    finalizeBtn.addEventListener('click', function() {
      const memberID = document.getElementById('mem-id').textContent;
      const location = document.getElementById('curr-location').textContent;
      const currentDate = document.getElementById('current-date').textContent;
      const dueDate = document.getElementById('due-date').textContent;
      const totalItems = totalItemsSpan.textContent;
      const chosenItems = JSON.parse(localStorage.getItem('chosenItems')) || [];

      const isLoggedIn = localStorage.getItem('loggedIn');

      if (isLoggedIn === 'false') {
        showNoLoginToast()
        return;
      }
  
      
      const data = {
        memberID: memberID,
        items: chosenItems.map(itemHtml => {
            const itemInfo = new DOMParser().parseFromString(itemHtml, 'text/html').querySelector('.info');
            const itemType = itemInfo.querySelector('#medium').textContent.toLowerCase();
            let itemId = '';
            const potentialIdElements = {
                book: itemInfo.querySelector('#isbn'),
                movie: itemInfo.querySelector('#movie-id'),
                device: itemInfo.querySelector('#device_id'),
            };
            const itemIdElement = potentialIdElements[itemType];
            itemId = itemIdElement?.textContent ?? '';
            return { type: itemType, id: itemId };
        })
      };

      const xhr = new XMLHttpRequest();
      xhr.open('POST', checkoutInsertUrl);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const transactionId = response.transactionId;

            let content = `
                <div style="padding-left: 25px;">
                  <h2>Checkout Receipt</h2>
                  <p>Transaction ID: ${transactionId}</p>
                  <p>Member ID: ${memberID}</p>
                  <p>Location: ${location}</p>
                  <p>Date: ${currentDate}</p>
                  <p>Due Date: ${dueDate}</p>
                  <p>Total Items: ${totalItems}</p>
            `;
  
            if (chosenItems.length > 0) {
                content += '<h3>Chosen Items:</h3><div style="padding-left: 25px;">';
                chosenItems.forEach(itemHtml => {
                  const itemInfo = new DOMParser().parseFromString(itemHtml, 'text/html').querySelector('.info');
                  const title = itemInfo.querySelector('#title') || itemInfo.querySelector('#model');
                  const titleTextWithAsterisk = '- ' + title.textContent;
                  const medium = itemInfo.querySelector('#medium').textContent;
                  content += `<div><h4>${titleTextWithAsterisk}</h4><div style="padding-left: 25px;">`;
                  content += `<p>Type: ${medium}</p></div>`;
                });
            }
  
            content += '</div>';
  
            html2pdf().from(content).set({jsPDF: {unit: 'in', format: 'letter',orientation: 'portrait'},
                image: {type: 'jpeg', quality: 1},
                html2canvas: {scale: 3, logging: true, dpi: 192, letterRendering: true},
              }).save('checkout_receipt.pdf');

            localStorage.removeItem('chosenItems');
            setTimeout(function() {window.location.reload();}, 300);
        } 
        else if (xhr.status === 403) {
            const response = JSON.parse(xhr.responseText);
            const trigger_modal = document.getElementById('fine-trigger');
            const trigger_message = document.getElementById('trigger-msg');

            trigger_message.textContent = response.message;
            trigger_modal.style.display = 'block';

            const acceptBtn = document.getElementById('accept-msg');
            acceptBtn.addEventListener('click', function() {
                trigger_modal.style.display = 'none';
            });
        }
        else {
          console.error('Error inserting data:', xhr.statusText);
        }
      };
      xhr.send(JSON.stringify(data));
    });
});

function showNoLoginToast() {
    let toastContainer = document.getElementById('chkOutToastContainer');

    toastContainer.innerText = 'User is not logged in';
    toastContainer.style.display = 'block';
    toastContainer.style.opacity = '1';
  
    setTimeout(() => {
      toastContainer.style.opacity = '0';
    }, 1100);
  
    setTimeout(() => {
      toastContainer.style.display = 'none';
    }, 11000);
}

// Getting catalog items from local storage that will be used to make insertion for transaction
// ADD localStorage.removeItem('chosenItems')  after the checkout button is clicked 
document.addEventListener('DOMContentLoaded', function() {
    const chosenItemsDiv = document.querySelector('.chosen-items');

    if (chosenItemsDiv) {
        const chosenItemsArray = JSON.parse(localStorage.getItem('chosenItems')) || [];
        chosenItemsArray.forEach(itemHtml => {
            const itemContainer = document.createElement('div');
            itemContainer.innerHTML = itemHtml;
            chosenItemsDiv.appendChild(itemContainer);
        });
    } 
});

// Remove item
document.addEventListener('DOMContentLoaded', function() {  
    const removeBtns = document.querySelectorAll('.remove-btn');
    const modal = document.getElementById('remove-modal');
    const confirmReturnBtn = document.getElementById('confirm-return');
    const cancelReturnBtn = document.getElementById('cancel-return');
    const totalItemsSpan = document.getElementById('total-items');

    let currentItemToRemove = null;

    removeBtns.forEach(function(removeBtn) {
        removeBtn.addEventListener('click', function(event) {
            currentItemToRemove = event.target.closest('.transac-item');
            modal.style.display = 'block';
        });
    });

    confirmReturnBtn.addEventListener('click', function() {
        if (currentItemToRemove) {
            const itemHtml = currentItemToRemove.outerHTML;
            console.log(itemHtml);
            currentItemToRemove.remove();
            updateTotalItems();
            removeItemFromLocalStorage(itemHtml);
            modal.style.display = 'none';
            currentItemToRemove = null;
        }
    });

    cancelReturnBtn.addEventListener('click', function() {
        currentItemToRemove = null;
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            currentItemToRemove = null;
            modal.style.display = 'none';
        }
    });

    function updateTotalItems() {
        const totalItems = document.querySelectorAll(".transac-item").length;
        totalItemsSpan.textContent = totalItems;
    }

    function removeItemFromLocalStorage(itemHtml) {
        let chosenItems = JSON.parse(localStorage.getItem('chosenItems')) || [];
        const decodedItemHtml = itemHtml.replace(/&amp;/g, '&');
        chosenItems = chosenItems.filter(item => item !== decodedItemHtml);
        localStorage.setItem('chosenItems', JSON.stringify(chosenItems));
    }

    updateTotalItems();
});

function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
}
  
// Adding timestamp to page for both insertion and receipt purposes
window.addEventListener('DOMContentLoaded', function() {
    const currentDateSpan = document.getElementById('current-date');
    const dueDateSpan = document.getElementById('due-date');
  
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); 
  
    currentDateSpan.textContent = formatDate(currentDate);
    dueDateSpan.textContent = formatDate(dueDate);
});