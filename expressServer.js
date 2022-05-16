const express = require('express');
const app = express();
const port = 8000;

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
