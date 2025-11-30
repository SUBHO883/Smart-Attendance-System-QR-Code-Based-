document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();

    let username = document.querySelector(".Username1").value.trim();
    let email = document.querySelector(".email1").value.trim();
    let password = document.querySelector(".password1").value.trim();
    let confirmPassword = document.querySelector(".password2").value.trim();

    if (password !== confirmPassword) {
        showPopup("❌ Passwords do not match!", "red");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // duplicate username check
    if (users.find(u => u.username === username)) {
        showPopup("⚠️ Username already taken!", "orange");
        return;
    }

   // Generate unique ID for user
    let id = `S${(users.length + 1).toString().padStart(3, "0")}`;
    let timestamp = Date.now(); // registration time

    // new user add
    users.push({ id, username, name: username, email, password, timestamp });
    localStorage.setItem("users", JSON.stringify(users));

    showPopup("✅ Registered successfully!", "green");

    setTimeout(() => {
        window.location.href = "index.html"; // login page redirect
    }, 1500);
});

// popup function (same as login)
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



