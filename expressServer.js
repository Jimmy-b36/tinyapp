const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
    password: 'test',
    username: 'test',
    userId: 'testUser',
  },
};

// --------------------------------
// FUNCTIONS
// --------------------------------

//func to generate rand string used for tiny url & user random id
const randStringGen = function () {
  let shortURL = '';
  for (let i = 0; shortURL.length < 6; i++) {
    let tmpStr = String.fromCharCode(Math.floor(Math.random() * 74 + 48));
    tmpStr = tmpStr.replace(/[&\/\\#,+()$~%.;`^'":[\]*?<_>=@{}]/, 'q');
    shortURL += tmpStr;
  }
  return shortURL;
};

//function to check if email is available
const checkEmail = (email, username) => {
  for (const user in usersDb) {
    console.log('User', user);
    if (usersDb[user].email === email || usersDb[user].username === username) {
      return true;
    }
  }
  return false;
};

//function to check if user is authenticated
const checkLogin = (email, password) => {
  for (const user in usersDb) {
    if (usersDb[user].email === email && usersDb[user].password === password) {
      return true;
    }
  }
  return false;
};

//--------------------------------
// MIDDLEWARE
//--------------------------------

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
  res.redirect('/urls');
});

// registration page
app.get('/register', (req, res) => {
  const templateVars = {
    username: req.cookies['userName'],
    email: req.cookies['userEmail'],
    userId: req.cookies['userId'],
  };
  res.render('register', templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = {
    username: req.cookies['userName'],
    email: req.cookies['userEmail'],
    userId: req.cookies['userId'],
  };
  res.render('login', templateVars);
});

//page for creating new tinyUrls
app.get('/urls/new', (req, res) => {
  const userId = req.cookies['userId'];
  if (!userId) {
    return res.status(402).send('You do not have access').redirect('/error');
  }
  const templateVars = {
    username: req.cookies['userName'],
    email: req.cookies['userEmail'],
    userId: req.cookies['userId'],
  };
  res.render('urls_new', templateVars);
});

//respond with the url database
app.get('/urls', (req, res) => {
  const uniqueUrlDb = {};
  const id = req.cookies['userId'];
  for (const url in urlDatabase) {
    if (urlDatabase[url].userId === id) {
      uniqueUrlDb[url] = urlDatabase[url];
    }
  }
  //assign cookies
  const templateVars = {
    username: req.cookies['userName'],
    email: req.cookies['userEmail'],
    userId: req.cookies['userId'],
    urls: uniqueUrlDb,
  };
  return res.render('urls_index', templateVars);
});

//error page
app.get('/error', (req, res) => {
  const templateVars = {
    username: req.cookies['userName'],
    email: req.cookies['userEmail'],
    userId: req.cookies['userId'],
  };
  return res.render('error', templateVars);
});

// page for the created urls
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  for (const urls in urlDatabase) {
    if (shortURL === urls) {
      console.log('params:', req.params);

      const templateVars = {
        username: req.cookies['userName'],
        email: req.cookies['userEmail'],
        shortURL: req.params.shortURL,
        longURL: urlDatabase[shortURL].longURL,
      };
      return res.render('urls_show', templateVars);
    }
  }
  return res.redirect('/error');
});

//redirect for our short urls to the correct website
app.get('/u/:shortURL', (req, res) => {
  console.log('params:', req.params);
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (!longURL) {
    return res.status(402).send('Page not found');
  }
  return res.redirect(longURL);
});

// ------------------------------
// POSTS
// ------------------------------

//button to delete urls
app.post('/urls/:shortURL/delete', (req, res) => {
  const userId = req.cookies['userId'];
  if (!userId) {
    return res.send("You can't do that! Please login first").status(402);
  }
  delete urlDatabase[req.params.shortURL];
  return res.redirect('/urls');
});

// button to update urls
app.post('/urls/:shortURL/update', (req, res) => {
  const userId = req.cookies['userId'];
  if (!userId) {
    return res.redirect('/error').status(402);
  }
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// registration form to create new user
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const randId = randStringGen();

  if (email === '' || password === '') {
    return (
      res.status(400).redirect('back'),
      console.log('Please enter valid user || password')
    );
  }
  if (checkEmail(email, username)) {
    return (
      res.status(400).redirect('back'),
      console.log('Email or username already taken')
    );
  }
  usersDb[randId] = {
    userId: randId,
    username,
    password,
    email,
    awesomeness: req.body.awesome ? 'true' : 'false',
  };
  console.log('Database:', usersDb);
  res
    .cookie('userName', usersDb[randId].username)
    .cookie('userId', usersDb[randId].userId)
    .cookie('userEmail', usersDb[randId].email);

  res.redirect('/urls');
});

//login submit form
app.post('/login', (req, res) => {
  if (!checkLogin(req.body.email, req.body.password)) {
    return res.status(403).redirect('back'), console.log('login not found');
  }

  for (const user in usersDb) {
    if (usersDb[user].email === req.body.email) {
      res
        .cookie('userName', usersDb[user].username)
        .cookie('userEmail', usersDb[user].email)
        .cookie('userId', usersDb[user].userId);
      res.redirect('/urls');
    }
  }
});

//logout submit button
app.post('/urls/logout', (req, res) => {
  res.clearCookie('userName').clearCookie('userEmail').clearCookie('userId');
  res.redirect('/urls');
});

//create new short url and redirect to short url page
app.post('/urls', (req, res) => {
  const userId = req.cookies['userId'];
  if (!userId) {
    return res.send('please login first').status(400);
  }
  const shortURL = randStringGen();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userId = req.cookies['userId'];
  console.log('URLDB:', urlDatabase);
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
