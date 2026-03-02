const API_URL = "https://identity-backend-wheat.vercel.app"

const title = document.getElementById("title-header");
const btnLogout = document.getElementById("logoutBtn");
const btnNewUser = document.getElementById("newUsersBtn");

const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    window.location.href = "index.html";
    return;
  }

  const data = await res.json();

  // Solo admin ve sección admin
  if (data.role === "admin") {
    document.getElementById("adminSection").style.display = "block";
    title.textContent = "ADMINISTRADOR"
  }

  // Siempre mostrar datos del perfil
  document.getElementById("name").textContent = data.full_name;
  document.getElementById("email").textContent = data.email;
  document.getElementById("role").textContent = data.role;

  console.log(data);
});


// logica de botones

document.getElementById("loadUsersBtn").addEventListener("click", async () => {
  const usersRes = await fetch(`${API_URL}/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const section = document.getElementById("newUserSection");
  section.style.display = "none";
  console.log("STATUS:", usersRes.status);
  if (!usersRes.ok) {
    alert("No autorizado");
    return;
  }

  const users = await usersRes.json();

  const list = document.getElementById("usersList");
  list.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.textContent = `${user.full_name} — ${user.role}`;
    list.appendChild(div);
  });
});

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

btnNewUser.addEventListener("click", () => {
  const list = document.getElementById("usersList");
  list.innerHTML = "";
  const section = document.getElementById("newUserSection");
  section.style.display = section.style.display === "none" ? "block" : "none";
  if (section.style.display === "block") {
    btnNewUser.textContent = "CANCELAR";
    btnNewUser.style.backgroundColor = "#f92525";
  } else {
    btnNewUser.textContent = "Crear Usuario";
    btnNewUser.style.backgroundColor = "#3b82f6";
  }
});



