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
            currentItemToRemove.remove();
            updateTotalItems();
            modal.style.display = 'none';
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

    updateTotalItems();
});


document.addEventListener('DOMContentLoaded', function() {
    const finalizeBtn = document.getElementById('finalize-btn');
    const totalItemsSpan = document.getElementById('total-items');

    finalizeBtn.addEventListener('click', function() {
        
        const memberID = document.getElementById('mem-id').textContent;
        const location = document.getElementById('curr-location').textContent;
        const currentDate = document.getElementById('current-date').textContent;
        const dueDate = document.getElementById('due-date').textContent;
        const totalItems = totalItemsSpan.textContent;

        const content = `
            <h2>Checkout Receipt</h2>
            <p>Member ID: ${memberID}</p>
            <p>Location: ${location}</p>
            <p>Date: ${currentDate}</p>
            <p>Due Date: ${dueDate}</p>
            <p>Total Items: ${totalItems}</p>
        `;

        html2pdf().from(content).save('checkout.receipt.pdf');
    });
});

