const VALID_USERNAME = "user";
const VALID_PASSWORD = "secure123";
let generatedCode = "";

// Check if login is still valid
window.addEventListener("DOMContentLoaded", () => {
  const authTime = localStorage.getItem("authTime");
  const now = new Date().getTime();

  if (authTime && now - parseInt(authTime) < 24 * 60 * 60 * 1000) {
    // Within 24 hours
    window.location.href = "../index.html"; // Redirect to portfolio
  }
});

function start2FA() {
  const user = document.getElementById("auth-username").value;
  const pass = document.getElementById("auth-password").value;
  const error = document.getElementById("auth-error");

  if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
    error.textContent = "";
    generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    document.getElementById("code-display").textContent = generatedCode;
  } else {
    error.textContent = "Invalid username or password.";
  }
}

function verify2FA() {
  const codeInput = document.getElementById("auth-code").value;
  const error = document.getElementById("code-error");

  if (codeInput === generatedCode) {
    error.textContent = "";
    const now = new Date().getTime();
    localStorage.setItem("authTime", now.toString());
    window.location.href = "../index.html";
  } else {
    error.textContent = "Incorrect code. Try again.";
  }
}
