import express from "express";
import db from "./connect.js";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve the main UI
app.get("/", (req, res) => {
    res.render("index");
});

// ─────────────────────────────────────────────
// READ ALL USERS
// ─────────────────────────────────────────────
app.get("/api/users", (req, res) => {
    const sql = `SELECT userID, user_name, email FROM users`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// ─────────────────────────────────────────────
// READ SINGLE USER
// ─────────────────────────────────────────────
app.get("/api/users/:id", (req, res) => {
    const sql = `SELECT userID, user_name, email FROM users WHERE userID = ?`;
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(row);
    });
});

// ─────────────────────────────────────────────
// CREATE USER
// ─────────────────────────────────────────────
app.post("/api/users", (req, res) => {
    const { user_name, email, pass_word } = req.body;
    if (!user_name || !email || !pass_word) {
        return res.status(400).json({ error: "user_name, email, and pass_word are required" });
    }
    const sql = `INSERT INTO users (user_name, email, pass_word) VALUES (?, ?, ?)`;
    db.run(sql, [user_name, email, pass_word], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "User created", userID: this.lastID });
    });
});

// ─────────────────────────────────────────────
// UPDATE USER
// ─────────────────────────────────────────────
app.put("/api/users/:id", (req, res) => {
    const { user_name, email, pass_word } = req.body;
    if (!user_name || !email || !pass_word) {
        return res.status(400).json({ error: "user_name, email, and pass_word are required" });
    }
    const sql = `UPDATE users SET user_name = ?, email = ?, pass_word = ? WHERE userID = ?`;
    db.run(sql, [user_name, email, pass_word, req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated" });
    });
});

// ─────────────────────────────────────────────
// DELETE USER
// ─────────────────────────────────────────────
app.delete("/api/users/:id", (req, res) => {
    const sql = `DELETE FROM users WHERE userID = ?`;
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    });
});

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Server is running on port ${PORT}`);
});