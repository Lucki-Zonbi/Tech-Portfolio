document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const verifyBtn = document.getElementById("verify-btn");
  const genPassBtn = document.getElementById("generate-pass-btn");

  // Toggle password visibility
  document.getElementById("toggle-password").addEventListener("change", (e) => {
    const pwd = document.getElementById("password");
    pwd.type = e.target.checked ? "text" : "password";
  });

  // Generate random password
  genPassBtn.addEventListener("click", () => {
    const chars = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      num: "0123456789",
      special: "!@#$%^&*()_+~`|}{[]:;?><,./-="
    };

    function getRandom(set) {
      return set[Math.floor(Math.random() * set.length)];
    }

    let password =
      getRandom(chars.upper) +
      getRandom(chars.lower) +
      getRandom(chars.num) +
      getRandom(chars.special);

    const allChars = chars.upper + chars.lower + chars.num + chars.special;
    while (password.length < Math.floor(8 + Math.random() * 3)) {
      password += getRandom(allChars);
    }

    document.getElementById("generated-password").textContent = password;
  });

  // Handle login
  loginBtn.addEventListener("click", () => {
    const pwd = document.getElementById("password").value;
    const error = document.getElementById("auth-error");
    const validPassPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,10}$/;

    if (!validPassPattern.test(pwd)) {
      error.textContent = "Password does not meet requirements.";
      return;
    }

    error.textContent = "";
    start2FA();
  });

  verifyBtn.addEventListener("click", verify2FA);
});

let generatedCode = "";

function start2FA() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("verify-section").style.display = "block";

  generatedCode = String(Math.floor(100000 + Math.random() * 900000));
  document.getElementById("code-display").textContent = generatedCode;
}

function verify2FA() {
  const inputCode = document.getElementById("auth-code").value;
  const error = document.getElementById("code-error");

  if (inputCode === generatedCode) {
    error.textContent = "";
    document.getElementById("verify-section").style.display = "none";
    document.getElementById("about-section").style.display = "block";
  } else {
    error.textContent = "Incorrect code. Try again.";
  }
}
