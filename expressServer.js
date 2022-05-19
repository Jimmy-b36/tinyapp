const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const bodyParser = require('body-parser');
const {
  randStringGen,
  checkEmail,
  checkLogin,
  lookupEmail,
} = require('./helpers.js');
// const cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
const morgan = require('morgan');
const port = 8080;
app.set('view engine', 'ejs');

//--------------------------------
//DATABASES
//--------------------------------

//example urlDB
const urlDatabase = {
  b2xVn2: { longURL: 'http://www.lighthouselabs.ca', userId: 'testUser' },
};

//example userDb entry
const usersDb = {
  testUser: {
    email: 'a@a.com',
    password: bcrypt.hashSync('test', 10),
    username: 'test',
    userId: 'testUser',
    awesome: 'true',
  },
};

//--------------------------------
// MIDDLEWARE
//--------------------------------

//use morgan to see server actions
app.use(morgan('dev'));

//cookie session for encrypted cookies
app.use(
  cookieSession({
    name: 'User',
    keys: ['this', 'is', 'my', 'secret'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

//use body parser
app.use(bodyParser.urlencoded({ extended: true }));

// --------------------------------
// GET ROUTES
// --------------------------------

//set the homepage response
app.get('/', (req, res) => {
  return res.redirect('/urls');
});

// registration page
app.get('/register', (req, res) => {
  const templateVars = {
    username: req.session.username,
    email: req.session.email,
    userId: req.session.userId,
    awesome: req.session.awesome,
  };
  return res.render('register', templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = {
    username: req.session.username,
    email: req.session.email,
    userId: req.session.userId,
    awesome: req.session.awesome,
  };
  return res.render('login', templateVars);
});

//page for creating new tinyUrls
app.get('/urls/new', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(402).send('You do not have access');
  }
  const templateVars = {
    username: req.session.username,
    email: req.session.email,
    userId: req.session.userId,
    awesome: req.session.awesome,
  };
  return res.render('urls_new', templateVars);
});

//respond with the url database
app.get('/urls', (req, res) => {
  const uniqueUrlDb = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userId === req.session.userId) {
      uniqueUrlDb[url] = urlDatabase[url];
    }
  }
  //assign cookies
  const templateVars = {
    username: req.session.username,
    email: req.session.email,
    userId: req.session.userId,
    awesome: req.session.awesome,
    urls: uniqueUrlDb,
  };
  return res.render('urls_index', templateVars);
});

// page for the created urls
app.get('/urls/:shortURL', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send('You do not have access').status(401);
  }
  const shortURL = req.params.shortURL;
  for (const urls in urlDatabase) {
    if (shortURL === urls) {
      const templateVars = {
        username: req.session.username,
        email: req.session.email,
        shortURL: req.params.shortURL,
        awesome: req.session.awesome,
        longURL: urlDatabase[shortURL].longURL,
      };
      return res.render('urls_show', templateVars);
    }
  }
  return res.redirect('/url');
});

//redirect for our short urls to the correct website
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (!longURL) {
    return res.status(402).send('Page not found');
  }
  return res.redirect(longURL);
});

// ------------------------------
// POST ROUTES
// ------------------------------

//button to delete urls
app.post('/urls/:shortURL/delete', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send("You can't do that! Please login first").status(402);
  }
  delete urlDatabase[req.params.shortURL];
  return res.redirect('/urls');
});

// button to update urls
app.post('/urls/:shortURL/update', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send('You do not have access').status(401);
  }
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.longURL;
  return res.redirect(`/urls/${shortURL}`);
});

// registration form to create new user
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const username = req.body.username;
  const randId = randStringGen();

  if (email === '' || password === '') {
    return (
      res.status(400).redirect('back'),
      console.log('Please enter valid user || password')
    );
  }
  if (checkEmail(email, username, usersDb)) {
    return (
      res.status(400).redirect('back'),
      console.log('Email or username already taken')
    );
  }
  usersDb[randId] = {
    userId: randId,
    username,
    password: hashedPassword,
    email,
    awesome: req.body.awesome ? 'true' : 'false',
  };
  req.session.username = usersDb[randId].username;
  req.session.email = usersDb[randId].email;
  req.session.userId = usersDb[randId].userId;
  req.session.awesome = usersDb[randId].awesome;

  return res.redirect('/urls');
});

//login submit form
app.post('/login', (req, res) => {
  if (!checkLogin(req.body.email, req.body.password, usersDb)) {
    return res.status(403).redirect('back'), console.log('login not found');
  }
  const email = req.body.email;
  const user = lookupEmail(email, usersDb);
  req.session.username = user.username;
  req.session.email = user.email;
  req.session.userId = user.userId;
  req.session.awesome = user.awesome;
  return res.redirect('/urls');
});

//logout submit button
app.post('/urls/logout', (req, res) => {
  return (req.session = null), res.redirect('/urls');
});

//create new short url and redirect to short url page
app.post('/urls', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send('Please login first').status(400);
  }
  const shortURL = randStringGen();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userId = req.session.userId;

  return res.redirect(`/urls/${shortURL}`);
});

//catch all and 404 responder
app.get('*', (req, res) => {
  res.status(404);
  return res.send(`${res.statusCode} This is not the page you're looking for`);
});

//show what port we're on and that the server is running
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
