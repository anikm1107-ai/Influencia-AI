// Login-page interactions and demo-only form validation.
// Real account creation/sign-in will be connected to Supabase Auth in the backend step.

const slider = document.getElementById("formSlider");
const highlight = document.getElementById("tabHighlight");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const title = document.getElementById("formTitle");
const subtitle = document.getElementById("formSubtitle");
const toast = document.getElementById("authToast");

function switchAuth(mode) {
    const isSignup = mode === "signup";

    slider.style.transform = isSignup ? "translateX(-50%)" : "translateX(0)";
    highlight.style.transform = isSignup ? "translateX(100%)" : "translateX(0)";
    loginTab.classList.toggle("active", !isSignup);
    signupTab.classList.toggle("active", isSignup);
    title.textContent = isSignup ? "Create your space" : "Welcome back";
    subtitle.textContent = isSignup
        ? "Set up your profile and find your creative community."
        : "Sign in and pick up where your creativity left off.";
    toast.className = "auth-toast";
}

loginTab.addEventListener("click", () => switchAuth("login"));
signupTab.addEventListener("click", () => switchAuth("signup"));

document.querySelectorAll("[data-switch]").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        switchAuth(link.dataset.switch);
    });
});

document.querySelectorAll(".eye").forEach((button) => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        input.type = input.type === "password" ? "text" : "password";
        button.textContent = input.type === "password" ? "◉" : "◎";
    });
});

const password = document.getElementById("signupPassword");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

password.addEventListener("input", () => {
    const value = password.value;
    let score = 0;

    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    strengthBar.style.width = `${score * 25}%`;
    strengthBar.style.background = score < 2 ? "#fb7185" : score < 4 ? "#fbbf24" : "#34d399";
    strengthText.textContent = value.length === 0
        ? "Use 8+ characters for a stronger password"
        : ["", "Needs more variety", "Getting stronger", "Good password", "Strong password"][score];
});

function notify(message, isError = false) {
    toast.textContent = message;
    toast.className = `auth-toast show${isError ? " error" : ""}`;
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value;

    if (!isValidEmail(email)) return notify("Please enter a valid email address.", true);
    if (pass.length < 6) return notify("Please enter a password with at least 6 characters.", true);

    notify("Frontend demo only: connect Supabase Auth to enable real sign-in.");
});

document.getElementById("signupForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const pass = password.value;
    const role = document.querySelector('input[name="role"]:checked').value;

    if (!name) return notify("Please enter your name.", true);
    if (!isValidEmail(email)) return notify("Please enter a valid email address.", true);
    if (pass.length < 8) return notify("Your password must contain at least 8 characters.", true);
    if (!document.getElementById("terms").checked) return notify("Please accept the terms to continue.", true);

    notify(`Looks good, ${name}! Your ${role} signup UI is ready. Connect Supabase Auth to create the account.`);
});

document.getElementById("forgotLink").addEventListener("click", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const hasValidEmail = email && isValidEmail(email);

    notify(
        hasValidEmail
            ? "Password reset will work once Supabase Auth is connected."
            : "Enter your email address first, then request a reset link.",
        !hasValidEmail
    );
});

const params = new URLSearchParams(window.location.search);

if (params.get("mode") === "signup") switchAuth("signup");

if (params.get("role") === "recruiter") {
    switchAuth("signup");
    document.querySelector('input[name="role"][value="recruiter"]').checked = true;
}
