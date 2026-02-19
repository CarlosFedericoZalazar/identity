
export const login = async (email, password) => {
  const res = await fetch("http://localhost:3000/api/auth/login", {
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

    // 👇 ahora pedimos el perfil
    const me = await getMe();
    console.log("Perfil:", me);
  }
};

export const getMe = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No hay token");
    return;
  }

  const res = await fetch("http://localhost:3000/api/auth/me", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  return data;
};
