const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = 8080;
app.set('view engine', 'ejs');

//use morgan to see server actions
app.use(morgan('dev'));
//use body parser
app.use(bodyParser.urlencoded({ extended: true }));

const generateRandString = () => {
  let randString = '';
  for (let i = 0; randString.length < 6; i++) {
    let tmpStr = String.fromCharCode(Math.floor(Math.random() * 74 + 48));
    tmpStr = tmpStr.replace(/[&\/\\#,+()$~%.;`'":[\]*?<_>=@{}]/, 'q');
    randString += tmpStr;
  }
  return randString;
};

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

//set the homepage response
app.get('/', (req, res) => {
  res.send('Hello!');
});

//page for creating new tinyUrls
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

//respond with the url database
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// page for the created urls
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: req.params.longURL,
  };
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  let shortURL = '';
  for (let i = 0; shortURL.length < 6; i++) {
    let tmpStr = String.fromCharCode(Math.floor(Math.random() * 74 + 48));
    tmpStr = tmpStr.replace(/[&\/\\#,+()$~%.;`'":[\]*?<_>=@{}]/, 'q');
    shortURL += tmpStr;
  }
  urlDatabase[shortURL] = req.params.longURL;
  console.log(req.body); // Log the POST request body to the console
  res.redirect(`/urls/${shortURL}`);
});

//catch all and 404 responder
app.get('*', (req, res) => {
  res.status(404);
  res.send(`${res.statusCode} This is not the page you're looking for`);
});

//show what port we're on and that the server is running
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
