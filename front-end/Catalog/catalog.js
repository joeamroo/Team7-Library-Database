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

/*document.getElementById('search-btn').addEventListener('click', function(event) {
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
}); */


function getInitialInfo() {
    fetch('/api/get-catalog')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Process the data and append new HTML content
        data.forEach(item => {
            const itemHtml = '';
            if (item.asset_type === 'book') {
                itemHtml = createBookItem(item);
            }
            else if (item.asset_type === 'movie') {
                itemHtml = createMovieItem(item);
            }
            else if (item.asset_type === 'device') {
                itemHtml = createDeviceItem(item);
            }
            appendCatalogItem(itemHtml);
        });
      })
      .catch(error => {
        console.error('Error fetching initial data:', error);
      });
  }
  
  // Function to create HTML for a catalog item
  function createBookItem(item) {
    return `
    <img src="${item.image_address}">
    <div class="info">
        <h3 id = "title">${item.book_movie_title_model}</h3>
        <p id="author-place">by <span id="author">${item.authors}</span></p>
        <p>Type: <span id="medium">Book</span></p>
        <p>ISBN <span id="isbn">${item.isbn}</span></p>
        <p id="year-place">Year Published: <span id="yearPub">${item.year_released}</span></p>
        <p>Current Holds: <span id="currHolds">${item.current_holds}</span></p>
        <p>System availability: <span id="availableItems">${item.available_copies} (of ${item.total_copies})</span></p>
    </div>
    `;
  }

  function createMovieItem(item) {
    return `
    <img src="${item.image_address}">
    <div class="info">
        <h3 id = "title">${item.book_movie_title_model}</h3>
        <p id="author-place">by <span id="author">${item.authors}</span></p>
        <p>Type: <span id="medium">Book</span></p>
        <p>ISBN <span id="isbn">${item.isbn}</span></p>
        <p id="year-place">Year Published: <span id="yearPub">${item.year_released}</span></p>
        <p>Current Holds: <span id="currHolds">${item.current_holds}</span></p>
        <p>System availability: <span id="availableItems">${item.available_copies} (of ${item.total_copies})</span></p>
    </div>
    `;
  }

  function createDeviceItem(item) {
    return `
    <img src="${item.image_address}">
    <div class="info">
        <h3 id = "title">${item.book_movie_title_model}</h3>
        <p id="author-place">by <span id="author">${item.authors}</span></p>
        <p>Type: <span id="medium">Book</span></p>
        <p>ISBN <span id="isbn">${item.isbn}</span></p>
        <p id="year-place">Year Published: <span id="yearPub">${item.year_released}</span></p>
        <p>Current Holds: <span id="currHolds">${item.current_holds}</span></p>
        <p>System availability: <span id="availableItems">${item.available_copies} (of ${item.total_copies})</span></p>
    </div>
    `;
  }

  function appendCatalogItem(html) {
    const catalogContainer = document.querySelector('.catalog-results');
    catalogContainer.insertAdjacentHTML('beforeend', html);
  }
  
  window.addEventListener('load', fetchInitialData);