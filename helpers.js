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
    console.log('User', user);
    if (usersDb[user].email === email || usersDb[user].username === username) {
      return true;
    }
  }
  return false;
};

//function to check if user is authenticated
const checkLogin = (email, password, usersDb) => {
  for (const user in usersDb) {
    if (
      usersDb[user].email === email &&
      bcrypt.compareSync(password, usersDb[user].password)
    ) {
      return true;
    }
  }
  return false;
};

module.exports = { randStringGen, checkEmail, checkLogin };
