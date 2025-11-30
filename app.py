from flask import Flask, request, render_template_string
import sqlite3, time, os

app = Flask(__name__)
DB_FILE = "attendance.db"

# Init DB if not exists
def init_db():
    if not os.path.exists(DB_FILE):
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("""CREATE TABLE attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            name TEXT,
            code TEXT,
            time INTEGER
        )""")
        conn.commit()
        conn.close()

@app.route("/attendance")
def attendance():
    user_id = request.args.get("userId")
    name = request.args.get("name")
    code = request.args.get("code")
    ts = request.args.get("time") or int(time.time()*1000)

    # Save into DB
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT INTO attendance (userId,name,code,time) VALUES (?,?,?,?)",
              (user_id, name, code, ts))
    conn.commit()
    conn.close()

    # Success page return
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Attendance Success</title>
      <style>
        body {{ font-family: Arial, sans-serif; background:#f0fff4; display:flex; justify-content:center; align-items:center; height:100vh; }}
        .card {{ background:#fff; padding:20px; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1); text-align:center; }}
        h1 {{ color:#16a34a; }}
      </style>
      <script>
        history.pushState(null, null, location.href);
        window.onpopstate = function () {{ history.go(1); }};
      </script>
    </head>
    <body>
      <div class="card">
        <h1>✅ Attendance Recorded</h1>
        <p><strong>User ID:</strong> {user_id}</p>
        <p><strong>Name:</strong> {name}</p>
        <p>Your attendance is successfully submitted.</p>
      </div>
    </body>
    </html>
    """
    return render_template_string(html)

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
