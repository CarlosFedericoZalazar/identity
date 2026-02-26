const API_URL = "https://identity-backend-wheat.vercel.app"

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

