const express = require('express');
const bcrypt = require('bcrypt');
const cors = require("cors")
const app = express();
const { pool } = require('./dbConfig');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 4000;

app.use(cors())
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, username, email, password, confirmedPassword, accountType, } = req.body;

  try {
    // check if email exist in database
    const {rows} = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (rows.length > 0) {
      console.log("Error: attempt to register account with an already exisiting email");
      res.status(403).send("*There is already an account associated with this email. If this is you, please go back and sign in. Otherwise, enter another valid email.");
      return;
    }
    //check if username exist in database
    const {rows: usernameRows} = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (usernameRows.length > 0) {
      console.log("Error: attempt to register account with an already exisiting username");
      res.status(403).send("*Your username is taken. Try another!");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new account
    console.log("register");
    console.log({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      confirmedPassword,
      accountType
    });

    // Implement database insertion logic here
    const userId = uuidv4()
    const results = await pool.query(
      `INSERT INTO users (id, username, first_name, last_name, email, password, account_type)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, password`,
      [userId, username, firstName, lastName, email, hashedPassword, accountType[0]],
    )
    res.json({success: true, message: "Successfully registered!"})
  } catch (error) {
    console.log(error)
    res.status(500).send("Something is wrong with server")
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  console.log("login");
  console.log({
    username,
    password
  });

  // check if login is correct
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (rows.length === 1) {
      const isMatch = await bcrypt.compare(password, rows[0].password);
      if (isMatch) {
        res.json({ success: true, message: "Login successfully" });
      } else {
        res.status(401).send("*The username or password you entered is incorrect. Please try again!");
      }
    } else {
      res.status(401).send("*The username or password you entered is incorrect. Please try again!");
    }
  } catch (error) {
    res.status(500).send("something is wrong with server");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
