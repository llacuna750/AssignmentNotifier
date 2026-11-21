// Build the local API address from the host serving this page.
const API_ORIGIN = (() => {
  const protocol =
    window.location.protocol === "file:" ? "http:" : window.location.protocol;
  const hostname = window.location.hostname || "localhost";
  return `${protocol}//${hostname}:3000`;
})();
const API_BASE = `${API_ORIGIN}/api/v1`;

const authScreen = document.getElementById("auth-screen");
const dashboard = document.getElementById("sidebar");
const skipLink = document.getElementById("skip-link");
const signInForm = document.getElementById("sign-in-form");
const signUpForm = document.getElementById("sign-up-form");
const authHeading = document.getElementById("auth-heading");
const authFeedback = document.getElementById("auth-feedback");
const showSignInButton = document.getElementById("show-sign-in");
const showSignUpButton = document.getElementById("show-sign-up");
const tokenKey = "assignmentNotifierToken";

// Put API success or error messages in the accessible feedback area.
function setFeedback(message = "", kind = "info") {
  authFeedback.textContent = message;
  authFeedback.dataset.kind = kind;
}

// Switch between sign-in and sign-up, update the heading, and optionally focus the first field.
function openAuthForm(mode, { focus = false } = {}) {
  const isSignUp = mode === "sign-up";

  signInForm.hidden = isSignUp;
  signUpForm.hidden = !isSignUp;
  showSignInButton.classList.toggle("is-active", !isSignUp);
  showSignUpButton.classList.toggle("is-active", isSignUp);
  showSignInButton.setAttribute("aria-pressed", String(!isSignUp));
  showSignUpButton.setAttribute("aria-pressed", String(isSignUp));
  authHeading.textContent = isSignUp ? "Create account" : "Welcome back";
  document.title = `${isSignUp ? "Create account" : "Sign in"} | Assignment Notifier`;
  setFeedback();

  if (focus) {
    const firstInput = (isSignUp ? signUpForm : signInForm).querySelector(
      "input",
    );
    firstInput?.focus();
  }
}

showSignInButton.addEventListener("click", () => openAuthForm("sign-in"));
showSignUpButton.addEventListener("click", () => openAuthForm("sign-up"));

// Let the links below each form switch modes while moving focus to the new form.
document.querySelectorAll("[data-open-form]").forEach((button) => {
  button.addEventListener("click", () => {
    openAuthForm(button.dataset.openForm, { focus: true });
  });
});

// Show or hide a password and keep the toggle button's accessible state in sync.
document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.getAttribute("aria-controls"));
    const shouldShow = input.type === "password";
    input.type = shouldShow ? "text" : "password";
    button.textContent = shouldShow ? "Hide" : "Show";
    button.setAttribute(
      "aria-label",
      shouldShow ? "Hide password" : "Show password",
    );
    button.setAttribute("aria-pressed", String(shouldShow));
  });
});

// Keep field error styling and screen-reader descriptions in sync after interaction.
function syncFieldState(input) {
  if (!(input instanceof HTMLInputElement)) return;

  const isInvalidAfterInteraction = input.matches(":user-invalid");
  input.setAttribute("aria-invalid", String(isInvalidAfterInteraction));

  const descriptionIds = [];
  if (input.dataset.hint) descriptionIds.push(input.dataset.hint);
  if (isInvalidAfterInteraction && input.dataset.error) {
    descriptionIds.push(input.dataset.error);
  }

  if (descriptionIds.length) {
    input.setAttribute("aria-describedby", descriptionIds.join(" "));
  } else {
    input.removeAttribute("aria-describedby");
  }
}

// Update validation state only as the user edits, leaves, or submits a field.
document.querySelectorAll(".auth-form input").forEach((input) => {
  input.setAttribute("aria-invalid", "false");
  input.addEventListener("input", () => syncFieldState(input));
  input.addEventListener("blur", () => syncFieldState(input));
  input.addEventListener("invalid", () => syncFieldState(input));
});

// Remove the JWT saved for this browser tab.
function clearSession() {
  sessionStorage.removeItem(tokenKey);
}

