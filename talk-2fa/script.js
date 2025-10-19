document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("auth-password");
  const confirmInput = document.getElementById("auth-confirm-password");
  const messageDiv = document.getElementById("password-message");
  const signInBtn = document.getElementById("sign-in-btn");
  const togglePassword = document.getElementById("toggle-password");

  // Show/hide password
  togglePassword.addEventListener("change", () => {
    const type = togglePassword.checked ? "text" : "password";
    passwordInput.type = type;
    confirmInput.type = type;
  });

  // Enable button only if passwords match and meet requirements
  function validatePasswords() {
    const pwd = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,10}$/;

    if (!pwdRegex.test(pwd)) {
      messageDiv.textContent = "Password does not meet requirements.";
      messageDiv.style.color = "red";
      signInBtn.disabled = true;
      return;
    }

    if (pwd === confirm && pwd.length > 0) {
      messageDiv.textContent = "Passwords Match";
      messageDiv.style.color = "limegreen";
      signInBtn.disabled = false;
    } else if (confirm.length > 0) {
      messageDiv.textContent = "Passwords Do Not Match";
      messageDiv.style.color = "red";
      signInBtn.disabled = true;
    } else {
      messageDiv.textContent = "";
      signInBtn.disabled = true;
    }
  }

  passwordInput.addEventListener("input", validatePasswords);
  confirmInput.addEventListener("input", validatePasswords);

  // Sign In click
  signInBtn.addEventListener("click", () => {
    window.location.href = "about.html"; // Redirect to about page
  });
});
