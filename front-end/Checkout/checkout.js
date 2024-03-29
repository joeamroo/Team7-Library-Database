// NEED to delete and remove chosen items once confirm checkout is called
// localStorage.removeItem('chosenItems');
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
  
      // Generate the PDF content
      let content = `<div style="padding-left: 25px;">
        <h2>Checkout Receipt</h2>
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
  

      html2pdf().from(content).save('checkout_receipt.pdf');
    });
});

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