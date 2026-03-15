import { createUser, getUsers, resetPassword, updateUser } from "./js/api.js"


// const API_URL = "https://identity-backend-wheat.vercel.app"
const API_URL = "http://localhost:3000";


const DOM = {
  title: document.getElementById("title-header"),
  btnLogout: document.getElementById("logoutBtn"),
  btnNewUser: document.getElementById("newUsersBtn"),
  formNewUser: document.getElementById("newUserForm"),

  newUserSection: document.getElementById("newUserSection"),
  editUserSection: document.getElementById("editUserSection"),
  usersList: document.getElementById("usersList")
};

const token = localStorage.getItem("token");

// VARIABLES
let loggedUser = null;
let nemeEdited = null;
let roleEdited = null;
let data = null;

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

  data = await res.json();

  if (!res.ok) {

    if (data.error === "account_disabled") {

      const notyf = new Notyf({
        position: {
          x: "center",
          y: "top"
        },
        types: [
          {
            type: "success",
            background: "#22c55e",
            duration: 3000
          },
          {
            type: "error",
            background: "#ef4444",
            duration: 5000
          }
        ]
      });

      notyf.error(data.message);

      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

      return;
    }

    alert(data.error || "Error de autenticación");
    window.location.href = "index.html";
    return;
  }

  loggedUser = data;

  console.log("Usuario válido:", data);

  // Solo admin ve sección admin
  if (data.role === "admin" || data.role === "super_admin") {
    document.getElementById("adminSection").style.display = "block";
    data.role === "admin"
      ? DOM.title.textContent = "ADMINISTRADOR"
      : DOM.title.textContent = "SUPER ADMINISTRADOR";
  }
  // Siempre mostrar datos del perfil
  document.getElementById("name").textContent = data.full_name;
  document.getElementById("email").textContent = data.email;
  document.getElementById("role").textContent = data.role;
  
  console.log(data);
});

function resetUI() {
  DOM.newUserSection.style.display = "none";
  DOM.editUserSection.style.display = "none";
  DOM.usersList.innerHTML = "";

  DOM.btnNewUser.textContent = "Crear Usuario";
  DOM.btnNewUser.style.backgroundColor = "#3b82f6";
}

function openEditForm(user) {
  resetUI();
  const currentRole = loggedUser.role;
  const btnCancel = document.getElementById("btnEdit-cancel");
  const btnSave = document.getElementById("btnEdit-save");

  document.getElementById("editUserSection").style.display = "block";
  document.getElementById("editFullName").value = user.full_name;

  const btnResetPassword = document.getElementById("resetPasswordBtn");
  const btnEditState = document.getElementById("editState");

  btnEditState.classList.add("btn");

  let state = user.state;

  function renderState() {
    btnEditState.textContent = state ? "ACTIVO" : "INACTIVO";
    btnEditState.style.background = state
      ? "var(--userActive)"
      : "var(--userInactive)";
  }

  renderState();

  btnEditState.onclick = (e) => {
    e.preventDefault();

    state = !state;
    user.state = state;
    renderState();
  };

  btnResetPassword.onclick = async () => {
    const message = await resetPassword(token, user.id);
    alert(`${message.message}\n Contraseña Temporal: ${message.temporaryPassword}`);
  };

  btnCancel.onclick = async (e) => {
    e.preventDefault();
    await loadListUsers();
  };

  // Mostrar rol solo si es superadmin
  if (currentRole === "super_admin") {
    document.getElementById("roleField").style.display = "block";
    document.getElementById("editRole").value = user.role;
  } else {
    document.getElementById("roleField").style.display = "none";
  }

  btnSave.onclick = async (e) => {
    e.preventDefault();


    const textName = document.getElementById("editFullName");
    user.full_name = textName.value;
    if (currentRole === "super_admin")
      user.role = document.getElementById("editRole").value;
    await updateUser(token, user.id, user.full_name, user.role, user.state);
    await loadListUsers();
  };

}

document.getElementById("loadUsersBtn").addEventListener("click", async () => {
  await loadListUsers();
});

DOM.btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

DOM.btnNewUser.addEventListener("click", () => {

  if (DOM.btnNewUser.textContent === "CANCELAR") {
    resetUI();
    return;
  }
  resetUI();

  const section = document.getElementById("newUserSection");
  section.style.display = "block";

  DOM.btnNewUser.textContent = "CANCELAR";
  DOM.btnNewUser.style.backgroundColor = "#f92525";
});

DOM.formNewUser.addEventListener("submit", async (e) => {
  e.preventDefault();

  DOM.btnNewUser.disabled = true;
  DOM.btnNewUser.textContent = "Creando...";

  const name = document.getElementById("fullName").value;
  const email = document.getElementById("emailUser").value;
  const password = document.getElementById("passwordUser").value;
  // const profile = document.getElementById("roleUser").value; 

  try {
    const result = await createUser(email, password, name, "user");

    console.log("Usuario creado:", result);

    alert("Usuario creado correctamente");
    resetUI();
  } catch (error) {
    console.error(error);
    alert("Error al crear usuario");
  }
});

async function loadListUsers() {
  resetUI();
  const users = await getUsers(token);
  const list = document.getElementById("usersList");

  users.forEach(user => {
    const div = document.createElement("div");
    div.classList.add("user-item");
    const btnUpdateUser = document.createElement("button");

    btnUpdateUser.id = "btnInListUpdate";
    btnUpdateUser.classList.add("btn");
    btnUpdateUser.textContent = "update";

    btnUpdateUser.addEventListener("click", () => {
      openEditForm(user);
    });

    const state = user.state ? `🟢 ACTIVO` : `🔴 INACTIVO`;
    div.className = "user-item";
    div.textContent = `${user.full_name} — ${user.role} - ${state}`;
    div.appendChild(btnUpdateUser);
    list.appendChild(div);
  });
}