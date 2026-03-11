const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "vishal@123",
  database: "vishal_db"
});

db.connect(err => {
  if (err) console.log("❌ DB Connection Error:", err.message);
  else console.log("✅ Connected to Nexus Database");
});

// Admin Login
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM admin_users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (result.length > 0) res.json({ success: true, message: "Welcome back, Admin" });
    else res.status(401).json({ success: false, message: "Invalid credentials" });
  });
});

app.put("/admin/message/read/:id", (req, res) => {
  const sql = "UPDATE contacts SET status='read' WHERE id=?";
  
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
}); 

// Contact Submission
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// Fetch messages for dashboard
app.get("/admin/messages", (req, res) => {
  db.query("SELECT * FROM contacts ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Delete a message
app.delete("/admin/message/:id", (req, res) => {
  db.query("DELETE FROM contacts WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

app.listen(5000, () => console.log("🚀 Backend running on Port 5000"));