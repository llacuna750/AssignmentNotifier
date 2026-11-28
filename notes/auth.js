const loginTab = document.getElementById("tab-login");
const signupTab = document.getElementById("tab-signup");
const loginForm = document.getElementById("form-login");
const signupForm = document.getElementById("form-signup");
const statusMsg = document.getElementById("status-msg");

// 1. Switch between Log In and Sign Up forms
function switchMode(mode) {
  const isLogin = mode === "login";
  loginTab.setAttribute("aria-selected", String(isLogin));
  signupTab.setAttribute("aria-selected", String(!isLogin));
  loginForm.hidden = !isLogin;
  signupForm.hidden = isLogin;
  statusMsg.textContent = "";
}

loginTab.addEventListener("click", () => switchMode("login"));
signupTab.addEventListener("click", () => switchMode("signup"));

// 2. Accessible Show / Hide Password toggle (using aria-pressed)
document.querySelectorAll(".toggle-pw").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.previousElementSibling;
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    btn.setAttribute("aria-pressed", String(isHidden));
    btn.textContent = isHidden ? "Hide" : "Show";
  });
});

// 3. Validate only after the user leaves a field (blur) or submits
function validateField(input) {
  const errorBox = input.closest(".field").querySelector(".error-msg");
  if (input.validity.valid) {
    errorBox.textContent = "";
    return true;
  }
  if (input.validity.valueMissing) {
    errorBox.textContent = "This field is required.";
  } else if (input.validity.typeMismatch) {
    errorBox.textContent = "Please enter a valid email address.";
  } else if (input.validity.tooShort) {
    errorBox.textContent = `Use at least ${input.minLength} characters.`;
  }
  return false;
}

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => {
    if (input.closest(".field").querySelector(".error-msg").textContent) {
      validateField(input);
    }
  });
});

// 4. Handle form submission (replace with your backend fetch('/api/login') call)
[loginForm, signupForm].forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll("input")];
    const allValid = inputs.map(validateField).every(Boolean);

    if (!allValid) {
      inputs.find((el) => !el.validity.valid)?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    statusMsg.textContent =
      form.id === "form-login"
        ? `Ready to sign in as ${data.email}`
        : `Ready to register ${data.name} (${data.email})`;
  });
});
