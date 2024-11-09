const express = require('express');
const bcrypt = require('bcrypt');
const cors = require("cors")
const app = express();
const { pool } = require('./dbConfig');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'change-to-something-secret';
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
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '12h' });
    res.json({success: true, message: "Successfully registered!", token: token, accountType: accountType[0]});
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
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token:token, accountType: rows[0].account_type });
        // res.json({ success: true, message: "Login successfully" });
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

app.get('/api/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;

    const { rows } = await pool.query("SELECT username, first_name, last_name, email, account_type FROM users WHERE username = $1", [username]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    res.json({
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      accountType: user.account_type,
    });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
