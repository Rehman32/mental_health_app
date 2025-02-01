//login.js

// Helper: Toggle spinner visibility
function toggleSpinner(formType, show) {
  const spinner = document.getElementById(`${formType}Spinner`);
  if (spinner) {
    spinner.style.display = show ? "inline-block" : "none";
  }
}

// Helper: Display alert messages
function showAlert(formType, type, message) {
  const alertEl = document.getElementById(`${formType}Alert`);
  alertEl.textContent = message;
  alertEl.className = `alert ${type.toLowerCase()}`;
  alertEl.style.display = "block";
  // Auto-hide after 5 seconds
  setTimeout(() => {
    alertEl.style.display = "none";
  }, 5000);
}

// Toggle password visibility
function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// Handle social login (placeholder)
function handleSocialLogin(provider) {
  alert(`${provider} login is coming soon!`);
}

// Validate inputs before submission
function validateInput(formType) {
  let valid = true;
  if (formType === "signup") {
    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameRegex.test(username)) {
      showAlert("signup", "Error", "Username must be at least 3 characters and contain only letters, numbers, and underscores.");
      valid = false;
    } else if (!emailRegex.test(email)) {
      showAlert("signup", "Error", "Please enter a valid email address.");
      valid = false;
    } else if (password.length < 8) {
      showAlert("signup", "Error", "Password must be at least 8 characters long.");
      valid = false;
    }
  } else if (formType === "login") {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    if (username.length < 3) {
      showAlert("login", "Error", "Please enter a valid username/email.");
      valid = false;
    } else if (password.length < 8) {
      showAlert("login", "Error", "Password must be at least 8 characters long.");
      valid = false;
    }
  }
  return valid;
}

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();
  if (!validateInput("login")) return;
  toggleSpinner("login", true);

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok && data.success) {
      showAlert("login", "Success", "Login successful! Redirecting...");
      // Redirect after a short delay
      setTimeout(() => window.location.href = "/dashboard", 1500);
    } else {
      showAlert("login", "Error", data.error || "Invalid login credentials.");
    }
  } catch (error) {
    showAlert("login", "Error", "An error occurred during login.");
  } finally {
    toggleSpinner("login", false);
  }
}

// Handle signup form submission
async function handleSignup(event) {
  event.preventDefault();
  if (!validateInput("signup")) return;
  toggleSpinner("signup", true);

  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  try {
    // First check if username is available
    const checkResponse = await fetch("/api/check-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username })
    });
    const checkData = await checkResponse.json();
    if (!checkData.available) {
      showAlert("signup", "Error", "Username already taken. Please choose another.");
      toggleSpinner("signup", false);
      return;
    }

    // Proceed to signup
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if (response.ok && data.success) {
      showAlert("signup", "Success", "Account created successfully! Redirecting...");
      setTimeout(() => window.location.href = "/dashboard", 1500);
    } else {
      showAlert("signup", "Error", data.error || "Signup failed.");
    }
  } catch (error) {
    showAlert("signup", "Error", "An error occurred during signup.");
  } finally {
    toggleSpinner("signup", false);
  }
}

// Password strength indicator
function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
}

function updatePasswordStrengthIndicator(input) {
  const strength = checkPasswordStrength(input.value);
  const strengthMap = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const colorMap = ["#ff4444", "#ffbb33", "#ffeb3b", "#00C851", "#007E33"];
  const indicator = input.parentElement.querySelector(".password-strength");
  if (input.value && indicator) {
    // Subtract 1 since array is zero-indexed (if strength is 0, display nothing)
    indicator.textContent = strength ? `Password Strength: ${strengthMap[strength - 1]}` : "";
    indicator.style.color = strength ? colorMap[strength - 1] : "";
  } else if (indicator) {
    indicator.textContent = "";
  }
}

// Listen for password input changes on signup page
const signupPasswordInput = document.getElementById("signupPassword");
if (signupPasswordInput) {
  signupPasswordInput.addEventListener("input", function () {
    updatePasswordStrengthIndicator(this);
  });
}
