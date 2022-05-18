const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const port = 8080;
app.set('view engine', 'ejs');

//------------------------------------------------
//DATABASES
//------------------------------------------------

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

const usersDb = {
  user1: {
    username: 'user1',
    password: 'password',
    email: 'a@a.com',
  },
};

// --------------------------------
// FUNCTIONS
// --------------------------------

const randStringGen = function () {
  let shortURL = '';
  for (let i = 0; shortURL.length < 6; i++) {
    let tmpStr = String.fromCharCode(Math.floor(Math.random() * 74 + 48));
    tmpStr = tmpStr.replace(/[&\/\\#,+()$~%.;`^'":[\]*?<_>=@{}]/, 'q');
    shortURL += tmpStr;
  }
  return shortURL;
};

const checkEmail = (email, username) => {
  for (const user in usersDb) {
    if (usersDb[user].email === email || usersDb[user].username === username) {
      return false;
    }
    return true;
  }
};

//----------------------------------------------------------
// MIDDLEWARE
//----------------------------------------------------------
//use morgan to see server actions
app.use(morgan('dev'));

//use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------------------------
// ROUTES
// --------------------------------

//set the homepage response
app.get('/', (req, res) => {
  res.send('Hello!');
});

// registration page
app.get('/register', (req, res) => {
  const templateVars = { username: req.cookies['userId'] };
  res.render('register', templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = { username: req.cookies['userId'] };
  res.render('login', templateVars);
});

//page for creating new tinyUrls
app.get('/urls/new', (req, res) => {
  const templateVars = { username: req.cookies['userId'] };
  res.render('urls_new', templateVars);
});

//respond with the url database
app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.cookies['userId'],
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

// page for the created urls
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  console.log('params:', req.body);

  const templateVars = {
    username: req.cookies['userId'],
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

// ------------------------
// POSTS
// ------------------------

//button to delete urls
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

// button to update urls
app.post('/urls/:shortURL/update', (req, res) => {
  console.log('URLDB:', req.body);
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// registration form to create new user
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  if (email === '' || password === '') {
    return (
      res.status(400).redirect('back'),
      console.log('Please enter valid user || password')
    );
  }
  if (!checkEmail(email, username)) {
    return (
      res.status(400).redirect('back'),
      console.log('Email or username already taken')
    );
  }
  usersDb[username] = {
    username,
    password,
    email,
    awesomeness: req.body.awesome ? 'true' : 'false',
  };
  res.cookie('userId', usersDb[username].username);
  res.redirect('/urls');
});

//login submit form
app.post('/urls/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

//logout submit button
app.post('/urls/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

//post entered url on submit and redirect to short url page with new random short url
app.post('/urls', (req, res) => {
  const shortURL = randStringGen();
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
