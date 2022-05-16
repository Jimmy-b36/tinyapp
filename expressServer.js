const express = require('express');
const app = express();
const port = 8080;

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.use((req, res, next) => {});

//set the homepage response
app.get('/', (req, res) => {
  res.send('Hello!');
});

//respond with the url database in json format
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//inline html
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b> World</b><body><html>\n');
});

app.get('*', (req, res) => {
  res.status(404);
  res.send(`${res.statusCode} This is not the page youre looking for`);
});

//show what port we're on and that the server is running
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});