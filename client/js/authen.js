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
const statusBanner = document.querySelector(".status-banner");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputs = [...form.querySelectorAll("input")];
    const isFormValid = inputs.map(checkField).every(Boolean);

    if (!isFormValid) {
      inputs.find((input) => !input.validity.valid)?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const mode = form.dataset.authForm;
    console.log(mode); // *---------------------------------------------------console.log()

    if (mode === "signup") {
      await signUp(data);
      form.reset();
    } else {
      await signIn(data);
    }
  });
}
const baseUrl = "http://localhost:3000";

async function signUp(data) {
  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${baseUrl}/api/v1/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result.message}` || "Could not create account.");
    }

    console.log("API response:", result);

    statusBanner.style.color = "var(--success)";
    statusBanner.textContent =
      result.message || "Account created! Redirecting...";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  } catch (error) {
    statusBanner.style.color = "var(--error)";
    statusBanner.textContent =
      error.message || "Network error. Please try again.";
  } finally {
    submitBtn.disabled = false;
  }
}

async function signIn(data) {
  const submitBtn = form.querySelector('[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  try {
    const response = await fetch(`${baseUrl}/api/v1/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensures browser stores/sends HttpOnly cookies
      body: JSON.stringify(data),
    });

    result = await response.json();
    console.log("API response:", result);

    if (!response.ok) {
      throw new Error(`${result.message}` || "Invalid email or password.");
    }

    statusBanner.style.color = "var(--success)";
    statusBanner.textContent = result.message || "Signed in! Redirecting...";

    // Redirect to your app's home/dashboard page after sign-in
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  } catch (error) {
    console.log(error.message);
    statusBanner.style.color = "var(--error)";
    statusBanner.textContent = error.message;
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}
