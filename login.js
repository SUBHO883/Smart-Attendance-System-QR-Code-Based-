document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    let popupMessage = document.getElementById("popupMessage");

    // Load registered users
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === username);

    if (!user) {
        showPopup("❌ Username not found!", "red");
        return;
    }

    if (user.password !== password) {
        showPopup("❌ Wrong password! Try again.", "red");
        return;
    }

    // Successful login
    showPopup("✅ Login successful! Redirecting...", "green");

    // Create login record with date/time
    const loginRecord = {
        id: user.id || username,
        name: user.name || username,
        email: user.email || "",
        timestamp: user.timestamp
    };

    // Save current login
    localStorage.setItem("currentUser", JSON.stringify(loginRecord));

    // Add to attendanceRecords
    let attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    attendanceRecords.push(loginRecord);
    localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));

    // Redirect after 1.5 sec
    setTimeout(() => {
        window.location.href = "student-dashboard.html";
    }, 1500);
});

function showPopup(message, color) {
    let popupMessage = document.getElementById("popupMessage");
    popupMessage.innerText = message;
    popupMessage.style.background = color;
    popupMessage.style.display = "block";
    popupMessage.style.animation = "fadeIn 0.5s ease";

    setTimeout(() => {
        popupMessage.style.animation = "fadeOut 0.5s ease";
        setTimeout(() => {
            popupMessage.style.display = "none";
        }, 500);
    }, 3000);
}
