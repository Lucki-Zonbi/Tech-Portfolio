const ORIGINAL_USERNAME = "user";
const ORIGINAL_PASSWORD = "secure123";
const MAX_ATTEMPTS_BEFORE_LOCK = 4;
const MAX_TOTAL_ATTEMPTS = 8;
let generatedCode = "";

// Utility to generate username/password combo
function generateCredentials() {
  const rand = Math.random().toString(36).substring(2, 8);
  return {
    username: "user_" + rand,
    password: "pass_" + rand,
  };
}

function getStoredCredentials() {
  const data = localStorage.getItem("dynamicCredentials");
  return data ? JSON.parse(data) : null;
}

function storeCredentials(credentials) {
  localStorage.setItem("dynamicCredentials", JSON.stringify(credentials));
  localStorage.setItem("credTime", Date.now().toString());
}

function credentialsExpired() {
  const storedTime = parseInt(localStorage.getItem("credTime"));
  return !storedTime || Date.now() - storedTime > 15 * 60 * 1000;
}

// 24-hour login memory
document.addEventListener("DOMContentLoaded", () => {
  const lockUntil = parseInt(localStorage.getItem("lockoutUntil"));
  const now = Date.now();

  if (lockUntil && now < lockUntil) {
    alert("Login locked due to multiple failed attempts. Try again later.");
    disableLogin();
    return;
  }

  const authTime = parseInt(localStorage.getItem("authTime"));
  if (authTime && now - authTime < 24 * 60 * 60 * 1000) {
    window.location.href = "../index.html";
  }

  document.getElementById("toggle-password").addEventListener("change", (e) => {
    const pwdInput = document.getElementById("auth-password");
    pwdInput.type = e.target.checked ? "text" : "password";
  });
});

function start2FA() {
  const user = document.getElementById("auth-username").value.trim();
  const pass = document.getElementById("auth-password").value.trim();
  const errorDiv = document.getElementById("auth-error");

  const totalFails = parseInt(localStorage.getItem("totalFails") || "0");
  const sessionFails = parseInt(localStorage.getItem("sessionFails") || "0");

  // Check lockout
  const now = Date.now();
  const lockUntil = parseInt(localStorage.getItem("lockoutUntil") || "0");
  if (now < lockUntil) {
    alert("You are locked out. Try again later.");
    disableLogin();
    return;
  }

  // Validate against credentials
  const dynamicCreds = getStoredCredentials();
  const validCreds = credentialsExpired() ? null : dynamicCreds;

  const isOriginal = user === ORIGINAL_USERNAME && pass === ORIGINAL_PASSWORD;
  const isGenerated = validCreds && user === validCreds.username && pass === validCreds.password;

  if (isOriginal || isGenerated) {
    localStorage.setItem("sessionFails", "0");

    generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    document.getElementById("code-display").textContent = generatedCode;
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    errorDiv.textContent = "";
  } else {
    let newSessionFails = sessionFails + 1;
    let newTotalFails = totalFails + 1;

    localStorage.setItem("sessionFails", newSessionFails.toString());
    localStorage.setItem("totalFails", newTotalFails.toString());

    if (newSessionFails >= MAX_ATTEMPTS_BEFORE_LOCK && newTotalFails < MAX_TOTAL_ATTEMPTS) {
      const lockTime = Date.now() + 15 * 60 * 1000;
      localStorage.setItem("lockoutUntil", lockTime.toString());
      alert("Too many failed attempts. Try again in 15 minutes.");
      disableLogin();
    } else if (newTotalFails >= MAX_TOTAL_ATTEMPTS) {
      const lockTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("lockoutUntil", lockTime.toString());
      alert("Too many failed attempts. You are locked out for 24 hours.");
      disableLogin();
    } else {
      errorDiv.textContent = "Invalid credentials.";
    }
  }
}

function verify2FA() {
  const inputCode = document.getElementById("auth-code").value.trim();
  const codeError = document.getElementById("code-error");

  if (inputCode === generatedCode) {
    codeError.textContent = "";
    localStorage.setItem("authTime", Date.now().toString());

    // Generate new credentials every 15 mins
    const newCreds = generateCredentials();
    storeCredentials(newCreds);

    alert(`New login credentials:\nUsername: ${newCreds.username}\nPassword: ${newCreds.password}`);

    window.location.href = "../index.html";
  } else {
    codeError.textContent = "Incorrect code.";
  }
}

function disableLogin() {
  document.getElementById("login-btn").disabled = true;
  document.getElementById("auth-username").disabled = true;
  document.getElementById("auth-password").disabled = true;
}

function resetAuth() {
  localStorage.removeItem("authTime");
  localStorage.removeItem("lockoutUntil");
  localStorage.removeItem("sessionFails");
  localStorage.removeItem("totalFails");
  localStorage.removeItem("dynamicCredentials");
  localStorage.removeItem("credTime");
  alert("Login reset. You can try again.");
  location.reload();
}
