const API_URL = "https://identity-backend-wheat.vercel.app"

const title = document.getElementById("title-header");
const btnLogout = document.getElementById("logoutBtn");

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

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

    document.getElementById("loadUsersBtn").addEventListener("click", async () => {
      const usersRes = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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

  }
  // Siempre mostrar datos del perfil
  document.getElementById("name").textContent = data.full_name;
  document.getElementById("email").textContent = data.email;
  document.getElementById("role").textContent = data.role;

  console.log(data);
});

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});
