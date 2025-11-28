from flask import Flask, render_template_string
import qrcode
import io
import base64
import socket

app = Flask(__name__)
PORT = 5000

# Function to get local IP automatically
def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Ye Google DNS pe connect karke local IP detect karega
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

INDEX_HTML = """
<!doctype html>
<html lang="hi">
  <head>
    <meta charset="utf-8">
    <title>QR Demo</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      body { font-family: Arial, sans-serif; text-align:center; padding:30px; }
      .card { display:inline-block; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
      img { width:260px; height:260px; }
      .info { margin-top:12px; color:#333; }
      .small { font-size:0.9rem; color:#666; margin-top:6px;}
    </style>
  </head>
  <body>
    <h1>QR Code Demo</h1>
    <div class="card">
      <p>Apne phone se is QR ko scan karo:</p>
      <img src="data:image/png;base64,{{ qr_base64 }}" alt="QR code">
      <div class="info">Scan karne par yeh URL open hoga:</div>
      <div class="small">{{ target_url }}</div>
    </div>
  </body>
</html>
"""

@app.route("/")
def index():
    local_ip = get_local_ip()
    target = f"http://{local_ip}:{PORT}/show"

    # QR generate
    qr = qrcode.QRCode(box_size=10, border=2)
    qr.add_data(target)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    return render_template_string(INDEX_HTML, qr_base64=qr_base64, target_url=target)

@app.route("/show")
def show():
    return """
    <!doctype html>
    <html lang="hi">
      <head>
        <meta charset="utf-8">
        <title>QR Scanned</title>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; text-align:center; padding:50px; background-color:#f9f9f9; }
          h1 { color: #2e8b57; }
          p { font-size:1.2rem; color:#333; }
        </style>
      </head>
      <body>
        <h1>✅ Thanks!</h1>
        <p>Thanks for scanning my QR code</p>
      </body>
    </html>
    """

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
