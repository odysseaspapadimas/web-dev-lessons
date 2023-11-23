const URL = "http://localhost:3000";

const registerForm = document.querySelector("#register-form");
const usernameInput = document.querySelector("#username-input");
const passwordInput = document.querySelector("#password-input");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  const res = await fetch(`${URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (res.status === 201) {
    window.location.href = "/"
  }
});
