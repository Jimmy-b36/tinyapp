const assert = require('chai').assert;
const {
  randStringGen,
  checkEmail,
  checkLogin,
  lookupEmail,
} = require('../helpers.js');
const bcrypt = require('bcryptjs');

const testUsers = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: bcrypt.hashSync('purple-monkey-dinosaur', 10),
    username: 'Geoffrey',
  },
  fG48ngJ: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
    username: 'Celine',
  },
};

describe('check if a username or email is valid', () => {
  it('should return true if a user with that email is found', () => {
    const user = checkEmail('user@example.com', 'geoffrey', testUsers);
    assert.isTrue(user);
  });
  it('should return true if a user with that username is found', () => {
    const user = checkEmail('user3@example.com', 'Geoffrey', testUsers);
    assert.isTrue(user);
  });
  it('should return false if a user with that email and username is not found', () => {
    const user = checkEmail('user3@example.com', 'David', testUsers);
    assert.isFalse(user);
  });
});

describe('#login auth: Checks if an entered email and password match a user', () => {
  it('should return true if a user is found for the given email and password', () => {
    const user = checkLogin(
      'user@example.com',
      'purple-monkey-dinosaur',
      testUsers
    );
    assert.isTrue(user);
  });
  it('should return false if the password is incorrect', () => {
    const user = checkLogin(
      'user@example.com',
      'purple-monk-dinosaur',
      testUsers
    );
    assert.isFalse(user);
  });
  it('should return false if the email is incorrect', () => {
    const user = checkLogin(
      'user@eample.com',
      'purple-monkey-dinosaur',
      testUsers
    );
    assert.isFalse(user);
  });
  it('should return false if the email and password is incorrect', () => {
    const user = checkLogin(
      'user@eample.com',
      'purple-monk-dinosaur',
      testUsers
    );
    assert.isFalse(user);
  });
});

describe('#random string: it should generate a 6 character random string', () => {
  it('should generate a string of length 6', () => {
    const randStr = randStringGen();
    assert.equal(randStr.length, 6);
  });
  it("should generate a string that doesn't match a current user id", () => {
    const randStr = randStringGen();
    assert.notDeepEqual(randStr, 'fG48ngJ');
  });
});

describe('#return user: it should return the user object if the user is found using the email', () => {
  it('should return a user with valid email', function () {
    const user = lookupEmail('user@example.com', testUsers);
    const expectedUserID = 'userRandomID';
    assert.equal(user.id, expectedUserID);
  });
  it('should return undefined if user does not exist', () => {
    const user = lookupEmail('user@eample.com', testUsers);
    assert.equal(user, undefined);
  });
});
