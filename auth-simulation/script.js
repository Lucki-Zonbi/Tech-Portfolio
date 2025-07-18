const VALID_USERNAME = "user";
const VALID_PASSWORD = "secure123";
let generatedCode = "";

const MAX_ATTEMPTS_15_MIN = 4;
const MAX_ATTEMPTS_24_HOUR = 8;
const LOCKOUT_KEY = "lockoutTime";
const ATTEMPT_KEY = "failedAttempts";

// Check lockout status on page load
window.addEventListener("DOMContentLoaded", () => {
  const authTime = localStorage.getItem("authTime");
  const now = Date.now();

  // Already authenticated?
  if (authTime && now - parseInt(authTime) < 24 * 60 * 60 * 1000) {
    window.location.href = "../index.html";
  }

  checkLockout();
});

// Listen for Enter key on login form
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && document.getElementById("step1").style.display !== "none") {
    start2FA();
  }
});

function checkLockout() {
  const lockoutData = JSON.parse(localStorage.getItem(LOCKOUT_KEY));
  const now = Date.now();

  if (lockoutData) {
    const { until, type } = lockoutData;
    if (now < until) {
      const minsLeft = Math.ceil((until - now) / 60000);
      alert(`Too many failed login attempts. You are locked out for ${type === '24h' ? '24 hours' : minsLeft + ' minutes'}.`);
      disableLogin();
    } else {
      localStorage.removeItem(LOCKOUT_KEY);
      localStorage.removeItem(ATTEMPT_KEY);
    }
  }
}

function disableLogin() {
  document.getElementById("auth-username").disabled = true;
  document.getElementById("auth-password").disabled = true;
  document.getElementById("auth-login-btn").disabled = true;
}

function start2FA() {
  const user = document.getElementById("auth-username").value;
  const pass = document.getElementById("auth-password").value;
  const error = document.getElementById("auth-error");

  checkLockout(); // Just in case

  if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
    error.textContent = "";
    generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    document.getElementById("code-display").textContent = generatedCode;
    localStorage.removeItem(ATTEMPT_KEY);
  } else {
    // Handle failed attempt
    const currentAttempts = parseInt(localStorage.getItem(ATTEMPT_KEY)) || 0;
    const newAttempts = currentAttempts + 1;
    localStorage.setItem(ATTEMPT_KEY, newAttempts);

    if (newAttempts >= MAX_ATTEMPTS_24_HOUR) {
      const lockoutUntil = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until: lockoutUntil, type: "24h" }));
      alert("Too many failed attempts. Login disabled for 24 hours.");
      disableLogin();
    } else if (newAttempts >= MAX_ATTEMPTS_15_MIN) {
      const lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until: lockoutUntil, type: "15min" }));
      alert("Too many failed attempts. Login disabled for 15 minutes.");
      disableLogin();
    } else {
      error.textContent = `Invalid username or password. (${newAttempts} failed attempt${newAttempts > 1 ? 's' : ''})`;
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
    window.location.href = "../index.html";
  } else {
    error.textContent = "Incorrect code. Try again.";
  }
}
