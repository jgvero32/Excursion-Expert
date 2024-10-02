const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/users/register', (req, res) => {
  res.render('register');
});

app.get('/users/login', (req, res) => {
    res.render('login');
  });



app.post('/users/register', async (req, res) => {
    let { username, email, password, password2 } = req.body;
    
    console.log({
        username,
      email,
      password,
      password2
    });

    const userId = uuidv4();
    pool.query(
        `INSERT INTO users (id, username, password, email, first_name, last_name, account_type)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, password`,
        [userId, username, password, email, "first", "last", "a"],
        (err, results) => {
          if (err) {
            throw err;
          }
          console.log(results.rows);
        //   res.redirect("/users/login");
        }
      );


});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});