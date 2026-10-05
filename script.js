 function handleLogin(e) {
        e.preventDefault();
        const pass = document.getElementById('adminPass').value;
        const errorText = document.getElementById('errorMsg');
        
        // Set your single admin password here (e.g., admin123)
        if (pass === "admin123") {
            window.location.href = "adming.html";
        } else {
            errorText.style.display = "block";
        }
    }
   
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get user input values (adjust IDs/names to match your form fields)
        const name = document.querySelector('input[name="fullname"]') ? document.querySelector('input[name="fullname"]').value : "New Student";
        const email = document.querySelector('input[name="email"]').value;
       const role = "Student"; // Default role
        
        const newAccount = {
            id: Date.now(),
            name: name,
            email: email,
            role: role,
            status: "Pending Approval"
        };
        
        // Retrieve existing pending users or initialize array
        let pendingUsers = JSON.parse(localStorage.getItem('pendingAdminApprovals')) || [];
        pendingUsers.push(newAccount);
        localStorage.setItem('pendingAdminApprovals', JSON.stringify(pendingUsers));
        
        alert('Registration submitted successfully! Please wait for Admin approval.');
        window.location.href = 'account.html';
    });