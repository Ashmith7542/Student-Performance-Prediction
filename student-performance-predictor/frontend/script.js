// ================================
// GLOBAL STATE
// ================================
let currentMode = "login";

// ================================
// MODAL CONTROL
// ================================
function openModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "none";
}

// ================================
// LOGIN / SIGNUP TOGGLE
// ================================
function switchTab(mode) {

    currentMode = mode;

    const slider = document.getElementById("slider");
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");
    const submitBtn = document.getElementById("submitBtn");

    if (!slider) return;

    if (mode === "login") {
        slider.style.left = "0%";
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        submitBtn.innerText = "Login";
    } else {
        slider.style.left = "50%";
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
        submitBtn.innerText = "Signup";
    }
}

// ================================
// LOGIN / SIGNUP HANDLER
// ================================
async function handleSubmit() {

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }

    const endpoint = currentMode === "login" ? "login" : "signup";

    try {

        const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role, username, password })
        });

        const data = await response.json();

        if (data.status === "success") {

            localStorage.setItem("role", role);
            localStorage.setItem("username", username);

            if (currentMode === "login") {

                if (role === "Student") {
                    window.location.href = "dashboard_student.html";
                } else {
                    window.location.href = "dashboard_teacher.html";
                }

            } else {
                alert("Signup Successful! Please Login.");
                switchTab("login");
            }

        } else {
            alert("Operation Failed");
        }

    } catch (error) {
        alert("Server not running or connection failed.");
    }
}

// ================================
// STUDENT DASHBOARD DATA LOAD
// ================================
async function loadStudentData() {

    const username = localStorage.getItem("username");
    if (!username) return;

    try {

        const response = await fetch(`http://127.0.0.1:8000/student/${username}`);
        const data = await response.json();

        if (!data.error) {

            document.getElementById("math").innerText = data.math;
            document.getElementById("science").innerText = data.science;
            document.getElementById("english").innerText = data.english;
            document.getElementById("average").innerText = data.average.toFixed(2);

        }

    } catch (error) {
        console.error(error);
    }
}

// ================================
// TEACHER UPLOAD MARKS
// ================================
async function uploadMarks() {

    const student = document.getElementById("student").value;
    const math = parseInt(document.getElementById("math").value);
    const science = parseInt(document.getElementById("science").value);
    const english = parseInt(document.getElementById("english").value);

    if (!student || isNaN(math) || isNaN(science) || isNaN(english)) {
        alert("Please fill all fields correctly.");
        return;
    }

    try {

        const response = await fetch("http://127.0.0.1:8000/upload_marks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ student, math, science, english })
        });

        const data = await response.json();

        if (data.status === "success") {
            alert("Marks Uploaded Successfully!");
        } else {
            alert("Upload Failed");
        }

    } catch (error) {
        alert("Server error.");
    }
}

// ================================
// NAVBAR SYSTEM (CLEAN VERSION)
// ================================

document.addEventListener("DOMContentLoaded", function () {

    const username = localStorage.getItem("username");
    if (!username) return;

    const navUsername = document.getElementById("navUsername");
    const profileCircle = document.getElementById("profileCircle");

    if (navUsername) {
        navUsername.innerText = username;
    }

    if (profileCircle) {
        profileCircle.innerText = username.charAt(0).toUpperCase();
        profileCircle.style.backgroundColor = generateColor(username);
    }

    // Close dropdown if clicked outside
    document.addEventListener("click", function (e) {
        const dropdown = document.getElementById("profileDropdown");
        const container = document.querySelector(".profile-container");

        if (!dropdown || !container) return;

        if (!container.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });

});

// ================================
// PROFILE DROPDOWN TOGGLE
// ================================
function toggleProfileMenu() {

    const dropdown = document.getElementById("profileDropdown");
    if (!dropdown) return;

    dropdown.style.display =
        dropdown.style.display === "flex" ? "none" : "flex";
}

// ================================
// LOGOUT
// ================================
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// ================================
// USER COLOR GENERATOR
// ================================
function generateColor(name) {

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return `hsl(${Math.abs(hash) % 360}, 70%, 50%)`;
}