const VALID_USERNAME = "user";
const VALID_PASSWORD = "secure123";
let generatedCode = "";

document.addEventListener("DOMContentLoaded", () => {
  const lockUntil = parseInt(localStorage.getItem("lockoutUntil"));
  const now = Date.now();

  if (lockUntil && now > Date.now()) {
    alert("Login is locked. Please wait before trying again.");
    disableLogin();
    return;
  }

  const authTime = parseInt(localStorage.getItem("authTime"));
  if (authTime && now - authTime < 24 * 60 * 60 * 1000) {
    window.location.href = "../index.html";
  }

  const pwdToggle = document.getElementById("toggle-password");
  if (pwdToggle) {
    pwdToggle.addEventListener("change", (e) => {
      const pwdInput = document.getElementById("auth-password");
      if (pwdInput) {
        pwdInput.type = e.target.checked ? "text" : "password";
      }
    });
  }
});

function start2FA() {
  const user = document.getElementById("auth-username").value.trim();
  const pass = document.getElementById("auth-password").value.trim();
  const errorDiv = document.getElementById("auth-error");

  const totalFails = parseInt(localStorage.getItem("totalFails") || "0");
  const sessionFails = parseInt(localStorage.getItem("sessionFails") || "0");

  if (totalFails >= 8) {
    localStorage.setItem("lockoutUntil", Date.now() + 24 * 60 * 60 * 1000);
    alert("Too many failed attempts. Try again in 24 hours.");
    disableLogin();
    return;
  }

  if (sessionFails >= 4) {
    localStorage.setItem("lockoutUntil", Date.now() + 15 * 60 * 1000);
    alert("Too many failed attempts. Try again in 15 minutes.");
    disableLogin();
    return;
  }

  if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
    errorDiv.textContent = "";
    localStorage.setItem("sessionFails", "0");
    generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    document.getElementById("code-display").textContent = generatedCode;
  } else {
    errorDiv.textContent = "Invalid username or password.";
    localStorage.setItem("sessionFails", sessionFails + 1);
    localStorage.setItem("totalFails", totalFails + 1);
  }
}

function verify2FA() {
  const codeInput = document.getElementById("auth-code").value.trim();
  const errorDiv = document.getElementById("code-error");

  if (codeInput === generatedCode) {
    errorDiv.textContent = "";
    const now = Date.now();
    localStorage.setItem("authTime", now.toString());

    // Generate temporary credentials
    const newUser = "user" + Math.floor(1000 + Math.random() * 9000);
    const newPass = "pass" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("tempUser", newUser);
    localStorage.setItem("tempPass", newPass);
    localStorage.setItem("tempUserExpires", now + 15 * 60 * 1000);

    alert(`Success! New temporary credentials:\nUsername: ${newUser}\nPassword: ${newPass}`);
    window.location.href = "../index.html";
  } else {
    errorDiv.textContent = "Incorrect 2FA code.";
  }
}

function disableLogin() {
  const inputs = document.querySelectorAll("input");
  const buttons = document.querySelectorAll("button");
  inputs.forEach(input => input.disabled = true);
  buttons.forEach(btn => btn.disabled = true);
}

function resetAuth() {
  localStorage.removeItem("authTime");
  localStorage.removeItem("sessionFails");
  localStorage.removeItem("totalFails");
  localStorage.removeItem("lockoutUntil");
  localStorage.removeItem("tempUser");
  localStorage.removeItem("tempPass");
  localStorage.removeItem("tempUserExpires");
  alert("Auth reset complete.");
  window.location.reload();
}
