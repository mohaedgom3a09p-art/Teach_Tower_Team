async function auth(type) {
    const userVal = document.getElementById('user').value;
    const passVal = document.getElementById('pass').value;

    if(!userVal || !passVal) return notify("Please fill all fields", "error");

    try {
        const res = await fetch(`/api/${type}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: userVal, password: passVal})
        });

        const data = await res.json();

        // لو السيرفر رد بنجاح (كود 200)
        if (res.ok) {
            if (type === 'register') {
                // حالة إنشاء حساب جديد
                notify("Account Created! You can sign in now.", "success");
                // بنصفر الخانات عشان يسجل دخول بيهم
                document.getElementById('user').value = "";
                document.getElementById('pass').value = "";
            } else {
                // حالة تسجيل الدخول
                currentUser = data;
                notify("Login Successful! Welcome back.", "success");
                setTimeout(() => {
                    document.getElementById('auth-section').style.display = 'none';
                    document.getElementById('chat-section').style.display = 'block';
                    document.getElementById('welcome-msg').innerText = `Hi, ${data.username}`;
                    loadMessages();
                }, 1000);
            }
        } else {
            // لو في أي مشكلة (زي إن اليوزر موجود أصلاً أو الباسورد غلط)
            notify(data.error || "Operation failed", "error");
        }
    } catch (err) {
        notify("Server Connection Error", "error");
    }
}
