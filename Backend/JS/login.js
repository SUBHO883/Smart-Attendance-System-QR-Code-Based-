document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    // Popup div
    let popupMessage = document.getElementById("popupMessage");

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

    showPopup("✅ Login successful! Redirecting...", "green");

    setTimeout(() => {
        window.location.href = "student-dashboard.html"; // apna dashboard page
    }, 1500);
});

// popup show function
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



const passwordInput = document.getElementById("password");
    const toggleEye = document.getElementById("toggleEye");

    toggleEye.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleEye.classList.remove("bx-show");
        toggleEye.classList.add("bx-hide"); // change to hide icon
      } else {
        passwordInput.type = "password";
        toggleEye.classList.remove("bx-hide");
        toggleEye.classList.add("bx-show"); // change back to show icon
      }
    });