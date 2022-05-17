const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const port = 8080;
app.set('view engine', 'ejs');

//use morgan to see server actions
app.use(morgan('dev'));
//use body parser
app.use(bodyParser.urlencoded({ extended: true }));

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
  const shortURL = req.params.shortURL;
  console.log('params:', req.body);

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[shortURL],
  };
  res.render('urls_show', templateVars);
});

//redirect for our short urls to the correct website
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//button to delete urls
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//button to update urls
app.post('/urls/:shortURL/update', (req, res) => {
  console.log('URLDB:', req.body);
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

//login submit form
app.post('/urls/login', (req, res) => {
  res.cookie('username', req.body.username);
  console.log('login body:', req.body);
  console.log('Cookies', req.cookie);
  res.redirect('/urls');
});

//post entered url on submit and redirect to short url page with new random short url
app.post('/urls', (req, res) => {
  let shortURL = '';
  for (let i = 0; shortURL.length < 6; i++) {
    let tmpStr = String.fromCharCode(Math.floor(Math.random() * 74 + 48));
    tmpStr = tmpStr.replace(/[&\/\\#,+()$~%.;`^'":[\]*?<_>=@{}]/, 'q');
    shortURL += tmpStr;
  }
  urlDatabase[shortURL] = req.body.longURL;
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
