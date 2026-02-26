import { login } from "./js/api.js";

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // 🔥 evita que recargue la página

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await login(email, password);
});
