document.getElementById("qrForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = document.getElementById("qrData").value;

  // backend API call
  const response = await fetch("http://127.0.0.1:3000/generate_qr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: data })
  });

  const result = await response.json();
  document.getElementById("qrImage").src = "data:image/png;base64," + result.qr_code;
});
