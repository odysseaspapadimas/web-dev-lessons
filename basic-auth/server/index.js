const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

// // Open a database connection
const db = new sqlite3.Database("test2.db");

// // Execute a SQL query to create a table for users
// async function main() {
//   db.run(
//     `
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     email TEXT,
//     password TEXT
//   )
// `
//   );

//   // Execute a SQL query to insert a new user into the table
//   const user = {
//     email: "someathinga@gmail.com",
//     password: "1234567890",
//   };

//   const hash = bcrypt.hashSync(user.password, 10);

//   console.log(bcrypt.compareSync("12345678901", hash))

//   db.run(
//     `
//   INSERT INTO users (email, password)
//   VALUES (?, ?)
// `,
//     [user.email, hash],
//     function (err) {
//       if (err) {
//         console.error(err.message);
//       } else {
//         console.log(`User with ID ${this.lastID} created`);
//       }
//     }
//   );
// }

// main();
// // Close the database connection
// db.close();

const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Add this line

const app = express();
const port = 3000;
const secretKey = "your-secret-key"; // Replace with a secure secret key

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  })
);

// Dummy user (in a real application, you would have a database)
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

// Middleware to check if the user is authenticated
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;
    next();
  });
};

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  db.run(
    `
    INSERT INTO users (username, password)
    VALUES (?, ?)
    `,
    [username, hash],
    function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`User with ID ${this.lastID} created`);

        res.sendStatus(201);
      }
    }
  );
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await loginUser(username, password);
    console.log(user, "user");

    if (user) {
      const token = jwt.sign({ ...user }, secretKey);
      console.log(token, "token");
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.redirect("http://localhost:5500/index.html");
    } else {
      console.log("error1");
      res.sendStatus(401); // Unauthorized
    }
  } catch (err) {
    console.log("error2", err);

    res.sendStatus(401);
  }
});

// Protected route (requires authentication)
app.get("/user", authenticateJWT, (req, res) => {
  console.log(req.user, "user");
  res.json({ username: req.user.username });
});

app.get("/users", (req, res) => {
  db.all(
    `
    SELECT id, username FROM users
    `,
    async (err, rows) => {
      console.log(rows, "rows");
      res.json(rows);
    }
  );
});

// Logout route
app.post("/logout", (req, res) => {
  console.log("logout");
  res.clearCookie("token");
  res.sendStatus(200); // OK
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

async function loginUser(username, password) {
  const query = "SELECT * FROM users WHERE username = ?";

  return new Promise((resolve, reject) => {
    db.get(query, [username], async (err, row) => {
      if (err) {
        console.log(err, "err");
        reject(err);
        return;
      }
      if (!row) {
        console.log("reject");
        reject();
        return;
      }
      const hashedPassword = row.password;

      const matches = await bcrypt.compare(password, hashedPassword);

      if (matches) {
        console.log("return row", row);
        resolve(row);
      } else {
        return null;
      }
    });
  });
}
