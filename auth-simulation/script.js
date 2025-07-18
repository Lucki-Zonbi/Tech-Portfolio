const VALID_USERNAME = "user";
const VALID_PASSWORD = "secure123";
let generatedCode = "";

// === On Page Load ===
window.addEventListener("DOMContentLoaded", () => {
  const authTime = localStorage.getItem("authTime");
  const now = new Date().getTime();

  // Bypass login if within 24 hours
  if (authTime && now - parseInt(authTime) < 24 * 60 * 60 * 1000) {
    window.location.href = "../index.html";
  }

  // Allow Enter key to trigger verify2FA
  const codeInput = document.getElementById("auth-code");
  if (codeInput) {
    codeInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        verify2FA();
      }
    });
  }
});

// === Handle Login Step 1 ===
function start2FA() {
  const user = document.getElementById("auth-username").value;
  const pass = document.getElementById("auth-password").value;
  const error = document.getElementById("auth-error");
  const loginBtn = document.getElementById("auth-login-btn");

  const now = new Date().getTime();
  const failCount = parseInt(localStorage.getItem("loginFails")) || 0;
  const lockUntil = parseInt(localStorage.getItem("loginLockUntil")) || 0;

  if (now < lockUntil) {
    const waitTime = Math.ceil((lockUntil - now) / 60000);
    error.textContent = `Too many failed attempts. Try again in ${waitTime} minutes.`;
    loginBtn.disabled = true;
    return;
  }

  if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
    error.textContent = "";
    generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    sessionStorage.setItem("generatedCode", generatedCode);

    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    document.getElementById("code-display").textContent = generatedCode;
  } else {
    const newFailCount = failCount + 1;
    localStorage.setItem("loginFails", newFailCount.toString());

    if (newFailCount >= 8) {
      const lockTime = now + 24 * 60 * 60 * 1000;
      localStorage.setItem("loginLockUntil", lockTime.toString());
      error.textContent = "Too many failed attempts. You are locked out for 24 hours.";
    } else if (newFailCount >= 4) {
      const lockTime = now + 15 * 60 * 1000;
      localStorage.setItem("loginLockUntil", lockTime.toString());
      error.textContent = "Too many failed attempts. You are locked out for 15 minutes.";
    } else {
      error.textContent = "Invalid username or password.";
    }
  }
}

// === Handle 2FA Code Verification ===
function verify2FA() {
  const codeInput = document.getElementById("auth-code").value;
  const error = document.getElementById("code-error");
  const storedCode = sessionStorage.getItem("generatedCode");

  if (codeInput === storedCode) {
    error.textContent = "";
    const now = new Date().getTime();
    localStorage.setItem("authTime", now.toString());
    localStorage.removeItem("loginFails");
    localStorage.removeItem("loginLockUntil");
    window.location.href = "../index.html";
  } else {
    error.textContent = "Incorrect code. Try again.";
  }
}
