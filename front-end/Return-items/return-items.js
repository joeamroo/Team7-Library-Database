document.addEventListener('DOMContentLoaded', function() {
    const addBtns = document.querySelectorAll('.add-btn');
    const transactionDetails = document.getElementById('items-to-return');
    const detailsContainer = document.querySelector('.transaction-details');
    const finalizeBtn = document.getElementById('finalize-btn');
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

});

document.addEventListener('DOMContentLoaded', function() {  
    const finalizeBtn = document.getElementById('finalize-btn');
    const modal = document.getElementById('myModal');
    const confirmReturnBtn = document.getElementById('confirm-return');
    const cancelReturnBtn = document.getElementById('cancel-return');
  
    finalizeBtn.addEventListener('click', function() {
      modal.style.display = 'block';
    });
  
    confirmReturnBtn.addEventListener('click', function() {
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