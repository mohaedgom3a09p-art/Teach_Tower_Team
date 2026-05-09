async function auth(type) {
    const username = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;

    if(!username || !pass) return notify("Please fill all fields", "error");

    const res = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: pass})
    });
    
    const data = await res.json();

    if(res.ok) {
        if(type === 'register') {
            // حالة تسجيل حساب جديد بنجاح
            notify("Account Created Successfully! You can login now.", "success");
            document.getElementById('user').value = "";
            document.getElementById('pass').value = "";
        } else {
            // حالة تسجيل الدخول بنجاح
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
        // حالة وجود خطأ (اسم مستخدم موجود مسبقاً أو بيانات غلط)
        notify(data.error || "Something went wrong", "error");
    }
}
