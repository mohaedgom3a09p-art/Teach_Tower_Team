const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;
(async () => {
    db = await open({ filename: './database.db', driver: sqlite3.Database });
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password_hash TEXT
        );
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER,
            receiver_id INTEGER,
            ciphertext TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
})();

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
        res.json({ success: true });
    } catch (e) { res.status(400).json({ error: "Username exists" }); }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (user && await bcrypt.compare(password, user.password_hash)) {
        // نرسل الـ Hash والـ ID مع بيانات الدخول للبروفايل
        res.json({ id: user.id, username: user.username, password_hash: user.password_hash });
    } else { res.status(401).json({ error: "Invalid credentials" }); }
});

app.post('/api/send', async (req, res) => {
    const { sender_id, receiver_username, ciphertext } = req.body;
    const receiver = await db.get('SELECT id FROM users WHERE username = ?', [receiver_username]);
    if (!receiver) return res.status(404).json({ error: "User not found" });
    await db.run('INSERT INTO messages (sender_id, receiver_id, ciphertext) VALUES (?, ?, ?)', [sender_id, receiver.id, ciphertext]);
    res.json({ success: true });
});

// جلب الرسائل مع الوقت والـ IDs لكل مستخدم
app.get('/api/all-data', async (req, res) => {
    try {
        const messages = await db.all(`
            SELECT m.id as msg_id, 
                   u1.id as s_id, u1.username as sender, 
                   u2.id as r_id, u2.username as receiver, 
                   m.ciphertext, m.timestamp 
            FROM messages m 
            JOIN users u1 ON m.sender_id = u1.id 
            JOIN users u2 ON m.receiver_id = u2.id
            ORDER BY m.id DESC
        `);
        res.json({ messages });
    } catch (e) { res.status(500).json({ error: "DB Error" }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
