# Secure Messaging Application - Teach Tower Team

## Project Overview
This is a secure personal messaging application developed for the **Security II** course at **Borg Al Arab Technological University (BATU)**. The app allows users to create accounts and store encrypted messages using modern cryptographic techniques.

## Team Name
**Teach Tower Team**

## Key Features
- **User Authentication:** Secure registration and login system.
- **Password Hashing:** Uses `bcrypt` to hash passwords.
- **Message Encryption:** Implements the **Caesar Cipher** (Shift 3) to ensure message confidentiality.
- **Personal Vault:** A private dashboard for each user to manage their encrypted data.

## Security Implementation
### 1. Password Hashing (bcrypt)
We use the **bcrypt** library to protect user credentials. This ensures that even if the database is compromised, the actual passwords remain secure.

### 2. Message Encryption (Caesar Cipher)
Messages are encrypted on the client-side using a Caesar Cipher with a **Shift of 3**.
- **Example:** The letter 'A' becomes 'D', 'B' becomes 'E', etc.

## Technologies Used
- **Backend:** Node.js, Express.js.
- **Database:** SQLite3 (File-based storage).
- **Security:** Bcrypt for hashing.
- **Frontend:** HTML5, CSS3, Vanilla JavaScript.

## How to Run Locally
1. Install dependencies: `npm install`
2. Start the server: `node server.js`
3. Open `http://localhost:3000` in your browser.