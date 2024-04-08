
const backendUrl = 'https://cougarchronicles.onrender.com'; 
const resetPasswdUrl = `${backendUrl}/reset-password`;


document.getElementById('reset-sub').addEventListener('click', function(event) {
    event.preventDefault();
    
    const allFieldsFilled = [
        'userID', 'email', 'newPwd'
    ].every(id => document.getElementById(id).value.trim() !== "");

    if (allFieldsFilled) {
        const user_id = document.getElementById('userID').value.trim();
        const email = document.getElementById('email').value.trim();
        const new_password = document.getElementById('newPwd').value.trim();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', resetPasswdUrl); 
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('sucessfully changed password');
            } 
            else {
                console.error('Error :', xhr.statusText);
            }
        };

        const data = JSON.stringify({ user_id: user_id, email: email, new_password: new_password});
        
        send(data);
    }
    else {
        const submitBtn = document.getElementById('reset-sub');
        submitBtn.classList.add('shake-button');

        setTimeout(() => {
            submitBtn.classList.remove('shake-button');
        }, 500);
    }
});