// Clear entered credentials and restore password fields to their hidden state.
function resetAuthForms() {
  [signInForm, signUpForm].forEach((form) => {
    form.reset();
    form.querySelectorAll("input").forEach((input) => {
      input.setAttribute("aria-invalid", "false");
      if (input.dataset.hint)
        input.setAttribute("aria-describedby", input.dataset.hint);
      else input.removeAttribute("aria-describedby");
    });
    form.querySelectorAll(".password-toggle").forEach((button) => {
      const input = document.getElementById(
        button.getAttribute("aria-controls"),
      );
      input.type = "password";
      button.textContent = "Show";
      button.setAttribute("aria-label", "Show password");
      button.setAttribute("aria-pressed", "false");
    });
  });
}

// Show the auth screen and its optional message.
function showAuth({ message = "", kind = "info" } = {}) {
  dashboard.hidden = true;
  authScreen.hidden = false;
  skipLink.href = "#auth-main";
  setFeedback(message, kind);
  document.title = "Sign in | Assignment Notifier";
}

// Personalize the dashboard, clear old account data, then load this user's assignments.
function showDashboard(user, { focus = false } = {}) {
  const displayName = user?.name || user?.email || "Student";
  document.getElementById("welcome-user").textContent = displayName;
  const list = document.getElementById("assignment-list");
  list.replaceChildren();
  const loadingState = document.createElement("p");
  loadingState.className = "empty-state";
  loadingState.textContent = "Loading your assignments…";
  list.append(loadingState);
  document.getElementById("total-task").textContent = "0";
  document.getElementById("pending-task").textContent = "0";
  document.getElementById("in-progress-task").textContent = "0";
  document.getElementById("completed-task").textContent = "0";
  document.getElementById("assignment-count").textContent = "Loading";
  authScreen.hidden = true;
  dashboard.hidden = false;
  skipLink.href = "#dashboard-content";
  document.title = "Dashboard | Assignment Notifier";
  if (focus) document.getElementById("assignment-heading").focus();
  return loadAssignments();
}

// Fetch JSON from the API and turn non-success responses into readable errors.
async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      payload.message || "The request could not be completed.",
    );
    error.status = response.status;
    throw error;
  }

  return payload;
}

// Format an assignment due date for display, including invalid or missing dates.
function formatDueDate(value) {
  if (!value) return "No due date";

  const dateValue =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T12:00:00`
      : value;
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Due date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

// Build one assignment card using text nodes for all data received from the API.
function makeAssignmentCard(assignment) {
  const card = document.createElement("article");
  card.className = "assignment-card";

  const icon = document.createElement("span");
  icon.className = "assignment-card-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none"><path d="M8 4.75h8a2 2 0 0 1 2 2v12.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6.75a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.7"/><path d="M9 4.75V3.5h6v1.25M9 10h6m-6 4h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

  const detail = document.createElement("div");
  detail.className = "assignment-card-detail";

  const subject = document.createElement("p");
  subject.className = "assignment-subject";
  subject.textContent = assignment.subject_id
    ? `Subject ${assignment.subject_id}`
    : "Assignment";

  const title = document.createElement("h2");
  title.textContent = assignment.title || "Untitled assignment";

  const dueDate = document.createElement("p");
  dueDate.className = "assignment-due-date";
  dueDate.textContent = `Due ${formatDueDate(assignment.due_date)}`;

  detail.append(subject, title, dueDate);

  const allowedStatuses = new Set(["pending", "in_progress", "completed"]);
  const status = allowedStatuses.has(assignment.status)
    ? assignment.status
    : "pending";
  const statusLabel =
    status === "in_progress"
      ? "In progress"
      : status.charAt(0).toUpperCase() + status.slice(1);
  const statusBadge = document.createElement("span");
  statusBadge.className = `assignment-status status-${status}`;
  statusBadge.textContent = statusLabel;

  card.append(icon, detail, statusBadge);
  return card;
}

// Update the dashboard totals and replace the assignment list with the API results.
function renderAssignments(assignments) {
  const list = document.getElementById("assignment-list");
  const countLabel = document.getElementById("assignment-count");
  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  const pending = safeAssignments.filter(
    (item) => item.status === "pending",
  ).length;
  const inProgress = safeAssignments.filter(
    (item) => item.status === "in_progress",
  ).length;
  const completed = safeAssignments.filter(
    (item) => item.status === "completed",
  ).length;

  document.getElementById("total-task").textContent = String(
    safeAssignments.length,
  );
  document.getElementById("pending-task").textContent = String(pending);
  document.getElementById("in-progress-task").textContent = String(inProgress);
  document.getElementById("completed-task").textContent = String(completed);
  countLabel.textContent = `${safeAssignments.length} ${safeAssignments.length === 1 ? "task" : "tasks"}`;
  list.replaceChildren();

  if (safeAssignments.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent =
      "No assignments yet. Your coursework will show here when you add it.";
    list.append(emptyState);
    return;
  }

  safeAssignments.forEach((assignment) =>
    list.append(makeAssignmentCard(assignment)),
  );
}

// Request assignments with the current JWT and show a useful message if loading fails.
async function loadAssignments() {
  const list = document.getElementById("assignment-list");
  const token = sessionStorage.getItem(tokenKey);
  list.setAttribute("aria-busy", "true");

  try {
    const assignments = await fetchJson(`${API_ORIGIN}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    renderAssignments(assignments);
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      clearSession();
      showAuth({
        message: "Your session has expired. Please sign in again.",
        kind: "error",
      });
      return;
    }

    list.replaceChildren();
    const loadError = document.createElement("p");
    loadError.className = "empty-state empty-state-error";
    loadError.textContent =
      "We could not load your assignments. Check that the API is running, then refresh.";
    list.append(loadError);
  } finally {
    list.setAttribute("aria-busy", "false");
  }
}

