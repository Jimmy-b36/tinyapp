const express = require('express');
const app = express();
const morgan = require('morgan');
const port = 8080;
app.set('view engine', 'ejs');

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.use(morgan('dev'));

//set the homepage response
app.get('/', (req, res) => {
  res.send('Hello!');
});

//respond with the url database
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase.b2xVn2,
  };
  res.render('urls_show', templateVars);
});

//inline html
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b> World</b><body><html>\n');
});

app.get('*', (req, res) => {
  res.status(404);
  res.send(`${res.statusCode} This is not the page you're looking for`);
});

//show what port we're on and that the server is running
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
