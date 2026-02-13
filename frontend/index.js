import {login} from "./js/api.js"

const btnInput = document.getElementById("button-button")

btnInput.addEventListener("click", async (e) => {

  const email = document.getElementById("input-email").value;
  const password = document.getElementById("input-password").value;

  login(email,password);
});