// On page load, ask the API whether the saved JWT still belongs to a valid session.
async function validateSavedSession() {
  const token = sessionStorage.getItem(tokenKey);
  if (!token) return;

  try {
    const payload = await fetchJson(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await showDashboard(payload.data);
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      clearSession();
      showAuth({
        message: "Your session has expired. Please sign in again.",
        kind: "error",
      });
      return;
    }

    showAuth({
      message:
        "Could not reach the API. Start the backend, then try signing in again.",
      kind: "error",
    });
  }
}

// Validate the form, send credentials to sign-in/sign-up, save the JWT, and open the dashboard.
async function handleAuthSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const isSignUp = form === signUpForm;
  const formData = new FormData(form);
  const credentials = Object.fromEntries(formData.entries());
  credentials.email = String(credentials.email || "")
    .trim()
    .toLowerCase();
  if (isSignUp) credentials.name = String(credentials.name || "").trim();

  const submitButton = form.querySelector('[type="submit"]');
  const buttonLabel = submitButton.querySelector(".button-label");
  const defaultLabel = isSignUp ? "Create account" : "Sign in";
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  buttonLabel.textContent = isSignUp ? "Creating account…" : "Signing in…";
  setFeedback();

  try {
    const payload = await fetchJson(
      `${API_BASE}/auth/${isSignUp ? "sign-up" : "sign-in"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      },
    );

    if (!payload.data?.token) {
      throw new Error("The server did not return a sign-in token.");
    }

    sessionStorage.setItem(tokenKey, payload.data.token);
    const userPayload = await fetchJson(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${payload.data.token}` },
    });
    resetAuthForms();
    await showDashboard(userPayload.data, { focus: true });
  } catch (error) {
    if (error.status === 401 || error.status === 403) clearSession();
    setFeedback(
      error.message || "Unable to sign in. Please try again.",
      "error",
    );
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
    buttonLabel.textContent = defaultLabel;
  }
}

signInForm.addEventListener("submit", handleAuthSubmit);
signUpForm.addEventListener("submit", handleAuthSubmit);

// Sign out locally by clearing the JWT and returning to the sign-in form.
document.getElementById("logout-button").addEventListener("click", () => {
  clearSession();
  resetAuthForms();
  openAuthForm("sign-in");
  showAuth({ message: "You have signed out.", kind: "info" });
  document.getElementById("sign-in-email").focus();
});

openAuthForm("sign-in");
validateSavedSession();
