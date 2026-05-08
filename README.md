# Secure Messaging Application - BATU Project
### Developed by: **Tech Tower Team**
**University:** Borg Al Arab Technological University (BATU)

---

## 📌 Project Overview
This is a secure web-based messaging application developed using **Node.js** and **JavaScript**. The project implements core cryptographic concepts to ensure user data privacy and secure communication.

## 🛡️ Security Features

### 1. Password Hashing (Bcrypt)
We do not store plain-text passwords. Instead, we use the `bcrypt` library to hash passwords with a **Salt** before saving them to the SQLite database. 
- **Why?** This prevents attackers from reading passwords even if they gain access to the database.

### 2. Message Encryption (Caesar Cipher)
Messages are encrypted on the client side before being sent to the server using the **Caesar Cipher** algorithm with a **Shift of 3**.
- **Encryption:** `ciphertext = (plaintext_char + 3)`
- **Decryption:** `plaintext = (ciphertext_char - 3)`
- **Goal:** To demonstrate how data remains unreadable (Ciphertext) while stored in the database.

### 3. Session Security
The application uses **Volatile Session Management**. For maximum security, the user session is cleared upon page refresh (Logout on Refresh), ensuring that unauthorized users cannot access the chat without re-authentication.

---

## 🚀 How to Run the Project
1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
