const URL = "http://localhost:3000";

const logoutBtn = document.querySelector("#logout-btn");

const usernameSpan = document.querySelector("#username-span");

logoutBtn.addEventListener("click", async () => {
  fetch(`${URL}/logout`, { method: "POST", credentials: "include" });
  window.location.reload();
});

const getUser = async () => {
  const res = await fetch(`${URL}/user`, { credentials: "include" });

  document.querySelector("#loading-div").style.display = "none";
  document.querySelector("#main").style.display = "block";
  const data = await res.json();

  if (data) {
    usernameSpan.textContent = data.username;
    logoutBtn.style.display = "block";
  }
};

const getAllUsers = async () => {
  const res = await fetch(`${URL}/users`);

  const data = await res.json();
  console.log(data, "data");

  const usersList = document.querySelector("#users-list");

  for (const user of data) {
    const userHTML = `
          <div class="user-component">
            <i class="icon-class"></i>
            <button>Click me</button>
            <span>${user.username}</span> <!-- Assuming you want to display the username -->
          </div>
        `;

    // Append the HTML to the container
    usersList.insertAdjacentHTML("beforeend", userHTML);
  }
};

getUser();

getAllUsers();
