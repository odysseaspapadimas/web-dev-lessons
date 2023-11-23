const loginButton = document.getElementById("login-btn");
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById("username-input").value;
  const passwordInput = document.getElementById("password-input").value;

  const loginEndpoint = "http://localhost:3000/login";

  // Send request to login endpoint
  const res = await fetch(loginEndpoint, {
    method: "POST",
    body: JSON.stringify({ username: usernameInput, password: passwordInput }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  console.log(res, "res");
  if (res.status === 401) {
    document.querySelector("#error-msg").style.display = "block";
  } else {
    if (res.redirected) {
      // If redirected, handle the redirect manually
      window.location.href = res.url;
    }
  }
  // Handle response data
  // Handle error
});
