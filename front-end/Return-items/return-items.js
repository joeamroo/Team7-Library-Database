// Interacting with backend

const backendUrl = 'https://cougarchronicles.onrender.com'; 
const getTransactionUrl = `${backendUrl}/getTransaction`;
const sendReturnUrl = `${backendUrl}/sendReturn`;

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', function() {
        const transactionId = document.getElementById('transactionID').value;
        localStorage.setItem('transactionId', transactionId);

        const data = JSON.stringify({ transactionId:transactionId });

        const xhr = new XMLHttpRequest();
        xhr.open('POST', getTransactionUrl);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status === 200) {
                const transacResultsDiv = document.querySelector('.chosen-items');
                transacResultsDiv.innerHTML = xhr.responseText;


                const addBtns = document.querySelectorAll('.add-btn');
                const transactionDetails = document.getElementById('items-to-return');
                const detailsContainer = document.querySelector('.transaction-details');
                let addedItems = new Map();

                addBtns.forEach(function(button) {
                    const icon = button.querySelector('.add-icon');
                    const transacItem = button.closest('.transac-item');
                    let itemContent = '';

                    if (transacItem.querySelector('#btitle')) {
                        itemContent += transacItem.querySelector('#btitle').textContent;
                    } 
                    else if (transacItem.querySelector('#mtitle')) {
                        itemContent += transacItem.querySelector('#mtitle').textContent;
                    }
                    else if (transacItem.querySelector('#model')) {
                        itemContent += transacItem.querySelector('#model').textContent;
                    }

                    const medium = transacItem.querySelector('#medium').textContent;
                    const itemId = transacItem.querySelector('#item_id').textContent;
                    itemContent += ' (' + medium + ')';

                    button.addEventListener('click', function() {
                        icon.classList.toggle('rotate-icon');
                        icon.classList.toggle('uil-check');

                        if (icon.classList.contains('uil-check')) {
                            button.style.backgroundColor = '#00ac45';
                            button.style.color = 'white';

                            const newItem = document.createElement('p');
                            newItem.textContent = itemContent;
                            transactionDetails.appendChild(newItem);
                            addedItems.set(button, newItem);
                            updateTotalItemsCount(addedItems.size);
                            updateTransacHeight(detailsContainer, addedItems.size);

                            let itemsReturning = JSON.parse(localStorage.getItem('itemsReturning')) || [];
                            itemsReturning.push({ medium, itemId });
                            localStorage.setItem('itemsReturning', JSON.stringify(itemsReturning));
                        }        
                        else {
                            button.style.backgroundColor = ''; 
                            button.style.color = '#00ac45';

                            const itemToRemove = addedItems.get(button);
                            if (itemToRemove) {
                                transactionDetails.removeChild(itemToRemove);
                                addedItems.delete(button);
                                updateTotalItemsCount(addedItems.size);
                                updateTransacHeight(detailsContainer, addedItems.size);

                                let itemsReturning = JSON.parse(localStorage.getItem('itemsReturning')) || [];
                                itemsReturning = itemsReturning.filter(item => item.itemId !== itemId);
                                localStorage.setItem('itemsReturning', JSON.stringify(itemsReturning));
                            }
                        }
                    });
                });

                function updateTotalItemsCount(count) {
                    const totalItemsSpan = document.getElementById('total-items');
                    totalItemsSpan.textContent = count;
                }
            
                function updateTransacHeight(details, itemCount) {
                    const baseHeight = 280;
                    const additionalHeight = itemCount * 35;
                    const newHeight = baseHeight + additionalHeight;
            
                    details.style.height = newHeight + 'px';
                }
            }
            else {
                console.error('Error getting transaction information:', xhr.statusText);
            }
        };
        xhr.send(data);
    });
});


// Finalizing the return - user will get receipt in pdf form and send it to db
document.addEventListener('DOMContentLoaded', function() {  
    const finalizeBtn = document.getElementById('finalize-btn');
    const modal = document.getElementById('myModal');
    const confirmReturnBtn = document.getElementById('confirm-return');
    const cancelReturnBtn = document.getElementById('cancel-return');
  
    finalizeBtn.addEventListener('click', function() {
      modal.style.display = 'block';
    });
  
    confirmReturnBtn.addEventListener('click', function() {
        sendReturnedItems();
        modal.style.display = 'none';
    });

    cancelReturnBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
  
    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });
});

function sendReturnedItems() {
    const transactionId = localStorage.getItem('transactionId');
    const itemsReturning = JSON.parse(localStorage.getItem('itemsReturning')) || [];

    const dataToSend = [{ transactionId }, ...itemsReturning];
    console.log(dataToSend);
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', sendReturnUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            localStorage.removeItem('itemsReturning');
            localStorage.removeItem('transactionId');

            const modal = document.getElementById('successful-return');
            const message = document.getElementById('return-msg');
            message.textContent = 'Item(s) returned successfully!';
            modal.style.display = 'block';

            const acceptBtn = document.getElementById('accept-msg');
            acceptBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                removeTransacItems();
                window.location.reload();
            });

        }
        else {
            console.log('Error returning items:', xhr.statusText);
        }
    }

    xhr.send(JSON.stringify(dataToSend));
}

function removeTransacItems() {
    const transacItems = document.querySelectorAll('.transac-item');
    transacItems.forEach(item => item.remove());
}