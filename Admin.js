// Elements
const formTitle = document.getElementById("formTitle");
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordDiv = document.getElementById("passwordDiv");
const passwordInput = document.getElementById("password");
const confirmPasswordDiv = document.getElementById("confirmPasswordDiv");
const confirmPasswordInput = document.getElementById("confirmPassword");
const messageDiv = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

const loginText = document.getElementById("loginText");
const registerText = document.getElementById("registerText");
const forgotPasswordText = document.getElementById("forgotPasswordText");
const backToLoginText = document.getElementById("backToLoginText");

const switchToRegisterBtn = document.getElementById("switchToRegister");
const switchToLoginBtn = document.getElementById("switchToLogin");
const switchToForgotBtn = document.getElementById("switchToForgot");
const backToLoginBtn = document.getElementById("backToLogin");

// State: 'login', 'register', 'forgot'
let currentForm = "login";

// Helper: get admins from localStorage
function getAdmins() {
  return JSON.parse(localStorage.getItem("admins")) || [];
}

// Helper: save admins to localStorage
function saveAdmins(admins) {
  localStorage.setItem("admins", JSON.stringify(admins));
}

// Helper: validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show form based on currentForm state
function updateForm() {
  messageDiv.textContent = "";
  emailInput.value = "";
  passwordInput.value = "";
  confirmPasswordInput.value = "";

  if (currentForm === "login") {
    formTitle.textContent = "Admin Login";
    passwordDiv.style.display = "block";
    passwordInput.required = true;
    confirmPasswordDiv.classList.add("hidden");
    confirmPasswordInput.required = false;
    submitBtn.textContent = "Login";

    loginText.classList.remove("hidden");
    registerText.classList.add("hidden");
    forgotPasswordText.classList.remove("hidden");
    backToLoginText.classList.add("hidden");
  } else if (currentForm === "register") {
    formTitle.textContent = "Admin Registration";
    passwordDiv.style.display = "block";
    passwordInput.required = true;
    confirmPasswordDiv.classList.remove("hidden");
    confirmPasswordInput.required = true;
    submitBtn.textContent = "Register";

    loginText.classList.add("hidden");
    registerText.classList.remove("hidden");
    forgotPasswordText.classList.add("hidden");
    backToLoginText.classList.add("hidden");
  } else if (currentForm === "forgot") {
    formTitle.textContent = "Forgot Password";
    passwordDiv.style.display = "none";
    passwordInput.required = false;
    confirmPasswordDiv.classList.add("hidden");
    confirmPasswordInput.required = false;
    submitBtn.textContent = "Reset Password";

    loginText.classList.add("hidden");
    registerText.classList.add("hidden");
    forgotPasswordText.classList.add("hidden");
    backToLoginText.classList.remove("hidden");
  }
}

// Switch form handlers
switchToRegisterBtn.addEventListener("click", () => {
  currentForm = "register";
  updateForm();
});

switchToLoginBtn.addEventListener("click", () => {
  currentForm = "login";
  updateForm();
});

switchToForgotBtn.addEventListener("click", () => {
  currentForm = "forgot";
  updateForm();
});

backToLoginBtn.addEventListener("click", () => {
  currentForm = "login";
  updateForm();
});

// On form submit
authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  messageDiv.textContent = "";

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!isValidEmail(email)) {
    messageDiv.textContent = "Please enter a valid email address.";
    return;
  }

  let admins = getAdmins();

  if (currentForm === "login") {
    // Login logic
    const admin = admins.find((a) => a.email === email);
    if (!admin) {
      messageDiv.textContent = "No admin found with this email.";
      return;
    }
    if (admin.password !== password) {
      messageDiv.textContent = "Incorrect password.";
      return;
    }
    // Login success
    localStorage.setItem("loggedInAdmin", JSON.stringify(admin));
    alert("Login successful!");
    window.location.href = "Student Panel.html";
  } else if (currentForm === "register") {
    if (password.length < 6) {
      messageDiv.textContent = "Password must be at least 6 characters.";
      return;
    }
    if (password !== confirmPassword) {
      messageDiv.textContent = "Passwords do not match.";
      return;
    }
    if (admins.some((a) => a.email === email)) {
      messageDiv.textContent = "An admin with this email already exists.";
      return;
    }
    admins.push({ email, password });
    saveAdmins(admins);
    alert("Registration successful! You can now login.");
    currentForm = "login";
    updateForm();
  } else if (currentForm === "forgot") {
    const adminIndex = admins.findIndex((a) => a.email === email);
    if (adminIndex === -1) {
      messageDiv.textContent = "No admin found with this email.";
      return;
    }
    const newPassword = prompt("Enter your new password (min 6 chars):");
    if (!newPassword || newPassword.length < 6) {
      alert("Password reset cancelled or invalid password.");
      return;
    }
    admins[adminIndex].password = newPassword;
    saveAdmins(admins);
    alert("Password reset successful! Please login with your new password.");
    currentForm = "login";
    updateForm();
  }
});

// Initialize form
updateForm();
