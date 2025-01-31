// Toggle loading spinner
function toggleSpinner(formType, show) {
  const spinner = document.getElementById(`${formType}Spinner`);
  spinner.style.display = show ? "block" : "none";
}

// Show alert message
function showAlert(type, message, formType) {
  const alertElement = document.getElementById(`${formType}Error`);
  if (type === "Success") {
    alertElement.classList.remove("alert-error");
    alertElement.classList.add("alert-success");
  } else {
    alertElement.classList.remove("alert-success");
    alertElement.classList.add("alert-error");
  }
  alertElement.textContent = message;
}

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();
  toggleSpinner("login", true);

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showAlert("Success", "Login successful!", "login");
      window.location.href = "/dashboard";
    } else {
      showAlert("Error", data.error || "Login failed", "login");
    }
  } catch (error) {
    showAlert("Error", "An error occurred", "login");
  } finally {
    toggleSpinner("login", false);
  }
}

// Handle signup form submission
async function handleSignup(event) {
  event.preventDefault();
  toggleSpinner("signup", true);

  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    // Check if username is available
    const usernameResponse = await fetch("/api/check-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const usernameData = await usernameResponse.json();

    if (!usernameData.available) {
      showAlert("Error", "Username already taken", "signup");
      return;
    }

    // Check if email is valid
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      showAlert("Error", "Invalid email address", "signup");
      return;
    }

    // Check if password is strong enough
    if (password.length < 8) {
      showAlert("Error", "Password must be at least 8 characters long", "signup");
      return;
    }

    // Submit signup form
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showAlert("Success", "Account created successfully!", "signup");
      setTimeout(() => window.location.href = "/", 2000);
    } else {
      showAlert("Error", data.error || "Signup failed", "signup");
    }
  } catch (error) {
    showAlert("Error", "An error occurred", "signup");
  } finally {
    toggleSpinner("signup", false);
  }
}

// Toggle password visibility
// Toggle password visibility
function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);
  const type = input.type === "password" ? "text" : "password";
  input.type = type;
  icon.className = `fas fa-${
    type === "password" ? "eye" : "eye-slash"
  } password-toggle`;
}

// // Show alert message
// function showAlert(type, message, formType) {
//   const alert = document.getElementById(`${formType}${type}`);
//   alert.textContent = message;
//   alert.style.display = "block";
//   setTimeout(() => {
//     alert.style.display = "none";
//   }, 5000);
// }

// // Toggle loading spinner
// function toggleSpinner(formType, show) {
//   const spinner = document.getElementById(`${formType}Spinner`);
//   spinner.style.display = show ? "block" : "none";
// }

// // Handle login form submission
// async function handleLogin(event) {
//   event.preventDefault();
//   toggleSpinner("login", true);

//   const username = document.getElementById("loginUsername").value;
//   const password = document.getElementById("loginPassword").value;

//   try {
//     const response = await fetch("/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       showAlert("Success", "Login successful!", "login");
//       window.location.href = "/dashboard";
//     } else {
//       showAlert("Error", data.error || "Login failed", "login");
//     }
//   } catch (error) {
//     showAlert("Error", "An error occurred", "login");
//   } finally {
//     toggleSpinner("login", false);
//   }
// }

// // Handle signup form submission
// async function handleSignup(event) {
//   event.preventDefault();
//   toggleSpinner("signup", true);

//   const username = document.getElementById("signupUsername").value;
//   const email = document.getElementById("signupEmail").value;
//   const password = document.getElementById("signupPassword").value;

//   try {
//     const response = await fetch("/api/signup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, email, password }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       showAlert("Success", "Account created successfully!", "signup");
//       setTimeout(() => toggleForm("login"), 2000);
//     } else {
//       showAlert("Error", data.error || "Signup failed", "signup");
//     }
//   } catch (error) {
//     showAlert("Error", "An error occurred", "signup");
//   } finally {
//     toggleSpinner("signup", false);
//   }
// }

// Handle social login
// Handle social media login
function handleGoogleLogin() {
  alert('not avilable');
};

function handleFacebookLogin() {
  alert('not available');
};



// Add form validation
function validateForm(formType) {
  const password = document.getElementById(`${formType}Password`).value;

  // Password strength validation
  if (password.length < 8) {
    showAlert(
      "Error",
      "Password must be at least 8 characters long",
      formType
    );
    return false;
  }

  if (formType === "signup") {
    const email = document.getElementById("signupEmail").value;

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showAlert("Error", "Please enter a valid email address", formType);
      return false;
    }

    const username = document.getElementById("signupUsername").value;

    // Username validation
    if (username.length < 3) {
      showAlert(
        "Error",
        "Username must be at least 3 characters long",
        formType
      );
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showAlert(
        "Error",
        "Username can only contain letters, numbers, and underscores",
        formType
      );
      return false;
    }
  }

  return true;
}



// Add password strength indicator
const passwordInputs = document.querySelectorAll(
  'input[type="password"]'
);
passwordInputs.forEach((input) => {
  input.addEventListener("input", function () {
    const strength = checkPasswordStrength(this.value);
    updatePasswordStrengthIndicator(this, strength);
  });
});

function checkPasswordStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return strength;
}

function updatePasswordStrengthIndicator(input, strength) {
  const strengthMap = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const colorMap = [
    "#ff4444",
    "#ffbb33",
    "#ffeb3b",
    "#00C851",
    "#007E33",
  ];

  let indicator = input.parentElement.querySelector(".password-strength");

  if (!indicator) {
    indicator = document.createElement("div");
    indicator.className = "password-strength";
    indicator.style.fontSize = "12px";
    indicator.style.marginTop = "5px";
    input.parentElement.appendChild(indicator);
  }

  if (input.value) {
    indicator.textContent = `Password Strength: ${
      strengthMap[strength - 1]
    }`;
    indicator.style.color = colorMap[strength - 1];
  } else {
    indicator.textContent = "";
  }
}

// Add input validation feedback
const formInputs = document.querySelectorAll("input");
formInputs.forEach((input) => {
  input.addEventListener("input", function () {
    validateInput(this);
  });

  input.addEventListener("blur", function () {
    validateInput(this, true);
  });
});

function validateInput(input, showError = false) {
  let isValid = true;
  let errorMessage = "";

  switch (input.type) {
    case "email":
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      errorMessage = "Please enter a valid email address";
      break;

    case "password":
      isValid = input.value.length >= 8;
      errorMessage = "Password must be at least 8 characters long";
      break;

    case "text":
      isValid =
        input.value.length >= 3 && /^[a-zA-Z0-9_]+$/.test(input.value);
      errorMessage =
        "Username must be at least 3 characters and contain only letters, numbers, and underscores";
      break;
  }

  if (showError && !isValid && input.value) {
    showInputError(input, errorMessage);
  } else {
    clearInputError(input);
  }

  return isValid;
}

function showInputError(input, message) {
  clearInputError(input);
  input.style.borderColor = "#ff4444";

  const errorDiv = document.createElement("div");
  errorDiv.className = "input-error";
  errorDiv.textContent = message;
  errorDiv.style.color = "#ff4444";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "5px";

  input.parentElement.appendChild(errorDiv);
}

function clearInputError(input) {
  input.style.borderColor = "";
  const errorDiv = input.parentElement.querySelector(".input-error");
  if (errorDiv) {
    errorDiv.remove();
  }
}
