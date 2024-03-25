// Function to dynamically change sidebar height based on open or closed buttons
function adjustSidebarHeight() {
    var sidebar = document.querySelector('.sidebar');
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var totalHeight = 375;

    for (var i = 0; i < dropdowns.length; i ++) {
        if (dropdowns[i].classList.contains('show')) {
            totalHeight += dropdowns[i].offsetHeight;
        }
    }

    sidebar.style.height = totalHeight + "px";
}


// Drop down menu
function toggleDropdown(dropdownId) {
    var dropdownContent = document.getElementById(dropdownId);
    var dropdownButton = dropdownContent.previousElementSibling;
    var icon = dropdownButton.querySelector(".icon")

    if (event.target === dropdownButton) {
        dropdownContent.classList.toggle("show");
        adjustSidebarHeight();

        if (dropdownContent.classList.contains("show")) {
            icon.innerHTML = "&#x25B2;";
        }
        else {
            icon.innerHTML = "&#x25BC;";
        }
    }
        
}


// Setting the catalog container based on how many catalog items the user wants to display 
function setCatalogContHeight() {
    const catalogContainer = document.querySelector('.catalog-container');
    const catalogItems = document.querySelectorAll('.catalog-item[style="display: flex;"]');
    const itemHeight = 260; // Height of each catalog item
    const minHeight = 260; // Minimum height of the catalog container

    const containerHeight = Math.max(minHeight, itemHeight * catalogItems.length);

    catalogContainer.style.height = containerHeight + 'px';
}

function updateItemsShownOnPage(limit) {
    const catalogItem = document.querySelectorAll('.catalog-item');

    catalogItem.forEach((item, index) => {
        if (index < limit) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none'
        }
    });
}

function loadMoreItems(limit) {
    const catalogItems = document.querySelectorAll('.catalog-item');
    const currItemCount = catalogItems.length;
    const totalItemCount = catalogItems.length;

    const remainingItems = totalItemCount - currItemCount;
    const itemsToShow = Math.min(remainingItems, limit - currItemCount);

    for (let i = currItemCount; i < currItemCount+itemsToShow; i++) {
        catalogItems[i].style.display = 'flex';
    }
    setCatalogContHeight();
}

updateItemsShownOnPage(3);

document.getElementById('limit-select').addEventListener('change', function() {
    const limit = parseInt(this.value);

    updateItemsShownOnPage(limit);
    loadMoreItems(limit);
    setCatalogContHeight();
});


// Backend functions

document.getElementById('search-btn').addEventListener('click', function(event) {
    event.preventDefault(); 
    
    const keyword = document.getElementById('keyword').value;
    const searchBy = document.getElementById('search-by').value;
    const limitBy = document.getElementById('limit-by').value;

    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/catalog'); 
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            const catalogResultsDiv = document.querySelector('.catalog-results');
            catalogResultsDiv.innerHTML = xhr.responseText;
        } 
        else {
            console.error('Error:', xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error('Network error');
    };

    const data = JSON.stringify({ keyword: keyword, searchBy: searchBy, limitBy: limitBy });

    xhr.send(data);
}); 