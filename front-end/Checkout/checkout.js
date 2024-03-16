document.addEventListener('DOMContentLoaded', function() {
    const removeBtns = document.querySelectorAll('.remove-btn');
    const totalItemsSpan = document.getElementById('total-items')

    removeBtns.forEach(function(button) {
        button.addEventListener('click', function(event) {
            const itemToRemove = event.target.closest('.transac-item');

            if (itemToRemove) {
                itemToRemove.remove();
                updateTotalItems();
            }
        });
    });

    function updateTotalItems() {
        const totalItems = document.querySelectorAll(".transac-item").length;
        totalItemsSpan.textContent = totalItems;
    }

    updateTotalItems();

});

