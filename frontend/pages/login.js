const API = "http://localhost:3001";
const TARGETS = {
  user: "/frontend/vistas/index.html",
  admin: "/frontend/vistas/admin.html",
  doctor: "/frontend/vistas/doc.html",
};

// 🔵 LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const regex = /^[^\s@]+@gmail\.com$/i;

  function isValidEmail(email) {
  return regex.test(email);
}


  // 🔥 VALIDACIÓN ANTES DEL FETCH — DETIENE EL LOGIN
  if (!isValidEmail(email)) {
    document.getElementById("msg").textContent = "Email inválido";
    return;  // ← ACÁ SE CORTA TODO. NO SE LLEGA AL FETCH.
  }

  // Si es válido, continúa el login normalmente
  const res = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.ok) {
    const role = data.data?.role || "user";
    const target = TARGETS[role] || TARGETS.user;
    window.location.href = target;
  } else {
    document.getElementById("msg").textContent =
      data.error || "Credenciales inválidas";
  }
});
// IR A REGISTRO
document.getElementById("goRegister").addEventListener("click", () => {
  window.location.href = "../register/register.html";
});
