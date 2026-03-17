import { createUser, getUsers, resetPassword, updateUser, getProfile, deleteUserbySuperAdmin } from "./js/api.js"
import { alertNotyf } from "./components/alert.js";

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
const notyf = alertNotyf();

document.addEventListener("DOMContentLoaded", async () => {

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const data = await getProfile(token);

  if (!data.ok) {

    if (data.error === "account_disabled") {

      // const notyf = new Notyf({
      //   position: {
      //     x: "center",
      //     y: "top"
      //   },
      //   types: [
      //     {
      //       type: "success",
      //       background: "#22c55e",
      //       duration: 3000
      //     },
      //     {
      //       type: "error",
      //       background: "#ef4444",
      //       duration: 5000
      //     }
      //   ]
      // });


      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);

      notyf.error(data.message);
      return;
    }

    alert(data.error || "Error de autenticación");
    window.location.href = "index.html";
    return;
  }

  loggedUser = data;

  console.log("Usuario válido:", data);
  notyf.success(data.message);

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
  const roleElement = document.getElementById("role");
  roleElement.textContent = data.role;

  if (data.role === "user") roleElement.classList.add("badge-user");
  if (data.role === "admin") roleElement.classList.add("badge-admin");
  if (data.role === "super_admin") roleElement.classList.add("badge-super");

  if (loggedUser.role === "super_admin") {
    document.getElementById("newRoleField").style.display = "block";
  }

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
    await loadListUsers();
  };

  // Mostrar rol solo si es superadmin
  if (currentRole === "super_admin") {
    console.log("soy el rol mostra el list man");
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
  console.log("estoy en el formnewuser");
  DOM.btnNewUser.disabled = true;
  DOM.btnNewUser.textContent = "Creando...";

  const name = document.getElementById("fullName").value;
  const email = document.getElementById("emailUser").value;
  const password = document.getElementById("passwordUser").value;
  const role = loggedUser.role === "super_admin"
    ? document.getElementById("roleUser").value
    : "user";

  try {
    const result = await createUser(email, password, name, role);

    notyf.success(result.message);
    resetUI();

  } catch (error) {
    console.error(error);
    notyf.error("Error al crear usuario");

  } finally {
    DOM.btnNewUser.disabled = false;
    DOM.btnNewUser.textContent = "Crear Usuario";
  }
});

async function loadListUsers() {
  resetUI();
  const users = await getUsers(token);
  const currentRole = loggedUser.role;
  const list = document.getElementById("usersList");

  users.forEach(user => {
    const div = document.createElement("div");
    div.classList.add("user-item");

    const divButtons = document.createElement("div");
    divButtons.classList.add("container-buttonsList");


    const btnUpdateUser = document.createElement("button");
    const btnDeleteUser = document.createElement("button");

    // btnUpdateUser.id = "btnInListUpdate";
    btnUpdateUser.classList.add("btn", "btnInListUpdate");
    btnUpdateUser.textContent = "update";

    if (currentRole === 'super_admin') {
      btnDeleteUser.id = "btnInListDelete";
      btnDeleteUser.classList.add("btn", "btnInListUpdate");
      btnDeleteUser.textContent = "delete";

      btnDeleteUser.addEventListener("click", async () => {
        const result = await deleteUserbySuperAdmin(token, user.id);
        console.log(result.estado);
        resetUI();
      });
    }

    btnUpdateUser.addEventListener("click", () => {
      openEditForm(user);
    });

    const state = user.state ? `🟢 ACTIVO` : `🔴 INACTIVO`;
    div.className = "user-item";
    div.textContent = `${user.full_name} — ${user.role} - ${state}`;

    divButtons.appendChild(btnUpdateUser);
    if (currentRole === 'super_admin') divButtons.appendChild(btnDeleteUser);
    div.appendChild(divButtons);
    list.appendChild(div);
  });
}