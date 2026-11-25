// 1. Accessible Show / Hide Password toggle
document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.previousElementSibling;
    /**
     *  ? if Type password:  *****
     *  * if Type text: revealtext
     */
    const showPassword = input.type === "password";

    input.type = showPassword ? "text" : "password";
    button.setAttribute("aria-pressed", String(showPassword));
    button.setAttribute(
      "aria-label",
      showPassword ? "Hide password" : "Show password",
    );
    button.textContent = showPassword ? "Hide" : "Show"; // it's defaulted textContent to Show first
  });
});

// 2. Validate a single input using native Constraint Validation API
function checkField(input) {
  const errorBox = input.closest(".field").querySelector(".error-text");
  if (input.validity.valid) {
    errorBox.textContent = "";
    return true;
  } else if (input.validity.valueMissing) {
    errorBox.textContent = "This field is required.";
  } else if (input.validity.typeMismatch) {
    errorBox.textContent = "Please enter a valid email address.";
  } else if (input.validity.tooShort) {
    errorBox.textContent = `Password must be at least ${input.minLength} characters.`;
  }
  setTimeout(() => {
    errorBox.textContent = "";
  }, 2000);

  return false;
}

// Validate on blur (when user leaves field) and clear errors as they fix them
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", () => checkField(input));

  input.addEventListener("input", () => {
    const hasError = input
      .closest(".field")
      .querySelector(".error-text").textContent;
    if (hasError) checkField(input);
  });
});

// 3. Handle form submission (practice demo using localStorage)
const form = document.querySelector("[data-auth-form]");
console.log(form);
const statusBanner = document.querySelector(".status-banner");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = [...form.querySelectorAll("input")];
    const isFormValid = inputs.map(checkField).every(Boolean);

    if (!isFormValid) {
      inputs.find((input) => !input.validity.valid)?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const mode = form.dataset.authForm;

    if (mode === "signup") {
      // Save demo user in localStorage so you can test logging in right after!
      localStorage.setItem("demoUser", JSON.stringify(data));
      statusBanner.textContent = `Account created for ${data.name}! You can now sign in.`;
      form.reset();
    } else {
      const savedUser = JSON.parse(localStorage.getItem("demoUser") || "null");

      if (
        savedUser &&
        savedUser.email === data.email &&
        savedUser.password === data.password
      ) {
        statusBanner.textContent = `Welcome back, ${savedUser.name}! Login successful.`;
      } else {
        statusBanner.textContent = `Signed in as ${data.email} (create an account first to test matching credentials).`;
      }
    }
  });
}
