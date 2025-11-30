// Simulated backend storage
let generatedOTP = null;
let verifiedEmail = null;

// Step 1: Send OTP
function sendOTP() {
    const email = document.querySelector(".email3").value.trim();
    const message = document.getElementById("message");

    if (!email) {
        message.textContent = "⚠️ Please enter your registered email.";
        message.style.color = "red";
        setTimeout(() => {
        message.textContent = "";
    }, 3000);
        return;
    }

    // Generate random 6 digit OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    verifiedEmail = email;

    // Simulate sending OTP to email
    alert("📩 OTP sent to " + email + " (Demo OTP: " + generatedOTP + ")");
    message.textContent = "OTP has been sent to your email.";
    message.style.color = "green";
    setTimeout(() => {
        message.textContent = "";
    }, 3000);
}

// Step 2: Verify OTP
function verifyOTP() {
    const otpInput = document.querySelector(".OTP3").value.trim();
    const message = document.getElementById("message");

    if (!otpInput) {
        message.textContent = "⚠️ Please enter the OTP.";
        message.style.color = "red";
        setTimeout(() => {
        message.textContent = "";
    }, 3000);
        return;
    }

    if (otpInput === generatedOTP) {
        message.textContent = "✅ OTP Verified! You can now reset your password.";
        message.style.color = "green";
        

        // Allow password reset
        document.querySelector(".new_password").disabled = false;
        document.querySelector(".confirmPassword3").disabled = false;
        document.querySelector(".reset_button").disabled = false;
    } else {
        message.textContent = "❌ Invalid OTP. Try again.";
        message.style.color = "red";
    }
}

// Step 3: Reset Password
function resetPassword() {
    const newPassword = document.getElementById("newPassword3").value.trim();
    const confirmPassword = document.getElementById("confirmPassword3").value.trim();
    const message = document.getElementById("message");

    if (!newPassword || !confirmPassword) {
        message.textContent = "⚠️ Please fill in both password fields.";
        message.style.color = "red";
        setTimeout(() => {
        message.textContent = "";
    }, 3000);
        return;
    }

    if (newPassword !== confirmPassword) {
        message.textContent = "⚠️ Passwords do not match.";
        message.style.color = "red";
        setTimeout(() => {
        message.textContent = "";
    }, 3000);
        return;
    }

    message.textContent = "✅ Password has been reset successfully for " + verifiedEmail;
    message.style.color = "green";

    login1.addEventListener("click", () => {
  currentForm = "index.html";
  updateForm();
});


    // Clear values (simulating save in DB)
    document.querySelector(".email3").value = "";
    document.querySelector(".OTP3").value = "";
    document.getElementById("newPassword3").value = "";
    document.getElementById("confirmPassword3").value = "";
    generatedOTP = null;
    verifiedEmail = null;




}
