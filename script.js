function registerUser() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
  
    if (email && password) {
      localStorage.setItem('adminUser', JSON.stringify({ email, password }));
      alert("Registered successfully!");
      window.location.href = 'login.html';
    } else {
      alert("Please fill all fields.");
    }
  }
  
  function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    const user = JSON.parse(localStorage.getItem('adminUser'));
  
    if (user && email === user.email && password === user.password) {
      alert("Login successful!");
      window.location.href = 'https://kalpanachamoli.github.io/Pet-Care/';
    } else {
      alert("Invalid email or password.");
    }
  }
  