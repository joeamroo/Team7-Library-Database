document.getElementById('RenewButton').addEventListener('click', function() {
    document.getElementById('tab1').style.display = 'block';
    document.getElementById('tab2').style.display = 'none';
});

document.getElementById('ManageButton').addEventListener('click', function() {
    document.getElementById('tab1').style.display = 'none';
    document.getElementById('tab2').style.display = 'block';
});