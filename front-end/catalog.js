function adjustSidebarHeight() {
    var sidebar = document.querySelector('.sidebar');
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var totalHeight = 175;

    for (var i = 0; i < dropdowns.length; i ++) {
        if (dropdowns[i].classList.contains('show')) {
            totalHeight += dropdowns[i].offsetHeight;
        }
    }

    sidebar.style.height = totalHeight + "px";
}



function toggleDropdown(dropdownId) {
    var dropdownContent = document.getElementById(dropdownId);
    var dropdownButton = dropdownContent.previousElementSibling;

    if (event.target === dropdownButton) {
        dropdownContent.classList.toggle("show");
        adjustSidebarHeight();
    }
        
}

