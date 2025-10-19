// Grab DOM elements
const passwordInput = document.getElementById("auth-password");
const confirmInput = document.getElementById("auth-confirm-password");
const messageDiv = document.getElementById("password-message");
const signInBtn = document.getElementById("sign-in-btn");
const togglePassword = document.getElementById("toggle-password");

// Disable Sign In button initially
signInBtn.disabled = true;

// Toggle password visibility
togglePassword.addEventListener("change", (e) => {
  const type = e.target.checked ? "text" : "password";
  passwordInput.type = type;
  confirmInput.type = type;
});

// Validate password rules: 1 uppercase, 1 lowercase, 1 number, 1 special, 8-10 chars
function validatePassword(pwd) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
  return regex.test(pwd);
}

// Check passwords match and update message + button state
function checkPasswords() {
  const pwd = passwordInput.value.trim();
  const confirmPwd = confirmInput.value.trim();

  if (!validatePassword(pwd)) {
    messageDiv.textContent = "Password must have 1 uppercase, 1 lowercase, 1 number, 1 special char, 8-10 chars.";
    messageDiv.style.color = "red";
    signInBtn.disabled = true;
    return;
  }

  if (pwd === confirmPwd && pwd !== "") {
    messageDiv.textContent = "Passwords Match";
    messageDiv.style.color = "var(--second-bg-color)";
    signInBtn.disabled = false;
  } else {
    messageDiv.textContent = "Passwords Do Not Match";
    messageDiv.style.color = "red";
    signInBtn.disabled = true;
  }
}

// Event listeners for input
passwordInput.addEventListener("input", checkPasswords);
confirmInput.addEventListener("input", checkPasswords);

// Sign In button click
signInBtn.addEventListener("click", () => {
  // Optional: store that user signed in
  localStorage.setItem("talk2faSignedIn", "true");

  // Redirect to About page
  window.location.href = "about.html";
});
