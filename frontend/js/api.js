const API_URL = "https://identity-backend-wheat.vercel.app"
// const API_URL = "http://localhost:3000";

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!data.ok) {
    alert(data.message);
  } else {
    console.log("Usuario logueado:", data);

    localStorage.setItem("token", data.session.access_token);

    window.location.href = "dashboard.html";
    
  }
};

export const createUser = async (email, password, full_name, profile) => {

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/admin/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ email, password, full_name, profile })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error creando usuario");
  }

  return data;
};

export const getUsers = async(token)=>{

  const usersRes = await fetch(`${API_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!usersRes.ok) {
    alert("No autorizado");
    return;
  }

  const users = await usersRes.json();
  return users;
};

export const resetPassword = async (token, id)=>{
  
  const res = await fetch(`${API_URL}/api/admin/reset-password/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  const data = await res.json();
  console.log(data.estado);
  return data;
};

export const updateUser = async (token, id, name, role, state) =>{

  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method:"PATCH",
    headers:{
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ 
      name,
      role,
      state
     })
  })
  const data = await res.json();
  console.log(data.estado);
  return data;
};

export const getProfile = async (token) => {
  try {

    const res = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    // Si el backend respondió error HTTP
    if (!res.ok) {
      return {
        ok: false,
        error: data.error || "auth_error",
        message: data.message || "Error de autenticación"
      };
    }

    // respuesta correcta
    return {
      ok: true,
      ...data
    };

  } catch (error) {

    return {
      ok: false,
      error: "network_error",
      message: "No se pudo conectar con el servidor"
    };

  }
};

export const deleteUserbySuperAdmin = async (token, id) => {
  try {
    const res = await fetch(`${API_URL}/api/super-admin/delete-user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "Error deleting user");
    }

    console.log(data.estado);
    return data;
  } catch (error) {
    console.error(error);
    return { ok: false, error: "network_error", message: error.message || "Error de red" };
  }
};