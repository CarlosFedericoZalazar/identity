
export const login = async(email, password) => {
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

    // Guardar JWT
    localStorage.setItem("token", data.session.access_token);
  }
}
