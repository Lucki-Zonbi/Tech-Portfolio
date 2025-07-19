const VALID_USERNAME = "user";
const VALID_PASSWORD = "secure123";
let generatedCode = "";

const MAX_ATTEMPTS_15MIN = 4;
const MAX_ATTEMPTS_24HR = 8;
const LOCKOUT_15MIN = 15 * 60 * 1000;
const LOCKOUT_24HR = 24 * 60 * 60 * 1000;

let attempts = parseInt(localStorage.getItem("loginAttempts")) || 0;
let lockUntil = parseInt(localStorage.getItem("lockUntil")) || 0;

// Check if login is still valid (15 minutes session)
window.addEventListener("DOMContentLoaded", () => {
  const authTime = localStorage.getItem("authTime");
  const now = new Date().getTime();

  if (authTime && now - parseInt(authTime) < 15 * 60 * 1000) {
    window.location.href = "../index.html"; // Skip login if within 15 mins
  }

  // Check for lockout
  if (lockUntil && now < lockUntil) {
    const remaining = Math.ceil((lockUntil - now) / 60000);
    alert(`Too many failed attempts. Try again in ${remaining} minutes.`);
    document.getElementById("auth-form").style.display = "none";
  }

  // Allow Enter key for login
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.getElementById("step1").style.display !== "none") {
      start2FA();
    } else if (e.key === "Enter" && document.getElementById("step2").style.display !== "none") {
      verify2FA();
    }
  });
});

function start2FA() {
  const user = document.getElementById("auth-username").value;
  const pass = document.getElementById("auth-password").value;
  const error = document.getElementById("auth-error");
  const now = new Date().getTime();

  if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
    error.textContent = "";
    generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    document.getElementById("code-display").textContent = generatedCode;
    attempts = 0;
    localStorage.setItem("loginAttempts", attempts);
  } else {
    attempts++;
    localStorage.setItem("loginAttempts", attempts);

    if (attempts >= MAX_ATTEMPTS_24HR) {
      localStorage.setItem("lockUntil", now + LOCKOUT_24HR);
      error.textContent = "Too many failed attempts. Try again in 24 hours.";
      document.getElementById("auth-form").style.display = "none";
    } else if (attempts >= MAX_ATTEMPTS_15MIN) {
      localStorage.setItem("lockUntil", now + LOCKOUT_15MIN);
      error.textContent = "Too many failed attempts. Try again in 15 minutes.";
      document.getElementById("auth-form").style.display = "none";
    } else {
      const remaining = MAX_ATTEMPTS_15MIN - attempts;
      error.textContent = `Invalid credentials. You have ${remaining} attempt(s) left.`;
    }
  }
}

function verify2FA() {
  const codeInput = document.getElementById("auth-code").value;
  const error = document.getElementById("code-error");

  if (codeInput === generatedCode) {
    error.textContent = "";
    const now = new Date().getTime();
    localStorage.setItem("authTime", now.toString());
    localStorage.removeItem("loginAttempts");
    localStorage.removeItem("lockUntil");
    window.location.href = "../index.html";
  } else {
    error.textContent = "Incorrect code. Try again.";
  }
}

function resetAuth() {
  localStorage.removeItem("authTime");
  localStorage.removeItem("authAttempts");
  alert("Login reset. You can try again.");
  window.location.reload();
}
