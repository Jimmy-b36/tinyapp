const bcrypt = require('bcryptjs');

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
const checkEmail = (email, username, usersDb) => {
  for (const user in usersDb) {
    if (lookupEmail(email, usersDb) || usersDb[user].username === username) {
      return true;
    }
  }
  return false;
};

//function to check if user is authenticated
const checkLogin = (email, password, usersDb) => {
  for (const user in usersDb) {
    if (
      lookupEmail(email, usersDb) &&
      bcrypt.compareSync(password, usersDb[user].password)
    ) {
      return true;
    }
  }
  return false;
};

//function to return the user when looking for them with the given email
const lookupEmail = (email, usersDb) => {
  for (const user in usersDb) {
    if (usersDb[user].email === email) {
      return usersDb[user];
    }
  }
  return undefined;
};

//function to check if a user is authourized to view a page
const userAuth = (userId, urlDatabase, shortURL) => {
  if (!userId || userId !== urlDatabase[shortURL].userId) {
    return false;
  }
  return true;
};

//function to return all the urls belonging to a user
const usersUrls = (userId, urlDatabase) => {
  const uniqueUrlDb = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userId === userId) {
      uniqueUrlDb[url] = urlDatabase[url];
    }
  }
  return uniqueUrlDb;
};

module.exports = {
  randStringGen,
  checkEmail,
  checkLogin,
  lookupEmail,
  userAuth,
  usersUrls,
};
