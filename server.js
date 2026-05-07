const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

let db;

// تهيئة قاعدة البيانات
(async () => {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    // إنشاء جدول المستخدمين
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password_hash TEXT
        )
    `);

    // إنشاء جدول الرسائل (تأكدنا من وجود user_id)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            encrypted_text TEXT,
            plain_text TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log(">>> Database is Fresh and Ready!");
})();

// التسجيل
app.post('/api/register', async (req, res) => {
    const { user, pass } = req.body;
    try {
        const hash = await bcrypt.hash(pass, 10);
        await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [user, hash]);
        res.json({ success: true });
    } catch (e) { res.status(400).json({ error: "User exists" }); }
});

// الدخول
app.post('/api/login', async (req, res) => {
    const { user, pass } = req.body;
    const userData = await db.get('SELECT * FROM users WHERE username = ?', [user]);
    if (userData && await bcrypt.compare(pass, userData.password_hash)) {
        res.json({ success: true, userId: userData.id, userName: userData.username });
    } else { res.status(401).json({ error: "Wrong info" }); }
});

// إرسال رسالة
app.post('/api/send', async (req, res) => {
    const { uid, cipher, plain } = req.body;
    try {
        await db.run('INSERT INTO chat_messages (user_id, encrypted_text, plain_text) VALUES (?, ?, ?)', [uid, cipher, plain]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// جلب الرسائل
app.get('/api/messages/:uid', async (req, res) => {
    const msgs = await db.all('SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC', [req.params.uid]);
    res.json(msgs);
});

app.listen(3000, () => console.log("Server: http://localhost:3000"));